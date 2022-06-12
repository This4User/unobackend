import { AbstractPlayer } from "../Classes/AbstractPlayer";
import { CardType } from "../Types/deckTypes";
import { PlayerType } from "../Types/playerTypes";
import { DeckService } from "./DeckService";
import { TableService } from "./TableService";


export class PlayerService extends AbstractPlayer {
	private _cardHand: Array<CardType> = [];
	private _isActive: boolean = false;
	private deck: DeckService;
	private table: TableService;

	constructor(player: PlayerType, deck: DeckService, table: TableService) {
		super(player);
		this.deck = deck;
		this.table = table;
	}

	get isActive(): boolean {
		return this._isActive;
	}

	set isActive(value: boolean) {
		this._isActive = value;
	}

	get cardHand(): Array<CardType> {
		return this._cardHand;
	}

	takeCard(): void {
		const card = this.deck.getCard();
		this._cardHand.push(card);
	}

	move(card: CardType): CardType | false {
		const lastCardOnTable = this.table.getLastCard();
		const isCardSuitable: boolean = card.color === lastCardOnTable.color || card.value === lastCardOnTable.value;

		if (this.isActive && isCardSuitable) {
			this.deleteCard(card);
			this.table.addCard(card);

			return this.table.getLastCard();
		}

		return false;
	}

	private deleteCard(cardInfo: CardType) {
		const cardIndex: number = this._cardHand.findIndex(card => cardInfo.value === card.value && cardInfo.color === card.color);

		this._cardHand = this._cardHand.filter((card, index) => index !== cardIndex);
	}
}