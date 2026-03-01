import Player from "./player";
import Ship from "./ship";

export default class GameController {
    constructor() {
        this.human = new Player();
        this.computer = new Player();
        this.currentPlayer = this.human;
        this.gameOver = false;
        this.fleet = [5, 4, 3, 3, 2];
        this.humanShipsPlaced = 0;
        this.phase = "placement";
    }

    playTurn(x, y) {
        if (this.phase !== "battle" || this.gameOver) return;

        let result;

        if (this.currentPlayer === this.human) {
            result = this.computer.gameboard.receiveAttack(x, y);

            if (result === "invalid") return "invalid";

            if (this.computer.gameboard.allShipsSunk()) {
                this.gameOver = true;
                return "Human wins!";
            }

            this.currentPlayer = this.computer;

        } else {
            result = this.computer.makeRandomMove(this.human.gameboard);

            if (this.human.gameboard.allShipsSunk()) {
                this.gameOver = true;
                return "Computer wins!";
            }

            this.currentPlayer = this.human;
        }

        return result;
    }

    placeHumanShip(x, y, direction) {
        if (this.humanShipsPlaced >= this.fleet.length) return false;

        const length = this.fleet[this.humanShipsPlaced];
        const ship = new Ship(length);

        const placed = this.human.gameboard.placeShip(ship, x, y, direction);

        if (placed) {
            this.humanShipsPlaced++;

            if (this.humanShipsPlaced === this.fleet.length) {
            this.phase = "battle";
            }
        }

        return placed;
    }

    placeComputerShips() {
        this.fleet.forEach(length => {
            let placed = false;

            while (!placed) {
                const ship = new Ship(length);
                const x = Math.floor(Math.random() * this.computer.gameboard.size);
                const y = Math.floor(Math.random() * this.computer.gameboard.size);
                const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

                placed = this.computer.gameboard.placeShip(ship, x, y, direction);
            }
        })
    }
}