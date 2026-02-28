import Ship from '../src/modules/ship';

describe('ship', () => {
    let ship;

    beforeEach(() => {
        ship = new Ship(3);
    })

    test('should create a ship with the given length', () => {
        expect(ship.length).toBe(3);
        expect(ship.hits).toBe(0);
    })

    test('should increment when hits is called', () => {
        ship.hit();
        ship.hit();

        expect(ship.hits).toBe(2);
    })
} )