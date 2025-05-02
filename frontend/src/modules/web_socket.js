import { player, enemy, updateBoardVisuals } from "../battleship";

let socket = null;

function connectToServer(username, setTurn) {
	socket = new WebSocket(`ws://localhost:8080?username=${username}`);

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
		} else if (message.type === "move_response") {
			updateBoardVisuals(enemy, message.coordinate, message.response);
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

export { connectToServer, sendMove };
