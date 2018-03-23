import React, { Component, Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import Overlay from './Overlay';
import HighScores from './HighScores';

import { getHighScores } from '../StorageLogic';

const HIGH_SCORES_KEPT = 10;

const checkHighScore = (score, highscores) => {
	if (highscores.length < HIGH_SCORES_KEPT) {
		return true;
	}

	// should be unnecessary
	highscores.sort((scoreA, scoreB) => scoreB.score - scoreA.score);

	return highscores[HIGH_SCORES_KEPT - 1].score < score;
};

const createNewHighScores = (scoreObj, highScores) => {
	highScores.push(scoreObj);
	highScores.sort((scoreA, scoreB) => scoreB.score - scoreA.score);

	return highScores.slice(0, HIGH_SCORES_KEPT);
};

const HighScoreFragment = ({ handleChange, handleSubmit, initials }) => {
	return (
		<Fragment>
			<div className="overlay-text">
				You{"'"}ve got a high score! Please enter your initials.
			</div>
			<div className="highscore-input">
				<input
					onChange={handleChange}
					value={initials}
					type="text"
					maxLength="3"
					size="3"
					placeholder="---"
				/>
			</div>
			<div style={{ textAlign: 'center' }}>
				<div onClick={handleSubmit} className="btn">
					Submit
				</div>
			</div>
		</Fragment>
	);
};

HighScoreFragment.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	initials: PropTypes.string.isRequired
};

const NoHighScoreFragment = ({ restartGame, showHighScores }) => {
	return (
		<Fragment>
			<div className="overlay-text">Sorry, no high score this time.</div>
			<div style={{ textAlign: 'center' }}>
				<div onClick={restartGame} className="btn">
					Play Again
				</div>
				<div className="btn" onClick={showHighScores}>
					High Scores
				</div>
			</div>
		</Fragment>
	);
};

NoHighScoreFragment.propTypes = {
	restartGame: PropTypes.func.isRequired,
	showHighScores: PropTypes.func.isRequired
};

class GameOver extends Component {
	static propTypes = {
		score: PropTypes.number.isRequired,
		level: PropTypes.number.isRequired,
		bestGroup: PropTypes.number.isRequired,
		restartGame: PropTypes.func.isRequired,
		rotation: PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		const initials = localStorage.getItem('initials') || '';
		const highscores = getHighScores();

		const isHighScore = checkHighScore(props.score, highscores.original);
		this.state = {
			highscores,
			isHighScore,
			initials
		};
	}

	componentDidMount() {}

	handleChange = e => {
		this.setState({ initials: e.target.value.toUpperCase() });
	};

	createScoreObj() {
		return {
			score: this.props.score,
			initials: this.state.initials,
			level: this.props.level,
			bestGroup: this.props.bestGroup,
			date: moment().toISOString()
		};
	}

	handleSubmit = () => {
		if (this.state.initials.length > 1) {
			const newHighScores = createNewHighScores(
				this.createScoreObj(),
				this.state.highscores.original
			);

			const newHighScoreObj = {
				...this.state.highscores,
				original: newHighScores
			};
			this.setState({
				submitted: true,
				highscores: newHighScoreObj
			});

			localStorage.setItem('scores', JSON.stringify(newHighScoreObj));
			localStorage.setItem('initials', this.state.initials);
		}
	};

	showHighScores = () => {
		this.setState({ isHighScore: true, submitted: true });
	};

	getHighScoreProps() {
		if (this.state.isHighScore) {
			return {
				initials: this.state.initials,
				handleChange: this.handleChange,
				handleSubmit: this.handleSubmit
			};
		} else {
			return {
				restartGame: this.props.restartGame,
				showHighScores: this.showHighScores
			};
		}
	}
	render() {
		if (this.state.submitted) {
			return (
				<Overlay
					highScore={this.state.submitted}
					rotation={this.props.rotation}
				>
					<HighScores
						currentScore={this.props.score}
						currentInitials={this.state.initials}
						restartGame={this.props.restartGame}
						scores={this.state.highscores.original}
					/>
				</Overlay>
			);
		} else {
			const highScoreProps = this.getHighScoreProps();
			return (
				<Overlay
					highScore={this.state.submitted}
					rotation={this.props.rotation}
				>
					<Fragment>
						<h2>Game Over</h2>
						<h3 className="final-score">
							Score: {this.props.score.toLocaleString()}
						</h3>
						{this.state.isHighScore ? (
							<HighScoreFragment {...highScoreProps} />
						) : (
							<NoHighScoreFragment {...highScoreProps} />
						)}
					</Fragment>
				</Overlay>
			);
		}
	}
}

export default GameOver;
