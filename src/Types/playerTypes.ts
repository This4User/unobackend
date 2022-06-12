import { RoomOptions } from "./roomTypes";

export enum PlayerActions {
	move = "move",
	takeCard = "takeCard",
	getCardHand = "getCardHand"
}

export type PlayerType = {
	id: string;
	name: string;
	options: RoomOptions;
}