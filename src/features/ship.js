class Ship {
	ship_length = 0;
	hits = 0;

	constructor(ship_length) {
		this.ship_length = ship_length;
	}

	hit() {
		this.hits++;
	}

	isSunk() {
		if (this.ship_length == this.hits) {
			return true;
		}
		return false;
	}
}

export default Ship;
