import Player from "./player";

export default class GameController {
    constructor() {
        this.human = new Player("Human");
        this.computer = new Player("Computer");
        this.currentPlayer = this.human;
        this.gameOver = false;
    }

    playTurn(x, y) {
        if (this.gameOver) return;

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
}