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
			showHighScore: false,
			gameType: 'original'
		};
	}
	render() {
		const style = {
			fontSize: '1.4em',
			margin: 0,
			padding: '1.175em 1.125em',
			textAlign: 'center',
			width: '220px'
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
								<i style={{ marginLeft: '0.2em' }} className="fa fa-clock" />
							</div>
						</div>
						<div className="button-wrapper" style={{ marginBottom: '3em' }}>
							<div
								style={style}
								onClick={this.props.restartGame('puzzle')}
								className="btn"
							>
								Play Puzzle
								<i
									style={{ marginLeft: '0.2em' }}
									className="fa fa-puzzle-piece"
								/>
							</div>
						</div>
						<div className="button-wrapper" style={{ marginBottom: '3em' }}>
							<div
								style={style}
								onClick={() =>
									this.setState({ showHighScore: true, gameType: 'original' })
								}
								className="btn"
							>
								High Scores
								<i style={{ marginLeft: '0.2em' }} className="fa fa-clock" />
							</div>
						</div>
						<div className="button-wrapper">
							<div
								style={style}
								onClick={() =>
									this.setState({ showHighScore: true, gameType: 'puzzle' })
								}
								className="btn"
							>
								High Scores
								<i
									style={{ marginLeft: '0.2em' }}
									className="fa fa-puzzle-piece"
								/>
							</div>
						</div>
					</Fragment>
				) : (
					<HighScores
						gameType={this.state.gameType}
						restartGame={this.props.restartGame}
						scores={getHighScores().original}
					/>
				)}
			</Overlay>
		);
	}
}

export default InitialOverlay;
