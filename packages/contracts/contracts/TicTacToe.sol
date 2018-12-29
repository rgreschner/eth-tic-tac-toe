pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./EmergencyStop.sol";

/**
 * Game contract of Tic Tac Toe game.
 */
contract TicTacToe is Ownable, EmergencyStop {

    /**
     * Game phases.
     */
    enum GamePhase {
        /** Players joining. */
        Join,
        /** Turn of player #1. */
        TurnPlayer1,
        /** Turn of player #2. */
        TurnPlayer2,
        /** Game finished. */
        Finished
    }

    /** Current game phase. */
    GamePhase private _gamePhase = GamePhase.Join;
    /** Address of winning player. */
    address private _winner;
    /** Game board data. */
    uint8[9] private _board;
    /** Participating players. */
    address[2] private _players;
    /**
     * Count of players required to
     * join in order to start the game. 
     */
    uint8 private _playersNeededToStart = 2;

    /** Number of elapsed game turns. */
    uint8 private _elapsedTurns = 0;

    /**
     * Allow only players of the game to access
     * this method.
     */
    modifier onlyPlayer {
        uint8 playerNum = getPlayerNum(msg.sender);
        bool isPlayer = msg.sender != address(0) && playerNum != 0;
        require(isPlayer, "Caller is not player of game!");
        _;
    }

    /**
     * Allow only non-players of the game to access
     * this method.
     */
    modifier onlyNonPlayer {
        uint8 playerNum = getPlayerNum(msg.sender);
        bool isNotPlayer = msg.sender != address(0) && playerNum == 0;
        require(isNotPlayer, "Caller is already player of game!");
        _;
    }

    /**
     * Allow access to this method only
     * in join phase of game.
     */
    modifier onlyInJoinPhase() {
        require(_gamePhase == GamePhase.Join, "Invalid game phase for call!");
        _;
    }

    /**
     * Allow access to this method only
     * in any player turn phase of game.
     */
    modifier onlyInPlayerTurnPhase() {
        bool isValidGamePhase = _gamePhase == GamePhase.TurnPlayer1 || _gamePhase == GamePhase.TurnPlayer2;
        require(isValidGamePhase, "Invalid game phase for call!");
        _;
    }

    /** 
     * Get number of player by player address.
     * Valid player numbers are 1 and 2.
     */
    function getPlayerNum(address player) private view returns (uint8) {
        for (uint i = 0; i < _players.length; ++i) {
            if (_players[i] == player) {
                return (uint8(i))+1;
            }
        }
        // 0 means player not found.
        return 0;
    }

    /**
     * Has game board any empty fields?
     */
    function hasEmptyFields() private view returns (bool) {
        for (uint i = 0; i < _board.length; ++i) {
            if (_board[i] == 0) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check line of fields for
     * player win condition.
     */
    function checkLine(uint8[3] memory toCheck, uint8 value) private pure returns (bool) {
        for (uint8 i = 0; i < 3; ++i) {
            if (toCheck[i] != value) {
                return false;
            }
        }
        return true;
    }

    /**
     * Check game board for
     * game finish & player win condition.
     */
    function checkWinningPlayerNum() private view returns (uint8) {
        uint8[3] memory toCheck = [0, 0, 0];
        uint8 x = 0;
        uint8 y = 0;
        uint8 index = 0;
        // Check rows.
        for (y = 0; y < 3; ++y) {
            for (x = 0; x < 3; ++x) {
                index = (y*3) + x;
                toCheck[x] = _board[index];
            }
            if (checkLine(toCheck, 1)) return 1;
            if (checkLine(toCheck, 2)) return 2;
        }
        // Check columns.
        for (x = 0; x < 3; ++x) {
            for (y = 0; y < 3; ++y) {
                index = (y*3) + x;
                toCheck[y] = _board[index];
            }
            if (checkLine(toCheck, 1)) return 1;
            if (checkLine(toCheck, 2)) return 2;
        }
        // Check diagonals.
        toCheck = [_board[0], _board[4], _board[8]];
        if (checkLine(toCheck, 1)) return 1;
        if (checkLine(toCheck, 2)) return 2;
        toCheck = [_board[2], _board[4], _board[6]];
        if (checkLine(toCheck, 1)) return 1;
        if (checkLine(toCheck, 2)) return 2;
        return 0;
    }

    /**
     * Perform player turn for
     * player with number &
     * flag field at position.
     */
    function playerTurnForNum(uint8 playerNum, uint8 x, uint8 y)
        private
        returns (GamePhase) {
        require(playerNum >= 1, "Invalid player");
        bool isValidPlayerTurn = (_gamePhase == GamePhase.TurnPlayer1 && playerNum == 1) ||
            (_gamePhase == GamePhase.TurnPlayer2 && playerNum == 2);
        require(isValidPlayerTurn, "Not this player's turn.");
        uint8 index = (y*3) + x;
        bool isValidBoardPosition = (index >= 0 && index < 9);
        require(isValidBoardPosition, "Invalid board position.");
        require(_board[index] == 0, "Board position already set.");
        _board[index] = playerNum;
        _elapsedTurns = _elapsedTurns + 1;
        bool emptyFields = hasEmptyFields();
        uint8 winningPlayerNum = checkWinningPlayerNum();
        if (winningPlayerNum == 0) {
            if (!emptyFields) _gamePhase = GamePhase.Finished;
            else if (playerNum == 1) _gamePhase = GamePhase.TurnPlayer2;
            else _gamePhase = GamePhase.TurnPlayer1;
            return _gamePhase;
        } 
        _gamePhase = GamePhase.Finished;
        _winner = _players[winningPlayerNum - 1];
        return _gamePhase;
    }

    /**
     * Let calling address join game as
     * new player.
     */
    function join()
        public 
        stoppedInEmergency onlyInJoinPhase onlyNonPlayer returns (int) {
        address player = msg.sender;
        _players[2 - _playersNeededToStart] = player;
        --_playersNeededToStart;
        if (_playersNeededToStart == 0) {
            _gamePhase = GamePhase.TurnPlayer1;
        }
        return 0;
    }

   /**
     * Perform player turn for
     * calling player &
     * flag field at position.
     */
    function playerTurn(uint8 x, uint8 y) 
        public 
        stoppedInEmergency onlyInPlayerTurnPhase onlyPlayer 
        returns (GamePhase) {
        uint8 playerNum = getPlayerNum(msg.sender);
        return playerTurnForNum(playerNum, x, y);
    }

    /**
     * Get address of winning player.
     */
    function winner() public view stoppedInEmergency returns (address) {
        return _winner;
    }

    /**
     * Get current game phase.
     */
    function gamePhase() public view stoppedInEmergency returns (GamePhase) {
        return _gamePhase;
    }

     /**
     * Get number of elapsed game turns.
     */
    function elapsedTurns() public view stoppedInEmergency returns (uint8) {
        return _elapsedTurns;
    }

    /**
     * Get game board data.
     */
    function board() public view stoppedInEmergency returns (uint8[9] memory) {
        return _board;
    }

    /**
     * Get participating players.
     */
    function players() public view stoppedInEmergency returns (address[2] memory) {
        return _players;
    }

}
