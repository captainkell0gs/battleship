export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill(null));
        this.ships = [];
        this.missedAttacks = [];
        this.attacked = new Set()
    }

    placeShip(ship, x, y, direction) {
        if (
            x < 0 || x >= this.size || y < 0 || y >= this.size || 
            !['horizontal', 'vertical'].includes(direction)
        ) return false;

        if (direction === 'horizontal') {
            if (y + ship.length > this.size) return false;

            for (let i = 0; i < ship.length; i++) {
                if (this.board[x][y + i] !== null) return false;
            }

            for (let i = 0; i < ship.length; i++) {
                this.board[x][y + i] = ship;
            }

        } else {
            if (x + ship.length > this.size) return false;

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
        if (x < 0 || x >= this.size || y < 0 || y >= this.size) return "invalid";

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

    isFull() {
        return this.attacked.size >= this.size ** 2;
    }

    allShipsSunk() {
        if (this.ships.length === 0) return false;

        return this.ships.every(ship => ship.isSunk());
    }

}