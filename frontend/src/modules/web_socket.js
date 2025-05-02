import { player, enemy, updateBoardVisuals, gameOver } from "../battleship";

let socket = null;

function connectToServer(username, setTurn) {
	const backendUrl = import.meta.env.VITE_BACKEND_URL;
	socket = new WebSocket(`${backendUrl}?username=${username}`);

	socket.onopen = () => {
		socket.send(
			JSON.stringify({
				type: "username",
				username: username,
			})
		);
	};

	socket.onmessage = (event) => {
		const message = JSON.parse(event.data);
		if (message.type === "match_found") {
			// here so i can eventually implement a waiting screen for user friendliness
			//window.location.href = `/battleship.html?username=${username}&opponent=human`;
			setTurn(message.isYourTurn);
			alert(`Matched with ${message.opponent}... your turn? ${message.isYourTurn}`);
		} else if (message.type === "move") {
			setTurn(message.isYourTurn);

			player.game_board.receiveAttack(message.coordinate);
			const response = player.game_board.getCoordinateStatus(message.coordinate);

			// update player board to reflect where enemy attacked
			updateBoardVisuals(player, message.coordinate, response);
			// send enemy the status of their attack
			sendResponse(message.coordinate, response);
			alert(`Opponent made move ${message.coordinate}`);

			if (player.game_board.allShipsSunk()) {
				gameOver(); // disable cells
				sendGameOver(); // tell enemy game ended
				alert(`Game over! Enemy wins!`); // tell player game ended
			}
		} else if (message.type === "move_response") {
			// after receiving move status from enemy, update enemy board to reflect hit status
			updateBoardVisuals(enemy, message.coordinate, message.response);
		} else if (message.type === "game_over") {
			// this implies that your opponent lost
			gameOver(); // disable cells
			alert(`Game over! You win!`); // tell player game is over
		}
	};
}

function sendMove(coordinate) {
	socket.send(
		JSON.stringify({
			type: "move",
			coordinate: coordinate,
		})
	);
}

function sendResponse(coordinate, response) {
	socket.send(
		JSON.stringify({
			type: "move_response",
			coordinate: coordinate,
			response: response,
		})
	);
}

function sendGameOver() {
	socket.send(JSON.stringify({ type: "game_over" }));
}

export { connectToServer, sendMove };
