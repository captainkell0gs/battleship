import Gameboard from "./gameboard";

export default class Player {
    constructor() {
        this.gameboard = new Gameboard()
    }

    makeRandomMove(enemyBoard) {
        if (enemyBoard.isFull()) return null;
        
        let result;
        let x;
        let y;

        do {
            x = Math.floor(Math.random() * enemyBoard.size);
            y = Math.floor(Math.random() * enemyBoard.size);
            result = enemyBoard.receiveAttack(x, y);
        } while (result === "invalid");

        return result;
    }
}