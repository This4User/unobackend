import { CardType, Colors, Numbers, RareCards, SpecialCards } from "../Types/deckTypes";


export class DeckService {
	private _deck: Array<CardType> = [];

	get deck(): Array<CardType> {
		return this._deck;
	}

	initDeck(lastCard?: CardType): void {

		for (let i = 0; i < 10; i++) {
			this.addCardToDeck(i);
		}

		for (let i = 0; i < 3; i++) {
			const value = Object.values(RareCards)[i];
			this.addCardToDeck(value);
		}

		for (let i = 0; i < 2; i++) {
			const value = Object.values(SpecialCards)[i];
			this.addCardToDeck(value);
		}

		this.shuffle();

		if (lastCard) {
			this.deleteCard(lastCard);
		}
	}

	private addCardToDeck(cardValue: Numbers | RareCards | SpecialCards): void {
		let activeColorNumber: number = 0;
		if (typeof cardValue !== typeof SpecialCards) {
			for (let j = 0; j < 4; j++) {
				for (let k = 0; k < 2; k++) {
					const newCard: CardType = {
						value: cardValue,
						color: Object.values(Colors)[activeColorNumber],
					};
					this._deck.push(newCard);
				}
				if (activeColorNumber < 4) {
					activeColorNumber++;
				}

				if (j === 3) {
					activeColorNumber = 0;
				}
			}
		} else {
			for (let j = 0; j < 2; j++) {
				const newCard: CardType = {
					value: cardValue,
					color: Colors.black,
				};
				this._deck.push(newCard);
			}
		}
	}

	private shuffle(): void {
		let currentIndex: number = this._deck.length;
		let randomIndex: number;

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			[ this._deck[currentIndex], this._deck[randomIndex] ] = [
				this._deck[randomIndex], this._deck[currentIndex] ];
		}
	}

	private deleteCard(cardInfo: CardType) {
		const cardIndex: number = this._deck.findIndex(card => cardInfo.value === card.value && cardInfo.color === card.color);

		this._deck = this._deck.filter((card, index) => index !== cardIndex);
	}

	getCard(): CardType {
		const lastCardIndex = this._deck.length;
		const card = this._deck[lastCardIndex];

		this._deck.pop();

		return card;
	}
}