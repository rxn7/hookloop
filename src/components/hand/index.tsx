import { CardData, CardRank, CardSuit, calculateHandValue } from "@/card";
import Card from "../card";

export interface HandProps {
	hand: CardData[];
}

export default function Hand(props: HandProps) {
	return <>
		<div className="hand">
			{
				props.hand.map((card) => <Card {...card} />)
			}
		</div>
		<p>Score: {calculateHandValue(props.hand)}</p>
	</>
}
