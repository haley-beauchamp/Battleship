document.getElementById("start-game-form").addEventListener("submit", startGame);

function startGame(event) {
	event.preventDefault();

	const username = document.getElementById("username").value;
	if (!username) {
		alert("Please enter a username.");
		return;
	}

	const opponent_type = document.getElementById("opponent-type").value;

	window.location.href = "/battleship.html?username=" + encodeURIComponent(username) + "&opponent=" + opponent_type;
}
