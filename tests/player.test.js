import Player from "../src/modules/player";
import Gameboard from "../src/modules/gameboard";
import Ship from "../src/modules/ship";

describe("Player", () => {

    test("creates a human player with a gameboard", () => {
        const player = new Player();

        expect(player.gameboard).toBeDefined();
        expect(player.gameboard.size).toBe(10);
    })

    test("AI starts in hunt mode", () => {
        const ai = new Player(true);
        expect(ai.mode).toBe("hunt");
    })

    test("AI switches to target mode after a hit", () => {
        const ai = new Player();
        const board = new Gameboard();

        const ship = new Ship(2);
        board.placeShip(ship, 0, 0, "horizontal");

        jest.spyOn(Math, "random")
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0); 

        ai.makeMove(board);

        expect(ai.mode).toBe("target");

        Math.random.mockRestore();
    })

    test("AI detects horizontal direction", () => {
        const ai = new Player();

        ai.lastHits = [
            [4, 5],
            [4, 6]
        ];

        ai.detectDirection();

        expect(ai.lockedDirection).toBe("horizontal");
    })

    test("AI detects vertical direction", () => {
        const ai = new Player();

        ai.lastHits = [
            [4, 5],
            [5, 5]
        ];

        ai.detectDirection();

        expect(ai.lockedDirection).toBe("vertical");
    });

    test("resetTargeting resets AI state", () => {
        const ai = new Player();

        ai.mode = "target"
        ai.targetQueue = [1, 1]
        ai.lastHits = [2, 2]
        ai.lockedDirection = "horizontal"

        ai.resetTargeting()

        expect(ai.mode).toBe("hunt")
        expect(ai.targetQueue).toEqual([])
        expect(ai.lastHits).toEqual([])
        expect(ai.lockedDirection).toBeNull()
    })

})