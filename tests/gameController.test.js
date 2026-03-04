import GameController from "../src/modules/gameController";
import Ship from "../src/modules/ship";

describe("GameController", () => {
    let gameController;

    beforeEach(() => {
        gameController = new GameController();
    });

    test("starts in placement", () => {
        expect(gameController.phase).toBe("placement");
        expect(gameController.humanShipsPlaced).toBe(0);
        expect(gameController.gameOver).toBe(false);
    });

    test("does not allow playTurn in placement", () => {
        const result = gameController.playTurn(0, 0);
        expect(result.valid).toBe(false);
        expect(gameController.currentPlayer).toBe(gameController.human);
    });

    test("switches turn correctly in battle phase", () => {
        gameController.phase = "battle";

        gameController.playTurn(0, 0);
        expect(gameController.currentPlayer).toBe(gameController.computer);

        gameController.playTurn(0, 0);
        expect(gameController.currentPlayer).toBe(gameController.human);
    });

    test("invalid move does not switch turn", () => {
        gameController.phase = "battle";

        const result = gameController.playTurn(10, 10);
        expect(result.valid).toBe(false);
        expect(gameController.currentPlayer).toBe(gameController.human);
    });

    test("human wins set gameOver to true", () => {
        gameController.phase = "battle";

        const ship = new Ship(1);

        gameController.computer.gameboard.placeShip(ship, 0, 0, "horizontal");
        gameController.playTurn(0, 0);

        expect(gameController.gameOver).toBe(true);
    });

    test("computer wins set gameOver to true", () => {
        gameController.phase = "battle";

        const ship = new Ship(1);

        gameController.human.gameboard.placeShip(ship, 0, 0, "horizontal");
        gameController.currentPlayer = gameController.computer;

        jest.spyOn(gameController.computer, "makeMove")
        .mockImplementation(() => {
            gameController.human.gameboard.receiveAttack(0, 0);
            return "hit";
        });

        gameController.playTurn(0, 0);
        expect(gameController.gameOver).toBe(true);
    })

    test("computer does not move after gameOver is true", () => {
        gameController.phase = "battle";
        gameController.gameOver = true;

        gameController.playTurn(0, 0);

        expect(gameController.currentPlayer).toBe(gameController.human);
    })

    test("human places ship", () => {
        const placed = gameController.placeHumanShip(0, 0, "horizontal");
        expect(placed).toBe(true);
        expect(gameController.humanShipsPlaced).toBe(1);
    });

    test("does not place ship if invalid position", () => {
        const placed = gameController.placeHumanShip(0, 8, "horizontal");
        expect(placed).toBe(false);
        expect(gameController.humanShipsPlaced).toBe(0);
    });

    test("switches to battle phase after all ships placed", () => {
        gameController.placeHumanShip(0, 0, "horizontal");
        gameController.placeHumanShip(1, 0, "horizontal");
        gameController.placeHumanShip(2, 0, "horizontal");
        gameController.placeHumanShip(3, 0, "horizontal");
        gameController.placeHumanShip(4, 0, "horizontal");

        expect(gameController.phase).toBe("battle");
    });

    test("does not allow placing more ships than fleet size", () => {
        gameController.humanShipsPlaced = gameController.fleet.length;
        const placed = gameController.placeHumanShip(5, 0, "horizontal");
        expect(placed).toBe(false);
    })

    test("places computer ships", () => {
        gameController.placeComputerShips();
        expect(gameController.computer.gameboard.ships.length)
            .toBe(gameController.fleet.length);
    })
})