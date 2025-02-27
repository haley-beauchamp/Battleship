import Gameboard from "./gameboard";

class Player {
	constructor(player_type) {
		this.player_type = player_type;
		this.game_board = new Gameboard();
	}
}

export default Player;
