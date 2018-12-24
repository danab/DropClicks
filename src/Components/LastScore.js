import React, { Component } from 'react';
import PropTypes from 'prop-types';

class LastScore extends Component {
	static propTypes = {
		score: PropTypes.number
	};
	render() {
		const score =
			this.props.score > 0
				? '+' + this.props.score.toLocaleString()
				: this.props.score === 0
				? ''
				: this.props.score;
		return (
			<div
				style={{
					color: this.props.score < 0 ? 'red' : 'white'
				}}
				className="last-score"
			>
				{score}
			</div>
		);
	}
}

export default LastScore;
