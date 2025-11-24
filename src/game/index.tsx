import Hand from "@/components/hand";
import "./game-style.css";
import useBlackjack, { Blackjack, GameStatus, BlackjackEvent, CardDrawEvent, WinEvent, LoseEvent, HitEvent, StandEvent, PushEvent, RestartEvent } from "@/hooks/blackjackHook";
import { useRef } from "preact/hooks";
import { eventSoundMap, scoreSoundMap } from "@/audio";

export default function Game() {
	const playSound = async (src: string): Promise<void> => {
		return new Promise((resolve) => {
			const audio = audioRef.current;
			if(!audio) {
				return resolve();
			}

			const onEnded = () => {
				audio.removeEventListener("ended", onEnded);
				resolve();
			}

			audio.addEventListener("ended", onEnded);

			audio.src = src;
			audio.play().catch(() => {
				audio.removeEventListener("ended", onEnded);
				resolve();
			});
		})
	}

	const handleEvent = async (event: BlackjackEvent) => {
		if(event instanceof CardDrawEvent) {
			const score = event.score;

			if(score === 21 && event.hand.length === 2) {
				await playSound(eventSoundMap["blackjack"]);
				return;
			}

			if(score > 21) {
				await playSound(eventSoundMap["bust"]);
				return;
			}

			await playSound(scoreSoundMap.get(score));
			return;
		}

		if(event instanceof WinEvent) {
			await playSound(eventSoundMap["win"]);
			return;
		}

		if(event instanceof LoseEvent) {
			await playSound(eventSoundMap["lose"]);
			return;
		}
		
		if(event instanceof HitEvent) {
			await playSound(eventSoundMap["hit"]);
			return;
		}

		if(event instanceof StandEvent) {
			await playSound(eventSoundMap["stand"]);
			return;
		}

		if(event instanceof PushEvent) {
			await playSound(eventSoundMap["push"]);
			return;
		}

		if(event instanceof RestartEvent) {
			await playSound(eventSoundMap["bet"]);
			return;
		}
	};

	const blackjack: Blackjack = useBlackjack(handleEvent);
	const message: string = getGameMessage(blackjack);
	const audioRef = useRef<HTMLAudioElement>();

	return (
		<>
			<audio src="" autoPlay={false} ref={audioRef} />

			<p id="game-message"><strong>{message}</strong></p>

			<section>
				<h3>Dealer</h3>
				<Hand hand={blackjack.dealerHand} handValue={blackjack.dealerScore} />

				<hr />

				<h3>You</h3>
				<Hand hand={blackjack.playerHand} handValue={blackjack.playerScore} />
			</section>

			<hr />

			<div id="action-btn-container" className="btn-container">
				<button id="bet-btn" onClick={blackjack.bet} disabled={blackjack.isProcessing || blackjack.status !== GameStatus.BETTING}>Bet</button>
				<button id="hit-btn" onClick={blackjack.hit} disabled={blackjack.isProcessing || blackjack.status !== GameStatus.PLAYER_TURN || blackjack.playerScore >= 21}>Hit</button>
				<button id="stand-btn" onClick={blackjack.stand} disabled={blackjack.isProcessing || blackjack.status !== GameStatus.PLAYER_TURN}>Stand</button>
				<button id="restart-btn" onClick={blackjack.restart} disabled={blackjack.isProcessing || blackjack.status !== GameStatus.GAME_OVER}>Play Again</button>
			</div>
		</>
	);
}

function getGameMessage(blackjack: Blackjack): string {
	if(blackjack.status === GameStatus.NONE) return "...";
	if(blackjack.status === GameStatus.BETTING) return "Place your bet";
	if(blackjack.status === GameStatus.PLAYER_TURN) return "Your turn";
	if(blackjack.status === GameStatus.DEALER_TURN) return "Dealer's turn";

	if(blackjack.playerScore > 21) return "Bust! You lose.";
	if(blackjack.dealerScore > 21) return "Dealer Busts! You win!";
	if(blackjack.playerScore > blackjack.dealerScore) return "You win!";
	if(blackjack.playerScore < blackjack.dealerScore) return "Dealer wins.";

	return "Push!";
}
