import createBoard from "./modules/create_board.js";
import placeShipsRandomly from "./modules/place_ships.js";
import Player from "./features/player.js";
import getQueryParams from "./modules/get_params.js";
import { connectToServer, sendMove } from "./modules/web_socket.js";

const { username, opponent_type } = getQueryParams();

const game_board_container = document.getElementById("game-board-container");

const player_board = document.createElement("div");
player_board.classList.add("game-board");
player_board.id = `${username}-board`;

const enemy_board = document.createElement("div");
enemy_board.classList.add("game-board");
enemy_board.id = "enemy-board";

game_board_container.appendChild(player_board);
game_board_container.appendChild(enemy_board);

const player = new Player(username);
createBoard(player_board, attack, false);
placeShipsRandomly(player, true);

const enemy = new Player("enemy");
createBoard(enemy_board, attack, true);

let is_your_turn = false;
let turn = "";
let is_opponent_computer = true;

if (opponent_type === "human") {
	connectToServer(username, setTurn);

	is_opponent_computer = false;
} else if (opponent_type === "computer") {
	placeShipsRandomly(enemy, false);

	is_your_turn = true;
}

function attack(coordinate) {
	if (is_your_turn) {
		const response = enemy.game_board.receiveAttack(coordinate);
		if (response != "Try Again") {
			const shot = document.querySelector(`#enemy-board .cell[data-coordinate="${coordinate}"]`);

			switch (enemy.game_board.getCoordinateStatus(coordinate)) {
				case "Hit":
					shot.classList.add("shot-hit");
					shot.innerText = "H";

					break;
				case "Missed":
					shot.classList.add("shot-missed");
					shot.innerText = "X";
					break;
				default:
					break;
			}

			if (response === "All Ships Sunk") {
				gameOver();
				return;
			}

			if (!is_opponent_computer) {
				sendMove(coordinate);
			}

			switchTurn();
		}
	}
}

function computerAttack() {
	while (true) {
		const letter = String.fromCharCode(65 + Math.floor(Math.random() * 10));
		const number = Math.floor(Math.random() * 10) + 1;
		const coordinate = `${letter}${number}`;

		const response = player.game_board.receiveAttack(coordinate);
		if (response != "Try Again") {
			const shot = document.querySelector(`#${username}-board .cell[data-coordinate="${coordinate}"]`);

			switch (player.game_board.getCoordinateStatus(coordinate)) {
				case "Hit":
					shot.classList.add("shot-hit");
					shot.innerText = "H";
					break;
				case "Missed":
					shot.classList.add("shot-missed");
					shot.innerText = "X";
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
	is_your_turn = !is_your_turn;

	if (!is_your_turn && is_opponent_computer) {
		computerAttack();
	}
}

function setTurn(turn_status) {
	is_your_turn = turn_status;
}
