const http = require("http");
const { WebSocketServer } = require("ws");
const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const ws_server = new WebSocketServer({ server });
const PORT = 8080;

const connections = {};
const users = {};
const games = {};
let waiting_players = [];

const handleMessage = (bytes, uuid) => {
	const message = JSON.parse(bytes.toString());
	const user = users[uuid];

	if (message.type === "username") {
		console.log(`${user.username} connected`);
	} else if (message.type === "move") {
		const game_id = users[uuid].gameId;
		const game = games[game_id];

		if (game.currentTurn === uuid) {
			console.log(`${user.username} sent coordinate: ${JSON.stringify(message)}`);
			game.currentTurn = user.opponentUuid;
			connections[user.opponentUuid].send(
				JSON.stringify({
					type: "move",
					coordinate: message.coordinate,
					isYourTurn: true,
				})
			);
		}
	} else if (message.type === "move_response") {
		connections[user.opponentUuid].send(
			JSON.stringify({
				type: "move_response",
				coordinate: message.coordinate,
				response: message.response,
			})
		);
	} else if (message.type === "game_over") {
		connections[user.opponentUuid].send(JSON.stringify({ type: "game_over" }));
	}
};

const handleClose = (uuid) => {
	console.log(`${users[uuid].username} disconnected`);

	delete connections[uuid];
	delete users[uuid];
};

function attempt_matchmaking() {
	if (waiting_players.length < 2) {
		return;
	}

	const player1_uuid = waiting_players.shift();
	const player2_uuid = waiting_players.shift();

	const player1 = users[player1_uuid];
	const player2 = users[player2_uuid];

	player1.opponentUuid = player2_uuid;
	player2.opponentUuid = player1_uuid;

	connections[player1_uuid].send(
		JSON.stringify({
			type: "match_found",
			opponent: player2.username,
			isYourTurn: true,
		})
	);

	connections[player2_uuid].send(
		JSON.stringify({
			type: "match_found",
			opponent: player1.username,
			isYourTurn: false,
		})
	);

	createGameSession(player1_uuid, player2_uuid);
	console.log(`${player1.username} and ${player2.username} have been matched`);
}

function createGameSession(player1_uuid, player2_uuid) {
	const game_id = uuidv4();

	users[player1_uuid].gameId = game_id;
	users[player2_uuid].gameId = game_id;

	games[game_id] = {
		player1: player1_uuid,
		player2: player2_uuid,
		currentTurn: player1_uuid,
	};
}

ws_server.on("connection", (connection, request) => {
	const { username } = url.parse(request.url, true).query;
	const uuid = uuidv4();

	connections[uuid] = connection;
	users[uuid] = {
		username: username,
		opponentUuid: "",
	};

	waiting_players.push(uuid);
	console.log(`${username} joined the queue`);
	attempt_matchmaking();

	connection.on("message", (message) => handleMessage(message, uuid));
	connection.on("close", () => handleClose(uuid));
});

server.listen(PORT, () => {
	console.log(`WebSocket server is running on port ${PORT}`);
});
