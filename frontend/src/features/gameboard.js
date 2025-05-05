import Ship from "./ship.js";

class Gameboard {
	constructor() {
		this.grid = {};
		this.ships = [];
		this.missed_shots = new Set();
		this.successful_shots = new Set();
		this.sunken_ships = 0;
	}

	// reset everything to initial state
	reset() {
		this.grid = {};
		this.ships = [];
		this.missed_shots = new Set();
		this.successful_shots = new Set();
		this.sunken_ships = 0;
	}

	receiveAttack(coordinate) {
		if (this.missed_shots.has(coordinate) || this.successful_shots.has(coordinate)) {
			return "Try Again";
		}

		const ship = this.getShipAt(coordinate);
		if (ship) {
			ship.hit();
			this.successful_shots.add(coordinate);

			if (ship.isSunk()) {
				this.sunken_ships++;
				if (this.allShipsSunk()) {
					return "All Ships Sunk";
				}
				return "Ship Sunk";
			}
		} else {
			this.missed_shots.add(coordinate);
		}
	}

	allShipsSunk() {
		if (this.sunken_ships === this.ships.length) {
			return true;
		}
		return false;
	}

	placeShip(ship_length, coordinates) {
		for (const coordinate of coordinates) {
			if (this.getShipAt(coordinate)) {
				return;
			}
		}

		if (!this.areValidCoordinates(coordinates)) {
			return;
		}

		if (!this.areCoordinatesAdjacent(coordinates)) {
			return;
		}

		const ship = new Ship(ship_length);
		this.ships.push(ship);

		coordinates.forEach((coordinate) => {
			this.grid[coordinate] = ship;
		});
	}

	getShipAt(coordinate) {
		return this.grid[coordinate];
	}

	getCoordinateStatus(coordinate) {
		if (this.missed_shots.has(coordinate)) {
			return "Missed";
		} else if (this.successful_shots.has(coordinate)) {
			return "Hit";
		} else {
			return "Empty";
		}
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
			let same_letter = true;
			let same_number = true;

			if (letters[i].charCodeAt(0) - letters[i - 1].charCodeAt(0) > 1) {
				return false;
			} else if (letters[i].charCodeAt(0) != letters[i - 1].charCodeAt(0)) {
				same_letter = false;
			}

			if (numbers[i] - numbers[i - 1] > 1) {
				return false;
			} else if (numbers[i] != numbers[i - 1]) {
				same_number = false;
			}

			if (!same_letter && !same_number) {
				return false;
			}
		}

		return true;
	}
}

export default Gameboard;
