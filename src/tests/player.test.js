import Player from "../features/player";
import Gameboard from "../features/gameboard";

describe("Tests for the Battleship Player Object", () => {
	it("sets the player type correctly", () => {
		const player = new Player("human");
		expect(player.player_type).toBe("human");
	});
	it("initializes with a game board", () => {
		const player = new Player("human");
		expect(player.game_board).toBeInstanceOf(Gameboard);
	});
});
