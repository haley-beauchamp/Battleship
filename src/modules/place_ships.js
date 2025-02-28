export default function placeShipsRandomly(player, isPlayer) {
	const ship_lengths = [2, 3, 3, 4, 5];

	for (const length of ship_lengths) {
		let placed = false;

		while (!placed) {
			let letter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
			let number = Math.floor(Math.random() * 10) + 1;
			let coordinate = `${letter}${number}`;

			if (player.game_board.getShipAt(coordinate)) {
				continue;
			}

			let ship_coordinates = [coordinate];

			const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

			let valid_ship = true;
			for (let i = 1; i < length; i++) {
				let valid_coordinates = false;
				let attempts = 0;

				while (!valid_coordinates) {
					attempts++;
					if (attempts > 10) {
						valid_ship = false;
						break;
					}
					if (direction === "horizontal") {
						number += Math.random() < 0.5 ? -1 : 1; // left or right
					} else if (direction === "vertical") {
						letter = String.fromCharCode(letter.charCodeAt(0) + (Math.random() < 0.5 ? -1 : 1)); // up or down
					}

					coordinate = `${letter}${number}`;
					let temp_coordinates = [...ship_coordinates, coordinate];

					if (player.game_board.getShipAt(coordinate) == undefined && player.game_board.areValidCoordinates([coordinate]) && player.game_board.areCoordinatesAdjacent(temp_coordinates) && !ship_coordinates.includes(coordinate)) {
						ship_coordinates.push(coordinate);
						valid_coordinates = true;
					}
				}

				if (!valid_ship) break;
			}

			if (!valid_ship) continue;

			player.game_board.placeShip(length, ship_coordinates);
			placed = true;

			if (isPlayer) {
				const board_selector = `#${player.player_name}-board .cell`;
				const cells = document.querySelectorAll(board_selector);

				for (let coordinate of ship_coordinates) {
					const cell = [...cells].find((cell) => cell.dataset.coordinate === coordinate);
					cell.classList.add("player-ship");
				}
			}
		}
	}
}
