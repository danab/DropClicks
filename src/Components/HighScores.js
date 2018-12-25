import React, { Component, Fragment } from 'react';
import { DateTime } from 'luxon';
import PropTypes from 'prop-types';
import axios from 'axios';

import { getHighScores } from '../StorageLogic';

const encouragement = [
	'You Rock!',
	'Keep it up!',
	'Wowee!',
	'Congratulations!',
	"I'm impressed!",
	'Fantastic!',
	'Absolutely stellar!',
	'Way to go!'
];

const today = DateTime.local().toLocaleString(DateTime.DATE_SHORT);
const yesterday = DateTime.local()
	.minus({ days: 1 })
	.toLocaleString(DateTime.DATE_SHORT);

const formatDate = date => {
	switch (date) {
		case today:
			return 'Today';
		case yesterday:
			return 'Yesterday';
		case '12/25/2018':
			return <XMAS />;
		default:
			return date;
	}
};

const XMAS = () => (
	<span>
		<span style={{ color: 'red' }}>XMAS</span>
		<span style={{ color: '#00c900' }}>18❤️</span>
	</span>
);
const HighScoreRow = ({ score, i, place }) => {
	const classes =
		place && i === place - 1 ? 'highscore-li new-score' : 'highscore-li';

	const date = DateTime.fromISO(score.date).toLocaleString(DateTime.DATE_SHORT);
	return (
		<li key={i} className={classes}>
			<span className="highscore-initials">
				<span className="highscore-place">{i + 1}.</span> {score.initials}
			</span>
			<span className="highscore-score">{score.score.toLocaleString()}</span>
			<span className="highscore-date">{formatDate(date)}</span>
		</li>
	);
};
HighScoreRow.propTypes = {
	score: PropTypes.shape({
		initials: PropTypes.string.isRequired,
		score: PropTypes.number.isRequired
	}).isRequired,
	i: PropTypes.number.isRequired,
	place: PropTypes.number.isRequired
};

const Subtitle = ({ place, showGlobal, globalPlace, globalPlays }) => {
	const exclamation =
		encouragement[Math.floor(Math.random() * encouragement.length)];
	if (showGlobal && globalPlace && globalPlays) {
		// Show place always
		const percentile = globalPlace / globalPlays;
		return (
			<div style={{ color: 'white' }} className="overlay-text">
				#{globalPlace} of {globalPlays} All-Time.{' '}
				{percentile < 0.5 && exclamation}
			</div>
		);
	} else if (place > 0) {
		// Show local
		return (
			<div style={{ color: 'white' }} className="overlay-text">
				#{place} All-Time. {exclamation}
			</div>
		);
	} else {
		return false;
	}
};

export default class HighScores extends Component {
	static propTypes = {
		currentScore: PropTypes.number,
		currentInitials: PropTypes.string,
		gameType: PropTypes.string.isRequired,
		globalPlace: PropTypes.number,
		globalPlays: PropTypes.number,
		restartGame: PropTypes.func.isRequired,
		scores: PropTypes.array.isRequired
	};

	constructor(props) {
		super(props);
		// This should be a prop
		const { gameType } = props;

		// get local scores
		const localScores = getHighScores();

		// Determine which to show first
		let showGlobal = true;
		if (this.props.currentScore && this.props.globalPlace > 10) {
			// Show if it's a local high score, but not global
			if (this.getPlace(localScores[gameType])) {
				showGlobal = false;
			}
		}
		this.state = {
			gameType,
			loading: true,
			localScores,
			showGlobal
		};
	}

	componentDidMount = async () => {
		const res = await axios.get(
			'https://wcs0oio6th.execute-api.us-east-1.amazonaws.com/dev/score'
		);

		this.setState({ loading: false, globalScores: res.data.scores });
	};

	getPlace(scores) {
		const placeIndex = scores.findIndex(score => {
			return (
				score.score === this.props.currentScore &&
				score.initials === this.props.currentInitials
			);
		});

		if (placeIndex !== -1) {
			return placeIndex + 1;
		} else {
			// No such thing as zero place, right?
			return 0;
		}
	}

	getCurrentScores() {
		const { gameType, showGlobal, globalScores, localScores } = this.state;
		return showGlobal ? globalScores[gameType] : localScores[gameType];
	}

	toggle = () => {
		this.setState({ showGlobal: !this.state.showGlobal });
	};

	render() {
		if (this.state.loading) {
			return 'Retrieving Scores...';
		}
		const { showGlobal } = this.state;
		const { globalPlace, globalPlays } = this.props;
		const currentScores = this.getCurrentScores();
		const place = this.getPlace(currentScores);
		return (
			<Fragment>
				<h2>
					<span onClick={this.toggle} className="highscore-toggle">
						<span className="highscore-toggle-arrow">⇣</span>
						{showGlobal ? 'Global' : 'Your'}
					</span>{' '}
					High Scores
				</h2>

				<Subtitle {...{ showGlobal, place, globalPlace, globalPlays }} />

				<div className="highscore-wrapper">
					<ol className="highscore-table">
						{currentScores.map((score, i) => (
							<HighScoreRow key={i} score={score} i={i} place={place} />
						))}
					</ol>
					{!currentScores.length && (
						<div>
							<p>No scores found.</p>
							<p>Try playing a game!</p>
						</div>
					)}
				</div>

				<div className="btn-wrapper">
					<div onClick={this.props.restartGame('original')} className="btn">
						Play Original
					</div>
					<div onClick={this.props.restartGame('puzzle')} className="btn">
						Play Puzzle
					</div>
				</div>
			</Fragment>
		);
	}
}
