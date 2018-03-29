import React, { Component, Fragment } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

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

export default class HighScores extends Component {
	static propTypes = {
		currentScore: PropTypes.number,
		currentInitials: PropTypes.string,
		restartGame: PropTypes.func.isRequired,
		scores: PropTypes.array.isRequired
	};
	getPlace() {
		const placeIndex = this.props.scores.findIndex(score => {
			return (
				score.score === this.props.currentScore &&
				score.initials === this.props.currentInitials
			);
		});

		if (placeIndex !== -1) {
			return placeIndex + 1;
		} else {
			return false;
		}
	}
	render() {
		const place = this.getPlace();
		const today = moment().format('MM-DD-YY');
		const yesterday = moment()
			.subtract(1, 'day')
			.format('MM-DD-YY');
		const exclamation =
			encouragement[Math.floor(Math.random() * encouragement.length)];
		return (
			<Fragment>
				<h2>High Scores </h2>

				{place && (
					<div style={{ color: 'white' }} className="overlay-text">
						#{place} All-Time. {exclamation}
					</div>
				)}

				<div className="highscore-wrapper">
					<ol className="highscore-table">
						{this.props.scores.map((score, i) => {
							const classes =
								place && i === place - 1 ? 'clearfix new-score' : 'clearfix';

							const date = moment(score.date).format('MM-DD-YY');
							return (
								<li key={i} className={classes}>
									<span className="highscore-initials">{score.initials}</span>
									<span className="highscore-score">
										{score.score.toLocaleString()}
									</span>
									<span className="highscore-date">
										{date === today
											? 'Today'
											: date === yesterday ? 'Yesterday' : date}
									</span>
								</li>
							);
						})}
					</ol>
					{!this.props.scores.length && (
						<div>
							<p>No scores found.</p>
							<p>Try playing a game!</p>
						</div>
					)}
				</div>

				<div className="btn-wrapper">
					<div onClick={this.props.restartGame} className="btn">
						Play Again
					</div>
				</div>
			</Fragment>
		);
	}
}
