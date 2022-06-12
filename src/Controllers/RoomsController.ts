import { Server, Socket } from "socket.io";
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

	listenRoomsEvents(socket: Socket) {
		this.listenCreateRoom(socket);
		this.listenJoinRoom(socket);
	}

	private listenCreateRoom(socket: Socket): void {
		socket.on(RoomEvents.createRoom, (player: PlayerType) => {
			let isPlayerAlreadyInRoom;

			this._rooms.forEach(room => {
				isPlayerAlreadyInRoom = room.players.find(controller => controller.id === player.id);
			});


			if (!isPlayerAlreadyInRoom) {
				const room = new RoomController(this.io, player.options.numberOfPLayers);
				room.addPlayer(player, socket);
				this._rooms.push(room);
				room.listenRoomEvents();
				console.log(`Player ${player.name} created new room`);
				console.log(this._rooms);
			}
		});
	}

	private listenJoinRoom(socket: Socket) {
		socket.on(RoomEvents.join, (player: PlayerType, queriedRoomId: string) => {
			const requiredRoom = this._rooms.find(roomInfo => {
				const roomId = roomInfo.id;
				return roomId === queriedRoomId;
			});

			if (requiredRoom) {
				requiredRoom.addPlayer(player, socket);
				console.log(`Player: ${player.name} join room`);
			}
		});
	}
}