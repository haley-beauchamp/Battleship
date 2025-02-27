import Ship from "../features/ship";

class Gameboard {
	constructor() {
		this.grid = {};
		this.ships = [];
		this.missedShots = new Set();
		this.successfulShots = new Set();
		this.sunkenShips = 0;
	}

	receiveAttack(coordinate) {
		if (this.missedShots.has(coordinate) || this.successfulShots.has(coordinate)) {
			return "Try Again";
		}

		const ship = this.getShipAt(coordinate);
		if (ship) {
			ship.hit();
			this.successfulShots.add(coordinate);

			if (ship.isSunk()) {
				this.sunkenShips++;
				if (this.allShipsSunk()) {
                    return "All Ships Sunk";
				};
				return "Ship Sunk";
			}
		} else {
			this.missedShots.add(coordinate);
		}
	}

	allShipsSunk() {
		if (this.sunkenShips === this.ships.length) {
			return true;
		}
		return false;
	}

	placeShip(ship_length, coordinates) {
		const ship = new Ship(ship_length);

		if (!this.areValidCoordinates(coordinates)) {
			return;
		}

		if (!this.areCoordinatesAdjacent(coordinates)) {
			return;
		}

		this.ships.push(ship);

		coordinates.forEach((coord) => {
			this.grid[coord] = ship;
		});
	}

	getShipAt(coordinate) {
		return this.grid[coordinate];
	}

	areValidCoordinates(coordinates) {
		for (const coordinate of coordinates) {
			const letter = coordinate[0];
			if (letter < "A" || letter > "J") {
				return false;
			}

			const number = parseInt(coordinate.slice(1));
			if (number < 1 || number > 10) {
				return false;
			}
		}

		return true;
	}

	areCoordinatesAdjacent(coordinates) {
		let letters = [];
		let numbers = [];

		for (const coordinate of coordinates) {
			const letter = coordinate[0];
			letters.push(letter);

			const number = parseInt(coordinate.slice(1));
			numbers.push(number);
		}

		letters = letters.sort();
		numbers = numbers.sort((a, b) => a - b);

		for (let i = 1; i < coordinates.length; i++) {
			let sameLetter = true;
			let sameNumber = true;

			if (letters[i].charCodeAt(0) - letters[i - 1].charCodeAt(0) > 1) {
				return false;
			} else if (letters[i].charCodeAt(0) != letters[i - 1].charCodeAt(0)) {
				sameLetter = false;
			}

			if (numbers[i] - numbers[i - 1] > 1) {
				return false;
			} else if (numbers[i] != numbers[i - 1]) {
				sameNumber = false;
			}

			if (!sameLetter && !sameNumber) {
				return false;
			}
		}

		return true;
	}
}

export default Gameboard;
