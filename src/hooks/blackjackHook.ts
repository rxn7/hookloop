import { calculateHandValue as calculateHandScore, CardData } from "@/card";
import { Deck } from "@/deck";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";

export enum GameStatus {
	NONE,
	BETTING,
	PLAYER_TURN,
	DEALER_TURN,
	GAME_OVER,
}

export interface BlackjackEvent { }
export class HitEvent implements BlackjackEvent { }
export class StandEvent implements BlackjackEvent { }
export class RestartEvent implements BlackjackEvent { }
export class WinEvent implements BlackjackEvent { }
export class LoseEvent implements BlackjackEvent { }
export class PushEvent implements BlackjackEvent { }
export class CardDrawEvent implements BlackjackEvent { 
	constructor(public readonly score: number, public readonly hand: CardData[]) { }
}

export interface Blackjack {
	status: GameStatus;
	playerHand: CardData[];
	dealerHand: CardData[];
	playerScore: number;
	dealerScore: number;
	isProcessing: boolean;
	bet: () => void;
	hit: () => void;
	stand: () => void;
	restart: () => void;
};

export default function useBlackjack(onEvent?: (event: BlackjackEvent) => Promise<void>): Blackjack {
	const deckRef = useRef<Deck>(null);
	
	const [status, setStatus] = useState<GameStatus>(GameStatus.PLAYER_TURN);
	const [dealerHand, setDealerHand] = useState<CardData[]>([]);
	const [playerHand, setPlayerHand] = useState<CardData[]>([]);

	const playerScore = useMemo(() => calculateHandScore(playerHand), [playerHand]);
	const dealerScore = useMemo(() => calculateHandScore(dealerHand), [dealerHand]);

	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	useEffect(() => {
		deckRef.current = new Deck();
		startNewGame();
	}, []);

	const startNewGame = async () => {
		if(isProcessing) return;
		setIsProcessing(true);

		setStatus(GameStatus.NONE);

		deckRef.current.reset();
		deckRef.current.shuffle();

		setDealerHand([]);
		setPlayerHand([]);

		await onEvent?.(new RestartEvent());

		setStatus(GameStatus.BETTING);
		setIsProcessing(false);
	};

	const dealFirstCards = async () => {
		if(isProcessing) return;
		setIsProcessing(true);

		setStatus(GameStatus.NONE);

		const dealerHand: CardData[] = [deckRef.current.draw()];
		setDealerHand(dealerHand);
		await onEvent?.(new CardDrawEvent(calculateHandScore(dealerHand), dealerHand));

		let playerHand: CardData[] = [deckRef.current.draw()];
		setPlayerHand(playerHand);
		await onEvent?.(new CardDrawEvent(calculateHandScore(playerHand), playerHand));

		playerHand = [...playerHand, deckRef.current.draw()];
		const playerScore = calculateHandScore(playerHand);

		setPlayerHand(playerHand);
		await onEvent?.(new CardDrawEvent(playerScore, playerHand));

		if(playerScore < 21) {
			setStatus(GameStatus.PLAYER_TURN);
		} else {
			setStatus(GameStatus.DEALER_TURN);
		}

		setIsProcessing(false);
	}

	const hit = async () => {
		if(isProcessing) return;
		setIsProcessing(true);

		await onEvent?.(new HitEvent());

		const newHand = [...playerHand, deckRef.current.draw()];
		setPlayerHand(newHand);

		const newScore = calculateHandScore(newHand);
		await onEvent?.(new CardDrawEvent(newScore, newHand));

		if(newScore > 21) {
			setStatus(GameStatus.GAME_OVER);
			return;
		}  

		if(newScore === 21) {
			setStatus(GameStatus.DEALER_TURN);
			setIsProcessing(false);
			return;
		}

		setIsProcessing(false);
	};

	const stand = async () => {
		if(isProcessing) return;
		setIsProcessing(true);

		await onEvent?.(new StandEvent());

		setStatus(GameStatus.DEALER_TURN);
		setIsProcessing(false);
	};

	const bet = async () => {
		await dealFirstCards();
	};

	useEffect(() => {
		if(status !== GameStatus.DEALER_TURN) {
			return;
		}

		if(isProcessing) {
			return;
		}

		if(dealerScore >= 17) {
			setIsProcessing(true);
			setStatus(GameStatus.GAME_OVER);
			return;
		}

		const drawDealerCard = async () => {
			setIsProcessing(true);
			await new Promise<void>(r => setTimeout(r, 1000));

			const newHand = [...dealerHand, deckRef.current.draw()];
			const newScore = calculateHandScore(newHand);

			setDealerHand(newHand);
			await onEvent?.(new CardDrawEvent(newScore, newHand));

			setIsProcessing(false);
		}

		drawDealerCard();
	}, [status, dealerHand, isProcessing]);

	useEffect(() => {
		if(status !== GameStatus.GAME_OVER) {
			return;
		}

		const resolveGame = async () => {
			setIsProcessing(true)

			if(playerScore > 21) {
				await onEvent?.(new LoseEvent());
			} else if(dealerScore > 21) {
				await onEvent?.(new WinEvent());
			} else if(playerScore > dealerScore) {
				await onEvent?.(new WinEvent());
			} else if(playerScore < dealerScore) {
				await onEvent?.(new LoseEvent());
			} else {
				await onEvent?.(new PushEvent());
			}

			setIsProcessing(false)
		}

		resolveGame();
	}, [status]);

	return {
		status,
		playerHand,
		dealerHand,
		playerScore,
		dealerScore,
		isProcessing,
		hit,
		stand,
		bet,
		restart: startNewGame
	};
}
