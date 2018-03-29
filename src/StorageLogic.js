const defaultScores = {
	original: []
};

export const getHighScores = () => {
	const scores = localStorage.getItem('scores');
	return !scores ? defaultScores : JSON.parse(scores);
};

export const saveState = state => {
	// Don't need the animation to replay...
	state.lastScore = 0;

	if (state.levelOver) {
		// Lets grab the next level
	}
	localStorage.setItem('board-state', JSON.stringify(state));
};
