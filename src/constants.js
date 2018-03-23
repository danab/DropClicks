const GAME_SIZE = window.innerWidth > 599 ? 500 : 300;

const LEVELS = [
	// Math done in my head...could...be wrong.
	{ dim: 4, colors: 2, time: 20, movesLeft: 3 }, // 8
	{ dim: 5, colors: 2, time: 20, movesLeft: 3 }, // 12.5
	{ dim: 6, colors: 2, time: 20, movesLeft: 3 }, // 18
	{ dim: 6, colors: 3, time: 30, movesLeft: 3 }, // Average 12 per color
	{ dim: 7, colors: 3, time: 30, movesLeft: 3 }, // 16.33
	{ dim: 8, colors: 3, time: 30, movesLeft: 3 }, // 21.33
	{ dim: 9, colors: 3, time: 30, movesLeft: 3 }, // 27
	{ dim: 8, colors: 4, time: 40, movesLeft: 3 }, // 16
	{ dim: 9, colors: 4, time: 40, movesLeft: 3 }, // 20.25
	{ dim: 10, colors: 4, time: 40, movesLeft: 3 }, // 25
	{ dim: 11, colors: 4, time: 30, movesLeft: 3 }, // 30.25
	{ dim: 12, colors: 4, time: 30, movesLeft: 3 } // 36
	// { dim: 13, colors: 4, time: 10, movesLeft: 3 }, // 42.25
	// { dim: 14, colors: 4, time: 30, movesLeft: 3 } // 48
];
const GAME_STYLE = {
	height: GAME_SIZE + 'px',
	width: GAME_SIZE + 'px'
};

export { GAME_SIZE, GAME_STYLE, LEVELS };
