export enum Numbers {
	zero,
	one,
	two,
	three,
	four,
	five,
	six,
	seven,
	eight,
	nine
}

export enum RareCards {
	stop = "stop",
	changeDirection = "changeDirection",
	plusTwo = "plusTwo"
}

export enum SpecialCards {
	changeColor = "changeColor",
	plusFour = "plusFour"
}

export enum Colors {
	red = "red",
	green = "green",
	blue = "blue",
	yellow = "yellow",
	black = "black"
}

export type CardType = {
	value: Numbers | RareCards | SpecialCards;
	color: Colors;
}

