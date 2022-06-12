import { PlayerType } from "../Types/playerTypes";

export abstract class AbstractPlayer {
	private readonly _id: string;
	private _name: string;

	set name(value: string) {
		this._name = value;
	}

	get name(): string {
		return this._name;
	}

	get id(): string {
		return this._id;
	}

	protected constructor(player: PlayerType) {
		this._id = player.id;
		this._name = player.name;
	}
}