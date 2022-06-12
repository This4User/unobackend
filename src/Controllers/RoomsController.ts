import { Server } from "socket.io";
import { PlayerType } from "../Types/playerTypes";
import { RoomEvents } from "../Types/roomTypes";
import { RoomController } from "./RoomController";

export class RoomsController {
	private readonly io: Server;
	private _rooms: Array<RoomController> = [];

	constructor(io: Server) {
		this.io = io;
	}

	get rooms(): Array<RoomController> {
		return this._rooms;
	}

	listenRoomsEvents() {
		this.listenCreateRoom();
		this.listenJoinRoom();
	}

	private listenCreateRoom(): void {
		this.io.on(RoomEvents.addPlayer, (socket, player: PlayerType) => {
			let isPlayerAlreadyInRoom;

			this._rooms.forEach(room => {
				isPlayerAlreadyInRoom = room.players.find(controller => controller.id === player.id);
			});


			if (!isPlayerAlreadyInRoom) {
				const room = new RoomController(this.io, player.options.numberOfPLayers);
				room.addPlayer(player, socket);
				room.listenRoomEvents();
				this._rooms.push(room);
			}
		});
	}

	private listenJoinRoom() {
		this.io.on(RoomEvents.join, (socket, player: PlayerType, roomId: string) => {
			const requiredRoom = this._rooms.find(roomInfo => roomInfo.id === roomId);

			if (requiredRoom) {
				requiredRoom.addPlayer(player, socket);
			}
		});
	}
}