import React, { Component, Fragment } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import axios from 'axios';

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

const HighScoreFragment = ({
	handleChange,
	handleSubmit,
	resetGame,
	initials,
	isHighScore
}) => {
	return (
		<Fragment>
			<div className="overlay-text">
				{isHighScore
					? "You've got a high score! Please enter your initials."
					: 'Submit your score to see you how you did globally!'}
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
				{!isHighScore && (
					<div onClick={resetGame} className="btn">
						Play Again
					</div>
				)}
			</div>
		</Fragment>
	);
};

HighScoreFragment.propTypes = {
	handleChange: PropTypes.func.isRequired,
	handleSubmit: PropTypes.func.isRequired,
	initials: PropTypes.string.isRequired,
	isHighScore: PropTypes.bool.isRequired,
	resetGame: PropTypes.func.isRequired
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
		bestGroup: PropTypes.number.isRequired,
		gameType: PropTypes.string.isRequired,
		level: PropTypes.number.isRequired,
		restartGame: PropTypes.func.isRequired,
		rotation: PropTypes.number.isRequired,
		score: PropTypes.number.isRequired
	};
	constructor(props) {
		super(props);
		const initials = localStorage.getItem('initials') || '';
		const highscores = getHighScores();
		const isHighScore = checkHighScore(props.score, highscores[props.gameType]);

		this.state = {
			highscores,
			isHighScore,
			initials
		};
	}

	handleChange = e => {
		this.setState({ initials: e.target.value.toUpperCase() });
	};

	createScoreObj() {
		return {
			score: this.props.score,
			initials: this.state.initials,
			level: this.props.level,
			bestGroup: this.props.bestGroup,
			date: DateTime.local().toISO()
		};
	}

	handleSubmit = async () => {
		if (this.state.initials.length > 1) {
			const newHighScores = this.updateLocalHighScores();

			const res = await axios.post(
				'https://wcs0oio6th.execute-api.us-east-1.amazonaws.com/dev/score',
				{ ...this.createScoreObj(), type: this.props.gameType }
			);

			this.setState({
				submitted: true,
				// Shouldn't be used.
				highscoresLocal: newHighScores,
				highscoresGlobal: res.data.top10,
				globalPlace: res.data.place,
				globalPlays: res.data.total
			});
		}
	};

	// This should return an identical object,
	updateLocalHighScores() {
		const { gameType } = this.props;
		const newHighScores = createNewHighScores(
			this.createScoreObj(),
			this.state.highscores[gameType]
		);

		const newHighScoreObj = {
			...this.state.highscores,
			[gameType]: newHighScores
		};

		localStorage.setItem('scores', JSON.stringify(newHighScoreObj));
		localStorage.setItem('initials', this.state.initials);

		return newHighScores;
	}

	showHighScores = () => {
		this.setState({ isHighScore: true, submitted: true });
	};

	getHighScoreProps() {
		return {
			initials: this.state.initials,
			isHighScore: this.state.isHighScore,
			handleChange: this.handleChange,
			resetGame: this.props.resetGame,
			handleSubmit: this.handleSubmit
		};
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
						highscoresLocal={this.state.highscoresLocal}
						highscoresGlobal={this.state.highscoresGlobal}
						globalPlace={this.state.globalPlace}
						globalPlays={this.state.globalPlays}
						gameType={this.props.gameType}
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
						<HighScoreFragment {...highScoreProps} />
					</Fragment>
				</Overlay>
			);
		}
	}
}

export default GameOver;
