import { get_levels } from './constants';
import { createBoard } from './BoardLogic';

export const getLevelInfo = (level, gameType) => {
	const LEVELS = get_levels(gameType);
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

	const LEVELS = get_levels(state.gameType);
	if (level === LEVELS.length) {
		const score = state.score + state.pieceBonus + state.timeBonus + state.levelBonus;
		const level = state.level + 1;
		return { gameOver: true, levelOver: false, score, level };
	}

	const levelInfo = getLevelInfo(level, state.gameType);
	return {
		...levelInfo,
		hasBeenPaused: false,
		elapsedTime: 0,
		levelOver: false,
		lastScore: state.pieceBonus + state.timeBonus + state.levelBonus,
		score: state.score + state.pieceBonus + state.timeBonus + state.levelBonus
	};
};

export const newGameState = gameType => {
	const level = 0;
	const levelInfo = getLevelInfo(level, gameType);

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

export const getTimeBonus = (level, startTime, gameType) => {
	const LEVELS = get_levels(gameType);
	const levelTime = LEVELS[level].time * 1000;
	const currentTime = new Date().getTime();
	const endTime = startTime + levelTime;
	const percentLeft = (endTime - currentTime) / levelTime;

	return Math.max(Math.floor(percentLeft * 1000) * 10, 5);
};
