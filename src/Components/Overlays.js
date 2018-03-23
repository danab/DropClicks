import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Initial from './InitialOverlay';
import Paused from './Paused';
import LevelOver from './LevelOver';
import GameOver from './GameOver';

class Overlays extends Component {
	static propTypes = {
		gameOver: PropTypes.bool.isRequired,
		goToNextLevel: PropTypes.func.isRequired,
		initialized: PropTypes.bool.isRequired,
		level: PropTypes.number.isRequired,
		levelOver: PropTypes.bool.isRequired,
		paused: PropTypes.bool.isRequired,
		pieceBonus: PropTypes.number,
		restartGame: PropTypes.func.isRequired,
		resumeGame: PropTypes.func.isRequired,
		rotation: PropTypes.number.isRequired,
		timeBonus: PropTypes.number
	};

	render() {
		if (!this.props.initialized) {
			return <Initial restartGame={this.props.restartGame} />;
		} else if (this.props.paused) {
			return (
				<Paused
					rotation={this.props.rotation}
					restartGame={this.props.restartGame}
					resumeGame={this.props.resumeGame}
				/>
			);
		} else if (this.props.levelOver) {
			return (
				<LevelOver
					rotation={this.props.rotation}
					level={this.props.level + 1}
					goToNextLevel={this.props.goToNextLevel}
					timeBonus={this.props.timeBonus}
					pieceBonus={this.props.pieceBonus}
				/>
			);
		} else if (this.props.gameOver) {
			return <GameOver {...this.props} />;
		}
	}
}

export default Overlays;
