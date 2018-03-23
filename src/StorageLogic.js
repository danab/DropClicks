const defaultScores = {
	original: []
};

export const getHighScores = () => {
	const scores = localStorage.getItem('scores');
	return !scores ? defaultScores : JSON.parse(scores);
};
