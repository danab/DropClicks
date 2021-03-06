import React, { Component } from 'react';

// import { CSSTransitionGroup } from 'react-transition-group';
import './App.css';
import { GAME_SIZE, get_levels } from './constants';

import * as BoardLogic from './BoardLogic';
import * as LevelLogic from './LevelLogic';
import { saveState } from './StorageLogic';

import Square from './Components/Square';
import Timer from './Components/Timer';
import Buttons from './Components/Buttons';
import LastScore from './Components/LastScore';
import Overlays from './Components/Overlays';

const getElapsedTime = ({ level, startTime, gameType }) => {
	const LEVELS = get_levels(gameType);
	const currentTime = new Date().getTime();

	const levelTime = LEVELS[level].time * 1000;
	const elapsedTime = currentTime - startTime;

	return Math.min(elapsedTime, levelTime * 1000);
};

class App extends Component {
	constructor(props) {
		super(props);

		const boardState = JSON.parse(localStorage.getItem('board-state'));

		if (boardState) {
			this.state = boardState;
		} else {
			this.state = {
				// Show initial play screen
				initialized: false,
				gameType: 'original',
				...LevelLogic.newGameState('original'),
				// So timer isn't active
				gameOver: true,
				paused: false
			};
		}
	}

	componentWillMount() {
		window.addEventListener('keydown', this.handleKeyDown);
		document.addEventListener('visibilitychange', this.handleVisibilityChange);
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown);
		document.removeEventListener(
			'visibilitychange',
			this.handleVisibilityChange
		);
	}

	handleVisibilityChange = () => {
		if (document.hidden && !this.state.gameOver) {
			this.handlePause();
		}
	};

	handlePause() {
		if (!this.state.paused) {
			if (this.state.levelOver) {
				const newState = LevelLogic.getNextLevelState(this.state);
				this.setState({ ...newState, elapsedTime: 0, paused: true }, () =>
					saveState(this.state)
				);
			} else {
				const elapsedTime = getElapsedTime(this.state);
				this.setState({ paused: true, elapsedTime }, () =>
					saveState(this.state)
				);
			}
		}
	}

	handleResume = () => {
		const startTime = new Date().getTime() - this.state.elapsedTime;
		this.setState({ hasBeenPaused: true, paused: false, startTime });
		localStorage.removeItem('board-state');
	};

	setGameOver = () => {
		this.setState({ gameOver: true });
	};

	handleClick = (row, col) => e => {
		const { board: oldBoard, clicks: oldClicks, score, level } = this.state;
		const collection = BoardLogic.getSquareCollection(oldBoard, row, col);
		const clicks = oldClicks + 1;

		if (collection.length === 1) {
			// Don't do anything? Deduct score?
			const lastScore = -100 * (level + 1);
			this.setState({
				score: score + lastScore,
				lastScore,
				clicks
			});
			return;
		}

		const bestGroup = Math.max(this.state.bestGroup, collection.length);

		const board = BoardLogic.removeSquaresAndCondense(oldBoard, collection);

		const lastScore = collection.length * collection.length * (level + 5);

		const levelOver = BoardLogic.isLevelOver(board, this.state.movesLeft);

		const {
			pieceBonus = 0,
			timeBonus = 0,
			levelBonus = 0,
			gameOver = false
		} = this.handleLevelOver(levelOver, board);

		this.setState({
			bestGroup,
			rotating: false,
			falling: false,
			board,
			score: score + lastScore,
			lastScore,
			levelOver,
			pieceBonus,
			timeBonus,
			levelBonus,
			clicks,
			gameOver
		});
	};
	handleRotate = dir => () => {
		// set state rotating
		if (!this.state.rotating && this.canUseMove()) {
			this.setState({
				rotating: true,
				rotationDirection: dir,
				falling: false,
				movesLeft: this.state.movesLeft - 1
			});
		}
	};

	handleRandom = () => {
		if (this.canUseMove()) {
			const board = BoardLogic.randomizeBoard(this.state.board);

			const levelOver = BoardLogic.isLevelOver(board, this.state.movesLeft - 1);
			const levelOverState = this.handleLevelOver(levelOver, board);
			this.setState({
				board,
				movesLeft: this.state.movesLeft - 1,
				levelOver,
				...levelOverState
			});
		}
	};

	canUseMove() {
		return (
			this.state.movesLeft > 0 && !this.state.gameOver && !this.state.levelOver
		);
	}

	handleRestart = gameType => () => {
		this.setState({
			...LevelLogic.newGameState(gameType),
			gameType,
			initialized: true,
			paused: false
		});
		localStorage.removeItem('board-state');
	};

	resetEverything = () => {
		this.setState({ initialized: false });
	};

	goToNextLevel = () => {
		const newState = LevelLogic.getNextLevelState(this.state);
		this.setState(newState);
	};
	handleTransitionEnd = () => {
		// there may be more transitions some day
		if (this.state.rotating) {
			const board =
				this.state.rotationDirection === 1
					? BoardLogic.rotateBoard(this.state.board)
					: BoardLogic.rotateBoardCounter(this.state.board);
			const rotation = this.state.rotation + this.state.rotationDirection;
			this.setState({ rotating: false, rotation, falling: true, board });

			if (BoardLogic.isLevelOver(board, this.state.movesLeft)) {
				const levelOverState = this.handleLevelOver(true, board);
				this.setState({ levelOver: true, ...levelOverState });
			}
		}
	};

	handleKeyDown = e => {
		switch (e.key) {
			case 'ArrowLeft':
				this.handleRotate(-1)();
				e.preventDefault();
				break;
			case 'ArrowUp':
				this.handleRandom();
				e.preventDefault();
				break;
			case 'ArrowRight':
				this.handleRotate(1)();
				e.preventDefault();
				break;
			default:
		}
	};

	createSquares() {
		const { dim, board, rotation } = this.state;
		// Rounding up seems to be a good way of handling weird subpixel issues.
		const squareHeight = Math.ceil(GAME_SIZE / dim);
		return board.reduce((squares, pile, col) => {
			return squares.concat(
				pile.map((square, row) => {
					return (
						<Square
							key={square.id}
							dim={dim}
							row={row}
							col={col}
							rotation={rotation}
							squareHeight={squareHeight}
							handleClick={this.handleClick}
							color={square.val}
						/>
					);
				})
			);
		}, []);
	}

	// Meaning, there are no more clicks remaining in the board
	handleLevelOver = (isLevelOver, board) => {
		if (!isLevelOver) {
			return {};
		}
		const { gameType, level, startTime } = this.state;

		if (gameType === 'original') {
			// Return bonuses
			const pieceBonus = BoardLogic.getPieceBonus(board);
			const timeBonus = LevelLogic.getTimeBonus(level, startTime, gameType);
			return { pieceBonus, timeBonus };
		} else {
			// Puzzle
			const gameOver = board.length > 0;
			const pieceBonus = BoardLogic.getPieceBonus(board);
			const levelBonus = (level + 1) * 1000;

			return { gameOver, pieceBonus, levelBonus };
		}
	};

	render() {
		// Resize when possible?
		// const height = this.state.board
		// 	.map(pile => pile.length)
		// 	.reduce((max, len) => Math.max(max, len), 0);
		// const dim = Math.max(height, this.state.board.length, 2);

		const squares = this.createSquares();

		// Need to keep the order of elements in order on the page for transitions to work
		squares.sort((a, b) => a.key - b.key);

		const effectiveRotation = this.state.rotating
			? this.state.rotation + this.state.rotationDirection
			: this.state.rotation;
		const gameStyle = {
			height: GAME_SIZE + 'px',
			width: GAME_SIZE + 'px',
			transform: `rotate(${effectiveRotation * 90}deg)`
		};

		let classes = effectiveRotation % 2 ? 'sideways' : 'upright';
		if (this.state.rotating) {
			classes += ' rotating';
		}
		if (this.state.falling) {
			classes += ' falling';
		}

		const { initialized, levelOver, gameOver, paused } = this.state;
		const inactive = !initialized || levelOver || gameOver || paused;

		return (
			<div id="wrapper">
				<div className=" header clearfix">
					<h1>DropClicks</h1>
					<div className="header-container">
						<div className="score-container">
							<div className="score">
								<div className="score-header">LEVEL</div>
								<div>{this.state.level + 1}</div>
							</div>
						</div>
						<div className="score-container">
							<div className="score">
								<div className="score-header">SCORE</div>
								<div>{this.state.score.toLocaleString()}</div>
							</div>

							<LastScore
								key={this.state.clicks + this.state.level}
								score={this.state.lastScore}
							/>
						</div>
					</div>
				</div>
				<div style={{ position: 'relative' }}>
					{inactive && (
						<Overlays
							restartGame={this.handleRestart}
							resumeGame={this.handleResume}
							resetGame={this.resetEverything}
							rotation={effectiveRotation}
							goToNextLevel={this.goToNextLevel}
							{...this.state}
							paused={this.state.paused}
						/>
					)}
					<div
						style={gameStyle}
						onTransitionEnd={this.handleTransitionEnd}
						id="game"
						className={classes}
					>
						{/* <CSSTransitionGroup
						transitionName="explode"
						transitionLeaveTimeout={300}
						transitionEnter={false}
					> */}
						{squares}
						{/* </CSSTransitionGroup> */}
					</div>
				</div>
				{this.state.gameType === 'original' && (
					<Timer
						startTime={this.state.startTime}
						active={!inactive}
						time={this.state.time}
						hasBeenPaused={this.state.hasBeenPaused}
						elapsedTime={this.state.elapsedTime}
						setGameOver={this.setGameOver}
					/>
				)}
				<Buttons
					active={!inactive}
					handleRotate={this.handleRotate}
					handleRandom={this.handleRandom}
					movesLeft={this.state.movesLeft}
				/>
			</div>
		);
	}
}

export default App;
