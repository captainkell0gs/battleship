import Ship from "./ship";

export default class Gameboard {
    constructor() {
        this.board = Array(10).fill(null).map(() => Array(10).fill(null));
        this.ships = [];
        this.missedAttacks = [];
        this.attacked = new Set()
    }

    placeShip(ship, x, y, direction) {
        if (
            x < 0 || x > 9 || y < 0 || y > 9 || 
            !['horizontal', 'vertical'].includes(direction)
        ) return false;

        if (direction === 'horizontal') {
            if (y + ship.length > 10) return false;

            for (let i = 0; i < ship.length; i++) {
                if (this.board[x][y + i] !== null) return false;
            }

            for (let i = 0; i < ship.length; i++) {
                this.board[x][y + i] = ship;
            }

        } else {
            if (x + ship.length > 10) return false;

            for (let i = 0; i < ship.length; i++) {
                if (this.board[x + i][y] !== null) return false;
            }

            for (let i = 0; i < ship.length; i++) {
                this.board[x + i][y] = ship;
            }
        }

        this.ships.push(ship);
        return true;
    }

    receiveAttack(x, y) {
        if (x < 0 || x > 9 || y < 0 || y > 9) return "invalid";

        const key = `${x}-${y}`;
    
        if (this.attacked.has(key)) return "invalid";

        this.attacked.add(key);

        const ship = this.board[x][y];

        if (ship === null) {
            this.missedAttacks.push([x, y]);
            return "miss";
            
        } else {
            ship.hit();
            return "hit";
        }
    }
}