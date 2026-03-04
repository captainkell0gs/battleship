import Gameboard from "../src/modules/gameboard";
import Ship from "../src/modules/ship";

describe("gameboard", () => {
    let gameboard;

    beforeEach(() => {
        gameboard = new Gameboard();
    })

    test("should create a gameboard", () => {
        expect(gameboard.board).toEqual(Array(10).fill(null).map(() => Array(10).fill(null)))
        expect(gameboard.ships).toEqual([])
        expect(gameboard.missedAttacks).toEqual([])
        expect(gameboard.attacked.size).toBe(0)
    })

    test("place ship horizontally", () => {
        const ship = new Ship(2)
        gameboard.placeShip(ship, 0, 0, 'horizontal')

        expect(gameboard.board[0][0].ship).toBe(ship);
        expect(gameboard.board[0][0].hit).toBe(false);

        expect(gameboard.board[0][1].ship).toBe(ship);
        expect(gameboard.board[0][1].hit).toBe(false);
    })

    test("place ship vertically", () => {
        const ship = new Ship(2)
        gameboard.placeShip(ship, 0, 0, 'vertical')

        expect(gameboard.board[0][0]).toEqual({
            ship,
            hit: false
        })

        expect(gameboard.board[1][0]).toEqual({
            ship,
            hit: false
        })
    })

    test("does not place ship out of bounds horizontally", () => {
        const ship = new Ship(3)
        const result = gameboard.placeShip(ship, 0, 10, 'horizontal')

        expect(result).toBe(false)
    })

    test("does not allow overlapping ships", () => {
        const ship1 = new Ship(3)
        const ship2 = new Ship(2)

        gameboard.placeShip(ship1, 0, 0, 'horizontal')
        const result = gameboard.placeShip(ship2, 0, 1, 'vertical')

        expect(result).toBe(false)
    })

    test("misses attack", () => {
        const result = gameboard.receiveAttack(0, 0)

        expect(result).toEqual({
            valid: true,
            hit: false,
            ship: null
        })
    })

    test("hits ship", () => {
        const ship = new Ship(3)
        gameboard.placeShip(ship, 0, 0, 'horizontal')

        const result = gameboard.receiveAttack(0, 0)

        expect(result.hit).toBe(true)
    })

    test("rejects out of bounds attacks", () => {
        const result = gameboard.receiveAttack(-1, -1)

        expect(result).toEqual({
            valid: false,
        })

    })

    test("prevents duplicate attacks on empty cells", () => {
        const result1 = gameboard.receiveAttack(0, 0)
        const result2 = gameboard.receiveAttack(0, 0)

        expect(result1.hit).toBe(false);
        expect(result2.valid).toBe(false);
        expect(gameboard.missedAttacks)
    })

    test("prevents duplicate attacks on ships", () => {
        const ship = new Ship(3)
        gameboard.placeShip(ship, 0, 0, "horizontal")

        const result1 = gameboard.receiveAttack(0, 0)
        const result2 = gameboard.receiveAttack(0, 0)

        expect(result1.hit).toBe(true);
        expect(result2.valid).toBe(false);
        expect(ship.hits).toBe(1);
    })

    test("reports true when all ships are sunk", () => {
        const ship1 = new Ship(1)
        const ship2 = new Ship(1)

        gameboard.placeShip(ship1, 0, 0, "horizontal")
        gameboard.placeShip(ship2, 1, 0, "horizontal")

        gameboard.receiveAttack(0, 0)
        gameboard.receiveAttack(1, 0)

        expect(gameboard.allShipsSunk()).toBe(true);
    })

    test("reports false when not all ships are sunk", () => {
        const ship1 = new Ship(1)
        const ship2 = new Ship(1)

        gameboard.placeShip(ship1, 0, 0, "horizontal")
        gameboard.placeShip(ship2, 1, 0, "horizontal")

        gameboard.receiveAttack(0, 0)

        expect(gameboard.allShipsSunk()).toBe(false);
    })

    test("returns false when no ships have been placed", () => {
        expect(gameboard.allShipsSunk()).toBe(false);
    })

    test("returns true when board is fully attacked", () => {
        const board = new Gameboard(2);

        board.receiveAttack(0, 0);
        board.receiveAttack(0, 1);
        board.receiveAttack(1, 0);
        board.receiveAttack(1, 1);

        expect(board.isFull()).toBe(true);
    })

    test("returns false when board is not fully attacked", () => {
        const board = new Gameboard(2);

        board.receiveAttack(0, 0);
        board.receiveAttack(0, 1);

        expect(board.isFull()).toBe(false);
    })

    test("duplicate attacks do not affect fullness", () => {
        const board = new Gameboard(2);

        board.receiveAttack(0, 0);
        board.receiveAttack(0, 0);

        expect(board.isFull()).toBe(false);
    })
} )