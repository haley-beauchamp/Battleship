import createBoard from "./modules/create_board.js";
import placeShipsRandomly from "./modules/place_ships.js";
import Player from "./features/player.js";
import getQueryParams from "./modules/get_params.js";
import { connectToServer, sendMove } from "./modules/web_socket.js";

const { username, opponent_type } = getQueryParams();

const game_board_container = document.getElementById("game-board-container");

// remove all existing game boards
document.querySelectorAll(".game-board").forEach((el) => el.remove());

// create new game boards
const player_board = document.createElement("div");
player_board.classList.add("game-board");
player_board.id = `${username}-board`;

const enemy_board = document.createElement("div");
enemy_board.classList.add("game-board");
enemy_board.id = "enemy-board";

game_board_container.appendChild(player_board);
game_board_container.appendChild(enemy_board);

export const player = new Player(username);
createBoard(player_board, attack, false);
placeShipsRandomly(player, true);

export const enemy = new Player("enemy");
createBoard(enemy_board, attack, true);

let is_your_turn = false;
let is_opponent_computer = true;

if (opponent_type === "human") {
	connectToServer(username, setTurn);

	is_opponent_computer = false;
} else if (opponent_type === "computer") {
	// show computer (single player) options (custom ship lengths)
	document.querySelector("#computer-options").classList.remove("hidden");

	placeShipsRandomly(enemy, false);

	is_your_turn = true;

	const submit_button = document.getElementById("submit-ships");
	if (submit_button) {
		submit_button.addEventListener("click", () => {
			try {
				const input = document.getElementById("ship-lengths").value;
				const formatted_input = input.replace(/\s+/g, "").split(","); // remove spaces and split by commas
				const ship_lengths = formatted_input.map(Number); // convert to numbers

				if (ship_lengths.some((length) => length <= 0 || length > 10 || !Number.isInteger(length))) {
					alert("Please enter valid ship lengths ranging from 1 to 10");
					return;
				}

				// make sure provided ship lengths would not overflow the board
				let total_cells = 0;
				for (let ship_length of ship_lengths) {
					total_cells += ship_length;
				}
				if (total_cells > 100) {
					alert("There's not enough space in the water for all that...");
					return;
				}

				placeShipsRandomly(player, true, ship_lengths);
				placeShipsRandomly(enemy, false, ship_lengths);
			} catch (error) {
				console.log(error);
				alert("Please enter a valid list of numbers, like: 2, 3, 3, 4, 5");
			}
		});
	}
}

function attack(coordinate) {
	if (is_your_turn) {
		const response = enemy.game_board.receiveAttack(coordinate);
		if (response != "Try Again") {
			if (is_opponent_computer) {
				// automatically update the board visuals only if the enemy if a computer... otherwise we have to wait for a response
				updateBoardVisuals(enemy, coordinate);
			}

			if (response === "All Ships Sunk") {
				gameOver();
				return;
			}

			if (!is_opponent_computer) {
				sendMove(coordinate); // send move through web socket if playing against a human
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
			updateBoardVisuals(player, coordinate);

			if (response === "All Ships Sunk") {
				gameOver();
				return;
			}

			switchTurn();
			return;
		}
	}
}

export function updateBoardVisuals(character, coordinate, response = null) {
	// find the cell according to given character and coordinate
	const shot = document.querySelector(`#${character.player_name}-board .cell[data-coordinate="${coordinate}"]`);

	// use given status if receiving a move from a player, otherwise check coordinate status directly for computer opponent
	const status = response || character.game_board.getCoordinateStatus(coordinate);

	switch (status) {
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
}

export function gameOver() {
	if (is_opponent_computer) {
		// alerts handled in web socket when opponent is player
		const winner = is_your_turn ? player.player_name : enemy.player_name;
		alert(`${winner} Wins!`);
	}

	// disable all cells so no further moves may be made
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
