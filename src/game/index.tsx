import { useEffect, useRef, useState } from "preact/hooks";
import { CardData, CardRank, CardSuit } from "@/card";
import Hand from "@/components/hand";
import { Deck } from "@/deck";

import "./game-style.css"

enum Turn {
	DEALER,
	PLAYER,
	END
}

export default function Game() {
	const deckRef = useRef<Deck>(new Deck());

	const [message, setMessage] = useState<string>("");
	const [turn, setTurn] = useState<Turn>(Turn.DEALER);

	const [dealerHand, setDealerHand] = useState<CardData[]>([]);
	const [playerHand, setPlayerHand] = useState<CardData[]>([]);

	useEffect(() => {
		setDealerHand([deckRef.current.draw()]);
		setPlayerHand([deckRef.current.draw(), deckRef.current.draw()]);
	}, []);

	return <>
		<p>Dealer</p>
		<Hand hand={dealerHand} />

		<div style={{marginTop: 100}}></div>

		<p>You</p>
		<Hand hand={playerHand} />

		<button id="hit-btn">Hit</button>
		<button id="stand-btn">Stand</button>
	</>;
}
