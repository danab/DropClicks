import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Overlay from './Overlay';

import { LEVELS } from '../constants';

class LevelOver extends Component {
	static propTypes = {
		goToNextLevel: PropTypes.func.isRequired,
		level: PropTypes.number.isRequired,
		pieceBonus: PropTypes.number.isRequired,
		rotation: PropTypes.number.isRequired,
		timeBonus: PropTypes.number.isRequired
	};
	render() {
		const completed = this.props.level === LEVELS.length;
		const totalBonus = this.props.timeBonus + this.props.pieceBonus;
		return (
			<Overlay rotation={this.props.rotation}>
				<h2>
					{completed
						? 'Game Completed!'
						: `Level ${this.props.level} Completed`}
				</h2>
				<div className="bonus-wrapper">
					<h3 className="time-bonus">
						Time Bonus: <span>{this.props.timeBonus.toLocaleString()}</span>
					</h3>
					<h3 className="piece-bonus">
						Piece Bonus: <span>{this.props.pieceBonus.toLocaleString()}</span>
					</h3>
					<h3 className="total-score">
						Total Bonus: <span>{totalBonus.toLocaleString()}</span>
					</h3>
				</div>
				<div className="next-level" style={{ textAlign: 'center' }}>
					<div onClick={this.props.goToNextLevel} className="btn">
						{completed ? 'Finish' : 'Next Level'}
					</div>
				</div>
			</Overlay>
		);
	}
}

export default LevelOver;
