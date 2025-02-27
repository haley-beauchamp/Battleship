import Ship from "../features/ship.js";

describe("Tests for the Battleship Ship objects", () => {
	it("creates ship of length 5", () => {
		const ship = new Ship(5);
		expect(ship.ship_length).toBe(5);
	});
	it("tracks hits on the ship", () => {
		const ship = new Ship(5);
		const hits = 2;

		for (let i = hits; i > 0; i--) {
			ship.hit();
		}

		const timesHit = ship.hits;
		expect(timesHit).toBe(hits);
	});
	it("sinks ship", () => {
		const ship = new Ship(3);
		const hits = 3;

		for (let i = 0; i < hits; i++) {
			ship.hit();
		}

		const isSunk = ship.isSunk();
		expect(isSunk).toBe(true);
	});
	it("correctly identifies a ship that has not been sunk", () => {
		const ship = new Ship(3);
		const hits = 2;

		for (let i = 0; i < hits; i++) {
			ship.hit();
		}

		const isSunk = ship.isSunk();
		expect(isSunk).toBe(false);
	});
});
