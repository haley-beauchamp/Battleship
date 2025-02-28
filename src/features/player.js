import Gameboard from "./gameboard.js";

class Player {
	constructor(player_name) {
		this.player_name = player_name;
		this.game_board = new Gameboard();
	}
}

export default Player;
