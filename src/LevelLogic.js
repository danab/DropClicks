import { LEVELS } from './constants';
import { createBoard } from './BoardLogic';

export const getLevelInfo = level => {
	const { dim, colors, time, movesLeft } = LEVELS[level];
	return {
		level,
		dim,
		colors,
		movesLeft,
		time,
		rotation: 0,
		board: createBoard(dim, colors),
		startTime: new Date().getTime()
	};
};

export const getNextLevelState = state => {
	const level = state.level + 1;

	if (level === LEVELS.length) {
		const score = state.score + state.pieceBonus + state.timeBonus;
		const level = state.level + 1;
		return { gameOver: true, levelOver: false, score, level };
	}

	const levelInfo = getLevelInfo(level);
	return {
		...levelInfo,
		hasBeenPaused: false,
		elapsedTime: 0,
		levelOver: false,
		lastScore: state.pieceBonus + state.timeBonus,
		score: state.score + state.pieceBonus + state.timeBonus
	};
};

export const newGameState = () => {
	const level = 0;
	const levelInfo = getLevelInfo(level);

	return {
		...levelInfo,
		clicks: 0,
		bestGroup: 0,
		score: 0,
		level: 0,
		levelOver: false,
		gameOver: false,
		rotating: false,
		hasBeenPaused: false,
		lastScore: 0
	};
};

export const getTimeBonus = (level, startTime) => {
	const levelTime = LEVELS[level].time * 1000;
	const currentTime = new Date().getTime();
	const endTime = startTime + levelTime;
	const percentLeft = (endTime - currentTime) / levelTime;

	return Math.max(Math.floor(percentLeft * 1000) * 10, 5);
};
