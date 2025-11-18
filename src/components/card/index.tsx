import { CardData, CardRank, CardSuit } from "@/card";

import "./card-style.css";
import { default as textureAtlas } from '@/assets/PlayingCards.svg';
import { default as cardsBackTextureAtlas } from '@/assets/CardsBack.svg';

const cardSvgWidth: number = 242;
const cardSvgHeight: number = 336.5

const cardHeight: number = cardSvgHeight * 0.5;
const cardWidth: number = cardSvgWidth * 0.5;

const cardSymbols = Object.values(CardSuit)
	.filter(v => typeof v === "number")
	.flatMap(suit =>
		Object.values(CardRank)
			.filter(v => typeof v === "number")
			.map(rank => {
				const x = Number(rank) * cardSvgWidth;
				const y = Number(suit) * cardSvgHeight;
				const id = `card-${suit}-${rank}`;
				return (
					<symbol id={id} key={id} viewBox={`0 0 ${cardSvgWidth} ${cardSvgHeight}`}>
						<image
							href={textureAtlas}
							x={-x}
							y={-y}
							width={cardSvgWidth * 13}
							height={cardSvgHeight * 4}
						/>
					</symbol>
				);
			})
	);

export const CardDefs = () => <svg style={{ display: "none" }}>{cardSymbols}</svg>;

export default function Card(data: CardData) {
	return <div class="card">
		<svg width={cardWidth} height={cardHeight}>
			<use href={`#card-${data.suit}-${data.rank}`} />
		</svg>
	</div>;
}
