import GameController from "../src/modules/gameController";
import Ship from "../src/modules/ship";

describe("GameController", () => {
    let gameController;
    beforeEach(() => {
        gameController = new GameController();
    });

    test("switches turn correctly", () => {
        gameController.playTurn(0, 0);
        expect(gameController.currentPlayer).toBe(gameController.computer);

        gameController.playTurn(0, 0);
        expect(gameController.currentPlayer).toBe(gameController.human);
    });

    test("invalid move does not switch turn", () => {
        const result = gameController.playTurn(10, 10);
        expect(result).toBe("invalid");
        expect(gameController.currentPlayer).toBe(gameController.human);
    });

    test("human wins set gameOver to true", () => {
        const ship = new Ship(1);

        gameController.computer.gameboard.placeShip(ship, 0, 0, "horizontal");
        gameController.playTurn(0, 0);

        expect(gameController.gameOver).toBe(true);
    });

    test("computer wins set gameOver to true", () => {
        const ship = new Ship(1);

        gameController.human.gameboard.placeShip(ship, 0, 0, "horizontal");
        gameController.currentPlayer = gameController.computer;

        jest.spyOn(gameController.computer, "makeRandomMove")
        .mockImplementation(() => {
            gameController.human.gameboard.receiveAttack(0, 0);
            return "hit";
        });

        gameController.playTurn(0, 0);
        expect(gameController.gameOver).toBe(true);
    })

    test("computer does not move after gameOver is true", () => {
        
    })
})