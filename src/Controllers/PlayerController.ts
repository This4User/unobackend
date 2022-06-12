import { Server, Socket } from "socket.io";
import { GameService } from "../Services/GameService";
import { PlayerService } from "../Services/PlayerService";
import { CardType } from "../Types/deckTypes";
import { PlayerActions } from "../Types/playerTypes";
import { TableEvents } from "../Types/tableTypes";

export class PlayerController {
	private readonly service: PlayerService;
	private socket: Socket;
	private io: Server;
	private game: GameService;
	private roomId: string;

	constructor(player: PlayerService, socket: Socket, io: Server, game: GameService, roomId: string) {
		this.service = player;
		this.socket = socket;
		this.io = io;
		this.game = game;
		this.roomId = roomId;
	}

	get id() {
		return this.service.id;
	}

	listenActions(): void {
		this.listenAddCardToHand();
		this.listenMoves();
	}

	private listenAddCardToHand(): void {
		this.socket.on(PlayerActions.takeCard, () => {
			const playerId: string = this.socket.id;
			this.service.takeCard();
			const cardHand = this.service.cardHand;
			this.io.to(playerId).emit(PlayerActions.takeCard, cardHand);
		});
	}

	private listenMoves(): void {
		this.socket.on(PlayerActions.move, (card: CardType) => {
			const playerId: string = this.socket.id;
			const moveResult = this.game.move(this.service, card);
			const cardHand = this.service.cardHand;

			if (moveResult) {
				this.io.to(this.roomId).emit(TableEvents.addCardToTable, moveResult);
				this.io.to(playerId).emit(PlayerActions.move, cardHand);
			} else {
				this.io.to(playerId).emit(PlayerActions.move, false);
			}

		});
	}
}