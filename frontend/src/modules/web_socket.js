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
			alert(`Opponent made move ${message.coordinate}`);
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

export { connectToServer, sendMove };
