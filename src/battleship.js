import createBoard from "./modules/create_board.js";
import Player from "./features/player.js";

const player = new Player("player");
player.game_board.placeShip(2, ["A1", "A2"]);

const player_board = document.getElementById("player-board");
createBoard(player_board, attack, false);

const enemy = new Player("enemy");
enemy.game_board.placeShip(2, ["A1", "A2"]);

const enemy_board = document.getElementById("enemy-board");
createBoard(enemy_board, attack, true);

let turn = "player";

function attack(coordinate) {
	if (turn === "player") {
		const response = enemy.game_board.receiveAttack(coordinate);
		if (response != "Try Again") {
			const shot = document.querySelector(`#enemy-board .cell[data-coordinate="${coordinate}"]`);

			switch (enemy.game_board.getCoordinateStatus(coordinate)) {
				case "Hit":
					shot.classList.add("shot-hit");
					break;
				case "Missed":
					shot.classList.add("shot-missed");
					break;
				default:
					break;
			}

			if (response === "All Ships Sunk") {
				gameOver();
				return;
			}

			switchTurn();
		}
	}
}

function enemyAttack() {
	while (true) {
		const letter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
		const number = Math.floor(Math.random() * 10) + 1;
		const coordinate = `${letter}${number}`;

		const response = player.game_board.receiveAttack(coordinate);
		if (response != "Try Again") {
			const shot = document.querySelector(`#player-board .cell[data-coordinate="${coordinate}"]`);

			switch (player.game_board.getCoordinateStatus(coordinate)) {
				case "Hit":
					shot.classList.add("shot-hit");
					break;
				case "Missed":
					shot.classList.add("shot-missed");
					break;
				default:
					break;
			}

			if (response === "All Ships Sunk") {
				gameOver();
				return;
			}

			switchTurn();
			return;
		}
	}
}

function gameOver() {
	alert(`${turn} Wins!`);
    
	const cells = document.querySelectorAll(".cell");
	cells.forEach((cell) => {
		cell.classList.add("disabled");
	});
}

function switchTurn() {
	turn = turn === "player" ? "enemy" : "player";

	if (turn === "enemy") {
		enemyAttack();
	}
}
