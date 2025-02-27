class Ship {
	constructor(ship_length) {
		this.ship_length = ship_length;
		this.hits = 0;
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
