import { CardData, CardRank } from "./card";

export class Deck {
	private cards: CardData[] = [];

	constructor(public readonly deckCount: number = 6) {
		this.reset();
		this.shuffle();
	}

	public reset(): void {
		this.cards = [];
		for(let i=0; i<6; ++i) {
			for(let rank = CardRank.ACE; rank <= CardRank.KING; ++rank) {
				for(let suit = 0; suit < 4; ++suit) {
					this.cards.push({ rank: rank, suit: suit });
				}
			}
		}
	}

	public shuffle(): void {
		for(let i: number = this.cards.length - 1; i > 0; --i) {
			const j: number = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}

	public draw(): CardData | undefined {
		if(this.isEmpty()) {
			console.error("Deck is empty");
			return undefined;
		}

		return this.cards.pop();
	}

	public count = (): number => this.cards.length;
	public isEmpty = (): boolean => this.cards.length === 0;
}
