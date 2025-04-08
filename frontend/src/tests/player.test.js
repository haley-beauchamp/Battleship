import Player from "../features/player";
import Gameboard from "../features/gameboard";

describe("Tests for the Battleship Player Object", () => {
	it("sets the player name correctly", () => {
		const player = new Player("player");
		expect(player.player_name).toBe("player");
	});
	it("initializes with a game board", () => {
		const player = new Player("player");
		expect(player.game_board).toBeInstanceOf(Gameboard);
	});
});
