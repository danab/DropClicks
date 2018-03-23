import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { GAME_SIZE } from '../constants';

class Timer extends PureComponent {
	static propTypes = {
		active: PropTypes.bool.isRequired,
		elapsedTime: PropTypes.number,
		hasBeenPaused: PropTypes.bool.isRequired,
		startTime: PropTypes.number.isRequired,
		time: PropTypes.number.isRequired,
		setGameOver: PropTypes.func.isRequired
	};

	constructor(props) {
		super(props);
		this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
	}

	handleAnimationEnd() {
		this.props.setGameOver();
	}

	componentWillReceiveProps(newProps) {
		// Stopping
		if (this.props.active && !newProps.active) {
			this.setState({ active: false });
		}

		// New Level
		if (!this.props.active && newProps.active) {
			this.setState({ reset: true }, () => {
				setTimeout(() => this.setState({ reset: false, active: true }), 1);
			});
		}
	}

	getPercentLeft() {
		const currentTime = new Date().getTime();
		const endTime = this.props.startTime + this.props.time * 1000;

		if (currentTime > endTime) {
			return 0;
		}

		return (endTime - currentTime) / (this.props.time * 1000);
	}

	render() {
		const { active, hasBeenPaused, elapsedTime, time } = this.props;
		const width = active
			? GAME_SIZE + 'px'
			: GAME_SIZE * this.getPercentLeft() + 'px';

		const delay = hasBeenPaused ? `-${elapsedTime / 1000}s` : '0s';
		const classNames = active
			? 'timer timer-animation'
			: 'timer timer-inactive';

		return (
			<div className="timer-wrapper" style={{ width: width }}>
				<div
					onAnimationEnd={this.handleAnimationEnd}
					className={classNames}
					style={{
						animationDuration: time + 's',
						animationDelay: delay
					}}
				/>
			</div>
		);
	}
}

export default Timer;
