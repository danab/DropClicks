const defaultScores = {
	original: [],
	puzzle: []
};

export const getHighScores = () => {
	const scores = localStorage.getItem('scores');
	if (scores) {
		const parsedScores = JSON.parse(scores);
		// Previous versions will not have a puzzle array
		if (!parsedScores.puzzle) {
			parsedScores.puzzle = [];
		}
		return parsedScores;
	} else {
		return defaultScores;
	}
};

export const saveState = state => {
	// Don't need the animation to replay...
	state.lastScore = 0;

	if (state.levelOver) {
		// Lets grab the next level
	}
	localStorage.setItem('board-state', JSON.stringify(state));
};
