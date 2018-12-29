export const getBoardAt = (board, x, y) => {
	const index = y * 3 + x;
	const field = board[index].toNumber();
	return field;
}