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

function attack(coordinate) {
    console.log("Attack at:", coordinate);
    enemy.game_board.receiveAttack(coordinate);
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

}