export const createBoard = (dim, colors) => {
	const board = [];
	for (var i = 0; i < dim; i++) {
		board.push([]);
		for (var j = 0; j < dim; j++) {
			board[i].push({
				id: Math.random(),
				val: Math.floor(Math.random() * colors)
			});
		}
	}
	return board;
};

export const rotateBoard = board => {
	let newBoard = [];
	for (var i = board.length - 1; i >= 0; i--) {
		for (var j = 0; j < board[i].length; j++) {
			const newCol = j;
			const newRow = board.length - i - 1;

			if (!newBoard[newCol]) {
				newBoard[newCol] = [];
			}

			newBoard[newCol][newRow] = board[i][j];
		}
	}

	return newBoard.map(pile => pile.filter(square => square !== undefined));
};

export const rotateBoardCounter = board => {
	let newBoard = [];
	const dim = board
		.map(pile => pile.length)
		.reduce((max, len) => Math.max(max, len), 0);
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			const newCol = dim - 1 - j;
			if (!newBoard[newCol]) {
				newBoard[newCol] = [];
			}
			newBoard[dim - 1 - j][i] = board[i][j];
		}
	}

	return newBoard.map(pile => pile.filter(square => square !== undefined));
};

// HT: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

export const randomizeBoard = board => {
	let coords = board.reduce((cum, pile, i) => {
		return cum.concat(pile.map((square, j) => [i, j]));
	}, []);

	shuffleArray(coords);
	let newBoard = [];

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (!newBoard[i]) {
				newBoard[i] = [];
			}
			const [x, y] = coords.pop();
			newBoard[i][j] = board[x][y];
		}
	}

	return newBoard;
};

const getAdjacentSquares = (dim, board, pileIdx, pileNum) => {
	const possibleAdjacent = [
		[pileIdx, pileNum + 1],
		[pileIdx, pileNum - 1],
		[pileIdx - 1, pileNum],
		[pileIdx + 1, pileNum]
	];

	return possibleAdjacent
		.filter(([idx, num]) => {
			return (
				typeof board[idx] !== 'undefined' &&
				typeof board[idx][num] !== 'undefined'
			);
		})
		.map(([idx, num]) => idx * dim + num);
};

const parseIdx = (idx, dim) => [Math.floor(idx / dim), idx % dim];

export const getSquareCollection = (board, row, col) => {
	const dim = board
		.map(pile => pile.length)
		.reduce((max, len) => Math.max(max, len), 0);
	const color = board[row][col].val;
	const squareIdx = row * dim + col;

	let collection = [squareIdx];
	let checkedSquares = [squareIdx];

	let squaresToCheck = getAdjacentSquares(dim, board, row, col);

	while (squaresToCheck.length) {
		const [idx, num] = parseIdx(squaresToCheck.shift(), dim);

		if (board[idx][num].val === color) {
			collection.push(idx * dim + num);
			let newSquaresToCheck = getAdjacentSquares(dim, board, idx, num);

			squaresToCheck = squaresToCheck
				.concat(newSquaresToCheck)
				// Avoid copies
				.reduce((cum, current) => {
					if (cum.indexOf(current) === -1) {
						cum.push(current);
					}
					return cum;
				}, [])
				// filter out already checked
				.filter(idx => {
					return checkedSquares.indexOf(idx) === -1;
				});
		}
		checkedSquares.push(idx * dim + num);
	}

	return collection.map(idx => parseIdx(idx, dim));
};

const condensePiles = board => {
	return board.filter(pile => pile.length);
};

export const removeSquaresAndCondense = (board, squaresToRemove) => {
	squaresToRemove.forEach(([idx, num]) => (board[idx][num] = false));

	const boardWithPossibleExtraPiles = board.map(pile => {
		return pile.filter(square => square !== false);
	});

	return condensePiles(boardWithPossibleExtraPiles);
};

export const isLevelOver = (board, movesLeft) => {
	const colors = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[i].length; j++) {
			if (movesLeft > 0) {
				// Let's just check for multiple of the same colors
				if (colors.indexOf(board[i][j].val) === -1) {
					colors.push(board[i][j].val);
				} else {
					return false;
				}
			} else {
				// If no "movesLeft", we need to see if there are any adjacent squares
				const collection = getSquareCollection(board, i, j);
				if (collection.length > 1) {
					return false;
				}
			}
		}
	}
	return true;
};

export const getPieceBonus = board => {
	const piecesLeft = board.reduce((cum, col) => cum + col.length, 0);

	if (piecesLeft === 0) {
		return 10000;
	} else {
		return Math.max(5000 - piecesLeft * 100, 0);
	}
};
