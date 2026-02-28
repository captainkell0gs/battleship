import Player from "../src/modules/player";
import Gameboard from "../src/modules/gameboard";

describe("Player", () => {
    let player; 

    beforeEach(() => {
        player = new Player();
    })

    test("creates a player with a gameboard", () => {
        expect(player.gameboard).toBeInstanceOf(Gameboard);
    })

    test("makeRandomMove attacks the enemy board", () => {
        const enemyBoard = new Gameboard(2);
        
        const result = player.makeRandomMove(enemyBoard);

        expect(["hit", "miss"]).toContain(result);
        expect(enemyBoard.attacked.size).toBe(1);
    })

    test("makeRandomMove does not attack the same cell twice", () => {
        const enemyBoard = new Gameboard(1);
        
        player.makeRandomMove(enemyBoard);
        player.makeRandomMove(enemyBoard);

        expect(enemyBoard.attacked.size).toBe(1);
    })

    test("makeRandomMove returns null if the board is full", () => {
        const enemyBoard = new Gameboard(1);

        enemyBoard.receiveAttack(0, 0);

        const result = player.makeRandomMove(enemyBoard);

        expect(result).toBe(null);
    })
})