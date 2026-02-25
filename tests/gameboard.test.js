import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

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
        const ship = new Ship(3)
        gameboard.placeShip(ship, 0, 0, 'horizontal')

        expect(gameboard.board[0][0]).toEqual(ship)
        expect(gameboard.board[0][1]).toEqual(ship)
        expect(gameboard.board[0][2]).toEqual(ship)
    })

    test("place ship vertically", () => {
        const ship = new Ship(2)
        gameboard.placeShip(ship, 0, 0, 'vertical')

        expect(gameboard.board[0][0]).toEqual(ship)
        expect(gameboard.board[1][0]).toEqual(ship)
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

        expect(result).toBe("miss")
    })

    test("hits ship", () => {
        const ship = new Ship(3)
        gameboard.placeShip(ship, 0, 0, 'horizontal')

        const result = gameboard.receiveAttack(0, 0)

        expect(result).toBe("hit")
    })

    test("rejects out of bounds attacks", () => {
        const result = gameboard.receiveAttack(-1, -1)

        expect(result).toBe("invalid")
    })

    test("prevents duplicate attacks on empty cells", () => {
        const result1 = gameboard.receiveAttack(0, 0)
        const result2 = gameboard.receiveAttack(0, 0)

        expect(result1).toBe("miss");
        expect(result2).toBe("invalid");
        expect(gameboard.missedAttacks)
    })

    test("prevents duplicate attacks on ships", () => {
        const ship = new Ship(3)
        gameboard.placeShip(ship, 0, 0, "horizontal")

        const result1 = gameboard.receiveAttack(0, 0)
        const result2 = gameboard.receiveAttack(0, 0)

        expect(result1).toBe("hit");
        expect(result2).toBe("invalid");
        expect(ship.hits).toBe(1);
    })
} )