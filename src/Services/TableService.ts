import { CardType } from "../Types/deckTypes";

export class TableService {
	private deck: Array<CardType> = [];


	addCard(card: CardType) {
		this.deck.push(card);
	}

	getLastCard(): CardType {
		return this.deck[this.deck.length];
	}

	rebuildDeck(): void {
		const lastCard = this.deck[this.deck.length];
		this.deck = [ lastCard ];
	}
}