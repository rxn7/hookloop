import { CardData, CardRank, CardSuit, calculateHandValue } from "@/card";
import Card from "../card";

export interface HandProps {
	hand: CardData[];
	handValue?: number
}

export default function Hand(props: HandProps) {
	return <>
		<p>Score: {props.handValue ?? calculateHandValue(props.hand)}</p>
		<div className="hand">
			{
				props.hand.map((card) => <Card {...card} />)
			}
		</div>
	</>
}
