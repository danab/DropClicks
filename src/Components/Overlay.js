import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Overlay extends Component {
	static propTypes = {
		noAnimation: PropTypes.bool,
		highScore: PropTypes.bool,
		children: PropTypes.node.isRequired
	};

	render() {
		const animation = this.props.noAnimation ? { animation: 'none' } : {};
		const className = this.props.highScore
			? 'overlay overlay-high-score'
			: 'overlay';
		return (
			<div className={className} style={animation}>
				{this.props.children}
			</div>
		);
	}
}

export default Overlay;
