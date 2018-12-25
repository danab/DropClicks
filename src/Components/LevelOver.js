import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Overlay from './Overlay';

import { get_levels } from '../constants';

class LevelOver extends Component {
	static propTypes = {
		goToNextLevel: PropTypes.func.isRequired,
		level: PropTypes.number.isRequired,
		gameType: PropTypes.string.isRequired,
		pieceBonus: PropTypes.number.isRequired,
		levelBonus: PropTypes.number.isRequired,
		rotation: PropTypes.number.isRequired,
		timeBonus: PropTypes.number.isRequired
	};
	render() {
		const {
			gameType,
			levelBonus,
			pieceBonus,
			timeBonus,
			level,
			rotation,
			goToNextLevel
		} = this.props;
		const LEVELS = get_levels(gameType);
		const completed = level === LEVELS.length;
		const totalBonus = timeBonus + pieceBonus + levelBonus;
		return (
			<Overlay rotation={rotation}>
				<h2>{completed ? 'Game Completed!' : `Level ${level} Completed`}</h2>
				<div className="bonus-wrapper">
					{gameType === 'original' ? (
						<h3 className="time-bonus">
							Time Bonus: <span>{timeBonus.toLocaleString()}</span>
						</h3>
					) : (
						<h3 className="time-bonus">
							Level Bonus: <span>{levelBonus.toLocaleString()}</span>
						</h3>
					)}

					<h3 className="piece-bonus">
						Piece Bonus: <span>{pieceBonus.toLocaleString()}</span>
					</h3>
					<h3 className="total-score">
						Total Bonus: <span>{totalBonus.toLocaleString()}</span>
					</h3>
				</div>
				<div className="next-level" style={{ textAlign: 'center' }}>
					<div onClick={goToNextLevel} className="btn">
						{completed ? 'Finish' : 'Next Level'}
					</div>
				</div>
			</Overlay>
		);
	}
}

export default LevelOver;
