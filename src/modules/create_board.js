export default function createBoard(board_element, attack, isInteractive) {
	board_element.innerHTML = "";

	for (let row = 0; row < 10; row++) {
		for (let col = 1; col <= 10; col++) {
			const letter = String.fromCharCode(65 + row);
			const coordinate = letter + col;

			const cell = document.createElement("div");
			cell.classList.add("cell");
			cell.dataset.coordinate = coordinate;

			if (isInteractive) {
				cell.addEventListener("click", () => attack(coordinate));
			}

			board_element.appendChild(cell);
		}
	}
}
