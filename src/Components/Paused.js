import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Overlay from './Overlay';

class Paused extends Component {
	static propTypes = {
		rotation: PropTypes.number.isRequired,
		resumeGame: PropTypes.func.isRequired,
		restartGame: PropTypes.func.isRequired
	};

	render() {
		return (
			<Overlay noAnimation rotation={this.props.rotation}>
				<Fragment>
					<h2> Game Paused </h2>
					<div className="paused-button-wrapper">
						<div onClick={this.props.resumeGame} className="btn">
							Resume
						</div>
					</div>
					<div className="paused-button-wrapper">
						<div onClick={this.props.restartGame} className="btn">
							Restart
						</div>
					</div>
				</Fragment>
			</Overlay>
		);
	}
}

export default Paused;
