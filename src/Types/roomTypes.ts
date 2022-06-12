export enum RoomEvents {
	addPlayer = "addPlayer",
	join = "join",
	gameStart = "gameStart",
	gameEnd = "gameEnd"
}

export enum NumberOfPlayers {
	two = 2,
	three,
	four,
	five,
	six
}

export type RoomOptions = {
	numberOfPLayers: NumberOfPlayers;
}