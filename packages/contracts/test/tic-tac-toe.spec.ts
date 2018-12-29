import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import * as sinon from "sinon";
import { expect } from "chai";
import { getBoardAt } from "./helpers/get-board-at";
import { printBoard } from "./helpers/print-board";
import { GamePhaseEnum } from "./helpers/game-phase.enum";

chai.use(chaiAsPromised);

declare var artifacts: any;
declare var contract: any;

const TicTacToe = artifacts.require("TicTacToe");

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
const BOARD_SIZE = 3 * 3;

/**
 * Test-suite for TicTacToe contract.
 */
contract("TicTacToe", function(accounts: string[]) {
	/**
	 * Deployed contract instance.
	 */
	let instance: any = null;

	/**
	 * Deploy instance before doing anything.
	 */
	before(async () => {
		instance = await TicTacToe.deployed();
	});

	it("should be deployed", async () => {
		console.log(`Contract deployed @ ${instance.address}`);
		expect(instance.address).to.not.be.null;
	});

	describe("as Ownable", () => {
		it("should be owned", async () => {
			const isOwner = await instance.isOwner();
			expect(isOwner).to.be.true;
			const owner = await instance.owner();
			expect(owner).to.equal(accounts[0]);
		});
	});

	describe("initialization status", () => {
		it(`should be in game phase 'Join'`, async () => {
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(GamePhaseEnum.Join);
		});

		it("should be in turn #0", async () => {
			const elapsedTurns = await instance.elapsedTurns();
			expect(elapsedTurns.toNumber()).to.equal(0);
		});

		it("should have no players", async () => {
			const players = await instance.players();
			expect(Array.isArray(players)).to.equal(true);
			expect(players).to.have.length(2);
			expect(players[0]).to.equal(NULL_ADDRESS);
			expect(players[1]).to.equal(NULL_ADDRESS);
		});

		it(`should have empty board`, async () => {
			const board = await instance.board();
			expect(Array.isArray(board)).to.equal(true);
			expect(board).to.have.length(BOARD_SIZE);
			for (let field of board) {
				expect(field.toNumber()).to.equal(0);
			}
			printBoard(board);
		});

		it("should have no winner", async () => {
			const winner = await instance.winner();
			expect(winner).to.equal(NULL_ADDRESS);
		});
	});

	describe("Test Game manually", () => {
		it(`should be in game phase 'Join'`, async () => {
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(GamePhaseEnum.Join);
		});

		it("should be joinable for owner", async () => {
			await instance.join();
			const players = await instance.players();
			expect(Array.isArray(players)).to.equal(true);
			expect(players).to.have.length(2);
			expect(players[0]).to.equal(accounts[0]);
			expect(players[1]).to.equal(NULL_ADDRESS);
		});

		it("should be joinable for others", async () => {
			await instance.join({ from: accounts[1] });
			const players = await instance.players();
			expect(Array.isArray(players)).to.equal(true);
			expect(players).to.have.length(2);
			expect(players[0]).to.equal(accounts[0]);
			expect(players[1]).to.equal(accounts[1]);
		});

		it(`should have empty board`, async () => {
			const board = await instance.board();
			expect(Array.isArray(board)).to.equal(true);
			expect(board).to.have.length(BOARD_SIZE);
			for (let field of board) {
				expect(field.toNumber()).to.equal(0);
			}
			printBoard(board);
		});

		it(`should be in game phase 'TurnPlayer1'`, async () => {
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(GamePhaseEnum.TurnPlayer1);
		});

		it(`should perform turn #1 for player #1`, async () => {
			const boardBeforeTurn = await instance.board();
			expect(getBoardAt(boardBeforeTurn, 1, 1)).to.equal(0);
			await instance.playerTurn(1, 1);
			const boardAfterTurn = await instance.board();
			expect(getBoardAt(boardAfterTurn, 1, 1)).to.equal(1);
			printBoard(boardAfterTurn);
		});

		it(`should be in game phase 'TurnPlayer2'`, async () => {
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(GamePhaseEnum.TurnPlayer2);
		});

		it("should be in turn #1", async () => {
			const elapsedTurns = await instance.elapsedTurns();
			expect(elapsedTurns.toNumber()).to.equal(1);
		});

		it(`should reject when performing turn #2 for player #1`, async () => {
			const boardBeforeTurn = await instance.board();
			expect(getBoardAt(boardBeforeTurn, 0, 1)).to.equal(0);
			sinon.spy(instance, "playerTurn");
			try {
				await instance.playerTurn(0, 1);
			} catch (err) {}
			expect(instance.playerTurn.returnValues[0]).to.be.rejectedWith(
				Error,
				`Not this player's turn.`
			);
			instance.playerTurn.restore();
			const boardAfterTurn = await instance.board();
			expect(getBoardAt(boardAfterTurn, 0, 1)).to.equal(0);
		});

		it(`should perform turn #2 for player #2`, async () => {
			const player2 = accounts[1];
			const boardBeforeTurn = await instance.board({ from: player2 });
			expect(getBoardAt(boardBeforeTurn, 0, 1)).to.equal(0);
			await instance.playerTurn(0, 1, { from: player2 });
			const boardAfterTurn = await instance.board({ from: player2 });
			expect(getBoardAt(boardAfterTurn, 0, 1)).to.equal(2);
			printBoard(boardAfterTurn);
		});

		it("should be in turn #1", async () => {
			const elapsedTurns = await instance.elapsedTurns();
			expect(elapsedTurns.toNumber()).to.equal(2);
		});
	});

	const playGame = async (players, turns) => {
		for (let i = 0; i < turns.length; ++i) {
			const playerNum = i % 2;
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(
				playerNum == 0
					? GamePhaseEnum.TurnPlayer1
					: GamePhaseEnum.TurnPlayer2
			);
			const currentTurn = turns[i];
			const player = players[playerNum];
			await instance.playerTurn(currentTurn.x, currentTurn.y, {
				from: player
			});
			const boardAtEnd = await instance.board();
			const elapsedTurns = await instance.elapsedTurns();
			printBoard(
				boardAtEnd,
				`Board after turn #${elapsedTurns} of player #${gamePhaseNum}.`
			);
		}
	};

	describe("Auto Test Game #1 (win player #1)", () => {
		before(async () => {
			instance = await TicTacToe.new();
			console.log(`Contract deployed @ ${instance.address}`);
		});

		it(`should be in game phase 'Join'`, async () => {
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(GamePhaseEnum.Join);
		});

		it("should be joinable for others", async () => {
			const joiningPlayers = accounts.slice(0, 2);
			for (let i = 0; i < joiningPlayers.length; ++i) {
				await instance.join({ from: joiningPlayers[i] });
			}
			const players = await instance.players();
			expect(players).to.have.length(2);
			expect(players).to.have.length(joiningPlayers.length);
			for (let i = 0; i < players.length; ++i) {
				expect(players[i]).to.not.equal(NULL_ADDRESS);
			}
			for (let i = 0; i < joiningPlayers.length; ++i) {
				expect(players[i]).to.equal(joiningPlayers[i]);
			}
		});

		it(`should be in game phase 'TurnPlayer1'`, async () => {
			const gamePhase = await instance.gamePhase();
			const gamePhaseNum = gamePhase.toNumber();
			expect(gamePhaseNum).to.equal(GamePhaseEnum.TurnPlayer1);
		});

		it(`should play the game #1`, async () => {
			const boardAtStart = await instance.board();
			printBoard(boardAtStart, "Board at start.");
			const players = accounts.slice(0, 2);
			const TURNS = [
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 2 }
				//{x:2, y:0}
			];
			await playGame(players, TURNS);
			const gamePhaseAtEnd = await instance.gamePhase();
			const gamePhaseAtEndNum = gamePhaseAtEnd.toNumber();
			expect(gamePhaseAtEndNum).to.equal(GamePhaseEnum.Finished);
			const winner = await instance.winner();
			expect(winner).to.equal(players[0]);
		});
	});

	describe("Auto Test Game #2 (win player #2)", () => {
		before(async () => {
			instance = await TicTacToe.new();
			console.log(`Contract deployed @ ${instance.address}`);
		});

		it("should be setup", async () => {
			const joiningPlayers = accounts.slice(0, 2);
			for (let i = 0; i < joiningPlayers.length; ++i) {
				await instance.join({ from: joiningPlayers[i] });
			}
			const players = await instance.players();
			expect(players).to.have.length(2);
			expect(players).to.have.length(joiningPlayers.length);
			for (let i = 0; i < players.length; ++i) {
				expect(players[i]).to.not.equal(NULL_ADDRESS);
			}
			for (let i = 0; i < joiningPlayers.length; ++i) {
				expect(players[i]).to.equal(joiningPlayers[i]);
			}
		});

		it(`should play the game #2`, async () => {
			const boardAtStart = await instance.board();
			printBoard(boardAtStart);
			const players = accounts.slice(0, 2);
			const TURNS = [
				{ x: 2, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 2, y: 2 }
			];
			await playGame(players, TURNS);
			const gamePhaseAtEnd = await instance.gamePhase();
			const gamePhaseAtEndNum = gamePhaseAtEnd.toNumber();
			expect(gamePhaseAtEndNum).to.equal(GamePhaseEnum.Finished);
			const winner = await instance.winner();
			expect(winner).to.equal(players[1]);
		});
	});

	describe("Auto Test Game #3 (draw)", () => {
		before(async () => {
			instance = await TicTacToe.new();
			console.log(`Contract deployed @ ${instance.address}`);
		});

		it("should be setup", async () => {
			const joiningPlayers = accounts.slice(0, 2);
			for (let i = 0; i < joiningPlayers.length; ++i) {
				await instance.join({ from: joiningPlayers[i] });
			}
			const players = await instance.players();
			expect(players).to.have.length(2);
			expect(players).to.have.length(joiningPlayers.length);
			for (let i = 0; i < players.length; ++i) {
				expect(players[i]).to.not.equal(NULL_ADDRESS);
			}
			for (let i = 0; i < joiningPlayers.length; ++i) {
				expect(players[i]).to.equal(joiningPlayers[i]);
			}
		});

		it(`should play the game #3`, async () => {
			const boardAtStart = await instance.board();
			printBoard(boardAtStart);
			const players = accounts.slice(0, 2);
			const TURNS = [
				{ x: 1, y: 0 },
				{ x: 0, y: 0 },
				{ x: 2, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 },
				{ x: 2, y: 1 },
				{ x: 0, y: 2 },
				{ x: 1, y: 2 },
				{ x: 2, y: 2 }
			];
			await playGame(players, TURNS);
			const gamePhaseAtEnd = await instance.gamePhase();
			const gamePhaseAtEndNum = gamePhaseAtEnd.toNumber();
			expect(gamePhaseAtEndNum).to.equal(GamePhaseEnum.Finished);
			const winner = await instance.winner();
			expect(winner).to.equal(NULL_ADDRESS);
		});
	});

	describe("Auto Test Game #4 (draw)", () => {
		before(async () => {
			instance = await TicTacToe.new();
			console.log(`Contract deployed @ ${instance.address}`);
		});

		it("should be setup", async () => {
			const joiningPlayers = accounts.slice(0, 2);
			for (let i = 0; i < joiningPlayers.length; ++i) {
				await instance.join({ from: joiningPlayers[i] });
			}
			const players = await instance.players();
			expect(players).to.have.length(2);
			expect(players).to.have.length(joiningPlayers.length);
			for (let i = 0; i < players.length; ++i) {
				expect(players[i]).to.not.equal(NULL_ADDRESS);
			}
			for (let i = 0; i < joiningPlayers.length; ++i) {
				expect(players[i]).to.equal(joiningPlayers[i]);
			}
		});

		it(`should play the game #4`, async () => {
			const boardAtStart = await instance.board();
			printBoard(boardAtStart);
			const players = accounts.slice(0, 2);
			const TURNS = [
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
				{ x: 2, y: 0 },
				{ x: 2, y: 1 },
				{ x: 0, y: 1 },
				{ x: 0, y: 2 },
				{ x: 2, y: 2 },
				{ x: 1, y: 2 }
			];
			await playGame(players, TURNS);
			const gamePhaseAtEnd = await instance.gamePhase();
			const gamePhaseAtEndNum = gamePhaseAtEnd.toNumber();
			expect(gamePhaseAtEndNum).to.equal(GamePhaseEnum.Finished);
			const winner = await instance.winner();
			expect(winner).to.equal(NULL_ADDRESS);
		});
	});
});
