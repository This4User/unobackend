import { Server, Socket } from "socket.io";
import { GameService } from "../Services/GameService";
import { PlayerType } from "../Types/playerTypes";
import { RoomEvents } from "../Types/roomTypes";
import { PlayerController } from "./PlayerController";

export class RoomController {
	private _id: string = "123";
	private readonly io: Server;
	private readonly game: GameService;
	private _players: Array<PlayerController> = [];

	constructor(io: Server, numberOfPlayers: number) {
		this.io = io;
		this.game = new GameService(numberOfPlayers);
	}

	get id(): string {
		return this._id;
	}

	get players(): Array<PlayerController> {
		return this._players;
	}

	startGame(): void {
		this.game.startGame();
		this._players.forEach(player => {
			player.onStart();
		});
		this.io.to(this._id).emit(RoomEvents.gameStart);
	}

	listenRoomEvents(): void {
		this.listenPlayersActions();
	}

	addPlayer(player: PlayerType, socket: Socket): void {
		const addingResult = this.game.addPlayer(player);

		if (addingResult) {
			const [ playerService, isRoomFull ] = addingResult;
			const playerController = new PlayerController(playerService, socket, this.io, this.game, this._id);
			this._players.push(playerController);
			socket.join(this._id);

			this.io.to(socket.id).emit(RoomEvents.join);

			if (isRoomFull) {
				this.startGame();
			}
		} else {
			this.io.to(player.id).emit(RoomEvents.createRoom, false);
		}
	}

	private listenPlayersActions(): void {
		this._players.forEach(player => player.listenActions());
	}
}