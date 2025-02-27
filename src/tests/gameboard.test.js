import Gameboard from "../features/gameboard";
import Ship from "../features/ship";

describe("Tests for the Battleship Gameboard Object", () => {
	it("places a ship with different number coordinates", () => {
		const gameboard = new Gameboard();
		const ship_length = 2;
		const coordinates = ["H1", "H2"];
		const ship = new Ship(ship_length);

		gameboard.placeShip(ship_length, coordinates);
		coordinates.forEach((coord) => {
			expect(gameboard.getShipAt(coord)).toEqual(ship);
		});
	});

    it("places a ship with different letter coordinates", () => {
		const gameboard = new Gameboard();
		const ship_length = 3;
		const coordinates = ["A1", "B1", "C1"];
		const ship = new Ship(ship_length);

		gameboard.placeShip(ship_length, coordinates);
		coordinates.forEach((coord) => {
			expect(gameboard.getShipAt(coord)).toEqual(ship);
		});
	});

	it("does not place a ship at invalid letter coordinates", () => {
		const gameboard = new Gameboard();
		const ship_length = 2;
		const coordinates = ["J1", "K1"];

		gameboard.placeShip(ship_length, coordinates);
		coordinates.forEach((coord) => {
			expect(gameboard.getShipAt(coord)).toEqual(undefined);
		});
	});

    it("does not place a ship at invalid number coordinates", () => {
		const gameboard = new Gameboard();
		const ship_length = 2;
		const coordinates = ["A11", "A10"];

		gameboard.placeShip(ship_length, coordinates);
		coordinates.forEach((coord) => {
			expect(gameboard.getShipAt(coord)).toEqual(undefined);
		});
	});

    it("does not place ship if coordinates are not adjacent", () => {
        const gameboard = new Gameboard();
		const ship_length = 3;
		const coordinates = ["A1", "A2", "B3"];

		gameboard.placeShip(ship_length, coordinates);
		coordinates.forEach((coord) => {
			expect(gameboard.getShipAt(coord)).toEqual(undefined);
		});
    })
});
