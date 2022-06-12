import { CardType, RareCards, SpecialCards } from "../Types/deckTypes";
import { PlayerType } from "../Types/playerTypes";
import { DeckService } from "./DeckService";
import { PlayerService } from "./PlayerService";
import { TableService } from "./TableService";

export class GameService {
	private deck: DeckService = new DeckService();
	private table: TableService = new TableService();
	private players: Array<PlayerService> = [];
	private indexOfActivePlayer: number = 0;
	private activeColor: string = "";
	private isClockwise: boolean = true;
	private readonly _numberOfPlayers: number;

	constructor(numberOfPlayers: number) {
		this._numberOfPlayers = numberOfPlayers;
	}

	get numberOfPlayers(): number {
		return this._numberOfPlayers;
	}

	addPlayer(player: PlayerType): [ PlayerService, boolean ] | false {
		if (this.players.length !== this.numberOfPlayers
			&& player.options.numberOfPLayers === this.numberOfPlayers) {
			const service = new PlayerService(player, this.deck, this.table);
			this.players.push(service);
			const isRoomFull: boolean = this.players.length === this.numberOfPlayers;

			return [ service, isRoomFull ];
		} else {
			return false;
		}
	}

	startGame() {
		this.deck.initDeck();
		this.initPlayersHand();
	}

	move(player: PlayerService, card: CardType): CardType | false {
		const lastCardOnTable = player.move(card);

		if (lastCardOnTable) {
			this.activeColor = card.color;

			const nextPlayerIndex = this.indexOfActivePlayer + 1;

			switch (card.value) {
				case RareCards.plusTwo:
					for (let i = 0; i < 4; i++) {
						this.players[nextPlayerIndex].takeCard();
					}
					this.indexOfActivePlayer += 1;
					break;
				case SpecialCards.plusFour:
					for (let i = 0; i < 4; i++) {
						this.players[nextPlayerIndex].takeCard();
					}
					this.indexOfActivePlayer += 1;
					break;
				case RareCards.stop:
					this.indexOfActivePlayer += 1;
					break;
				case RareCards.changeDirection:
					this.indexOfActivePlayer = this.indexOfActivePlayer + this.players.length;
					this.isClockwise = !this.isClockwise;
					break;
				default:
					break;
			}

			return lastCardOnTable;
		}

		return false;
	}

	private initPlayersHand(): void {
		this.players.forEach(player => {
			for (let i = 0; i < 7; i++) {
				player.takeCard();
			}
		});
	}
}