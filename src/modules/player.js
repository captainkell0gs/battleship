import Gameboard from "./gameboard";

export default class Player {
    constructor() {
        this.gameboard = new Gameboard()
        this.mode = "hunt";
        this.targetQueue = [];
        this.lastHits= [];
        this.lockedDirection = null;
    }

    makeMove(gameboard) {
        if (this.mode === 'hunt') {
            return this.hunt(gameboard);
        } else {
            return this.target(gameboard)
        }
    }

    hunt(gameboard) {
        let x, y, result;

        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            result = gameboard.receiveAttack(x, y);
        } while (!result.valid);

        if (result.hit) {
            this.mode = "target";
            this.lastHits = [[x, y]];
            this.enqueueAdjacent(x, y);
        }

        return result;
    }

    target(gameboard) {
        while (this.targetQueue.length > 0) {
            const [x, y] = this.targetQueue.shift();
            const result = gameboard.receiveAttack(x, y);

            if (!result.valid) continue;

            if (result.hit) {
                this.lastHits.push([x, y]);

                if (this.lastHits.length === 2) {
                    this.detectDirection();
                }

                if (this.lockedDirection) {
                    this.enqueueInLockedDirection();
                }
                else {
                    this.enqueueAdjacent(x, y);
                }
            }

            if (result.ship && result.ship.isSunk()) {
                this.resetTargeting();
            }

            return result;
        }

        this.resetTargeting();
        return this.hunt(gameboard);
    }

    enqueueAdjacent(x, y) {
        const directions = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];

        directions.forEach(([dx, dy]) => {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 &&
                nx < 10 &&
                ny >= 0 &&
                ny < 10
            ) {
                this.targetQueue.push([nx, ny]);
            }
        });
    }

    detectDirection() {
        const [first, second] = this.lastHits;  

        if (first[0] === second[0]) {
            this.lockedDirection = "horizontal";
        } else if (first[1] === second[1]) {
            this.lockedDirection = "vertical";
        }

        this.targetQueue = [];
    }

    enqueueInLockedDirection() {
        const hits = this.lastHits;

        const xs = hits.map(h => h[0]);
        const ys = hits.map(h => h[1]);

        const minX = Math.min(...xs);
        const maxX = Math.max(...xs);
        const minY = Math.min(...ys);
        const maxY = Math.max(...ys);

        if (this.lockedDirection === "horizontal") {
            this.targetQueue.push([xs[0], minY - 1]);
            this.targetQueue.push([xs[0], maxY + 1]);
        } else {
            this.targetQueue.push([minX - 1, ys[0]]);
            this.targetQueue.push([maxX + 1, ys[0]]);
        }
    }

    resetTargeting() {
        this.mode = "hunt";
        this.targetQueue = [];
        this.lastHits = [];
        this.lockedDirection = null;
    }
}