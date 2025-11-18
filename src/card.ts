export enum CardRank {
	ACE = 0,
	TWO,
	THREE,
	FOUR,
	FIVE,
	SIX,
	SEVEN,
	EIGHT,
	NINE,
	TEN,
	JACK,
	QUEEN,
	KING,
};

export enum CardSuit {
	CLUBS = 0,
	HEARTS,
	SPADES,
	DIAMONDS,
};

export interface CardData {
	rank: CardRank;
	suit: CardSuit;
}

export const rankValues: Map<CardRank, number> = new Map([
	[CardRank.ACE, 11],
	[CardRank.TWO, 2],
	[CardRank.THREE, 3],
	[CardRank.FOUR, 4],
	[CardRank.FIVE, 5],
	[CardRank.SIX, 6],
	[CardRank.SEVEN, 7],
	[CardRank.EIGHT, 8],
	[CardRank.NINE, 9],
	[CardRank.TEN, 10],
	[CardRank.JACK, 10],
	[CardRank.QUEEN, 10],
	[CardRank.KING, 10],
])

export function calculateHandValue(hand: CardData[]): number {
	let total: number = 0;
	let aces: number = 0;

	for(const card of hand) {
		if(card.rank === CardRank.ACE) {
			++aces;
		}

		total += rankValues.get(card.rank);
	}

	while(aces > 0 && total > 21) {
		total -= 10;
		--aces;
	}

	return total;
}
