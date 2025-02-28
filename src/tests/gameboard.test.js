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
		coordinates.forEach((coordinate) => {
			expect(gameboard.getShipAt(coordinate)).toEqual(undefined);
		});
	});

	it("does not place two ships at the same coordinates", () => {
		const gameboard = new Gameboard();
		gameboard.placeShip(3, ["A1", "A2", "A3"]);
		const response = gameboard.placeShip(3, ["C3", "B3", "A3"]);
		expect(response).toBe(undefined);
	})

	it("takes coordinates and attacks a ship", () => {
		const gameboard = new Gameboard();
		const ship_length = 5;
		const coordinates = ["A1", "A2", "A3", "A4", "A5"];

		gameboard.placeShip(ship_length, coordinates);
		gameboard.receiveAttack("A3");

		const ship = gameboard.getShipAt("A3");
		expect(ship.hits).toBe(1);
	});

	it("records a miss if no ship was hit", () => {
		const gameboard = new Gameboard();
		const ship_length = 5;
		const coordinates = ["A1", "A2", "A3", "A4", "A5"];

		gameboard.placeShip(ship_length, coordinates);
		gameboard.receiveAttack("B3");

		expect(gameboard.missed_shots.has("B3")).toBe(true);
	});

	it("does not allow repeat failed attacks", () => {
		const gameboard = new Gameboard();
		const ship_length = 5;
		const coordinates = ["A1", "A2", "A3", "A4", "A5"];

		gameboard.placeShip(ship_length, coordinates);
		gameboard.receiveAttack("B3");
		const response = gameboard.receiveAttack("B3");

		expect(response).toBe("Try Again");
	});

	it("does not allow repeat successful attacks", () => {
		const gameboard = new Gameboard();
		const ship_length = 5;
		const coordinates = ["A1", "A2", "A3", "A4", "A5"];

		gameboard.placeShip(ship_length, coordinates);
		gameboard.receiveAttack("A3");
		const response = gameboard.receiveAttack("A3");

		expect(response).toBe("Try Again");
	});

	it("determines a ship has been sunk", () => {
		const gameboard = new Gameboard();
		const ship_length = 2;
		const coordinates = ["A1", "A2"];

		gameboard.placeShip(ship_length, coordinates);
		gameboard.receiveAttack("A1");
		gameboard.receiveAttack("A2");

		expect(gameboard.sunken_ships).toEqual(1);
	});

	it("determines when all ships have been sunk", () => {
        const gameboard = new Gameboard();
		const ship_length = 2;
		const coordinates = ["A1", "A2"];

		gameboard.placeShip(ship_length, coordinates);
		gameboard.receiveAttack("A1");
		gameboard.receiveAttack("A2");

		expect(gameboard.allShipsSunk()).toEqual(true);
    });

    it("does not reply that all ships are sunk when only 1 has been", () => {
        const gameboard = new Gameboard();

		gameboard.placeShip(2, ["A1", "A2"]);
        gameboard.placeShip(2, ["H1", "H2"]);
		gameboard.receiveAttack("A1");
		gameboard.receiveAttack("A2");

		expect(gameboard.allShipsSunk()).toEqual(false);
    });
});
