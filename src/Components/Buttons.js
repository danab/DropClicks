import React from 'react';
import PropTypes from 'prop-types';

const Buttons = ({ active, handleRotate, handleRandom, movesLeft }) => (
	<div style={{ opacity: active ? 1 : 0.3 }} className="moves">
		<div className="icon-holder" onClick={handleRotate(-1)}>
			<i className="fa fa-redo-alt fa-flip-horizontal" />
		</div>
		<div className="icon-holder" onClick={handleRandom}>
			<i className="fa fa-random" />
		</div>
		<div className="icon-holder" onClick={handleRotate(1)}>
			<i className="fa fa-redo-alt" />
		</div>
		<div className="icon-holder moves-holder">
			<div className="moves-holder-wrapper">
				<div className="moves-header">MOVES</div>
				<div className="moves-remaining">{movesLeft}</div>
			</div>
		</div>
	</div>
);

Buttons.propTypes = {
	active: PropTypes.bool.isRequired,
	handleRotate: PropTypes.func.isRequired,
	handleRandom: PropTypes.func.isRequired,
	movesLeft: PropTypes.number.isRequired
};

export default Buttons;
