import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay from './Overlay';
import HighScores from './HighScores';
import { getHighScores } from '../StorageLogic';

class InitialOverlay extends Component {
	static propTypes = {
		restartGame: PropTypes.func.isRequired
	};
	constructor(props) {
		super(props);

		this.state = {
			showHighScore: false
		};
	}
	render() {
		const style = {
			fontSize: '1.4em',
			margin: 0,
			padding: '1.175em 1.125em',
			textAlign: 'center',
			width: '200px'
		};
		return (
			<Overlay noAnimation highScore={this.state.showHighScore}>
				{!this.state.showHighScore ? (
					<Fragment>
						<div className="button-wrapper" style={{ marginBottom: '3em' }}>
							<div
								style={style}
								onClick={this.props.restartGame('original')}
								className="btn"
							>
								Play Original
							</div>
						</div>
						<div className="button-wrapper" style={{ marginBottom: '3em' }}>
							<div
								style={style}
								onClick={this.props.restartGame('puzzle')}
								className="btn"
							>
								Play Puzzle
							</div>
						</div>
						<div className="button-wrapper">
							<div
								style={style}
								onClick={() => this.setState({ showHighScore: true })}
								className="btn"
							>
								High Scores
							</div>
						</div>
					</Fragment>
				) : (
					<HighScores
						gameType="original"
						restartGame={this.props.restartGame}
						scores={getHighScores().original}
					/>
				)}
			</Overlay>
		);
	}
}

export default InitialOverlay;
