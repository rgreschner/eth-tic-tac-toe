export const printBoard = (board, description?) => {
	return ;
	let rows = [];
	for (let y = 1; y <= 3; ++y) {
		let row = '.'.repeat(3);
		for (let x = 1; x <= 3; ++x) {
			const index = (y - 1) * 3 + (x - 1);
			const field = board[index].toNumber();
			if (field == 0) continue;
			const mark = field == 1 ? 'X' : 'O';
			row = row.substr(0, x - 1) + mark + row.substr(x, x - 1);
		}
		rows.push(row);
	}
	console.log(rows.join('\r\n'));
	if (!!description) console.log(description);
	console.log();
}