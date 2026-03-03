import GameController from "./gameController";

export default class Dom {
    constructor() {
        this.controller = new GameController();
        this.currentDirection = "horizontal";
        this.previewCells = [];

        this.elements = {
            humanBoardEl: document.getElementById("human-board"),
            computerBoardEl: document.getElementById("computer-board"),
            statusEl: document.getElementById("status"),
            rotateBtn: document.getElementById("rotate-btn"),
            restartBtn: document.getElementById("restart-btn")
        };
    }

    init() {
        this.controller.placeComputerShips();
        this.renderBoards();
        this.attachEvents();
        this.updateStatus("Place your ships");
    }

    renderBoards() {
        this.renderBoard(
            this.controller.human.gameboard,
            this.elements.humanBoardEl,
            false
        );

        this.renderBoard(
            this.controller.computer.gameboard,
            this.elements.computerBoardEl,
            true
        );
    }

    renderBoard(board, container, hideShips) {
        container.innerHTML = "";

        for (let x = 0; x < board.size; x++) {
            for (let y = 0; y < board.size; y++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.x = x;
                cell.dataset.y = y;

                const square = board.board[x][y];

                if (square && !hideShips) {
                    cell.classList.add("ship");
                }

                if (board.missedAttacks.some(([mx, my]) => mx === x && my === y)) {
                    cell.classList.add("miss");
                }

                if (square && square.hit) {
                    cell.classList.add("hit");
                }

                container.appendChild(cell);
            }
        }
    }

    handleHover(x, y) {
        if (this.controller.phase !== "placement") return;

        this.clearPreview();

        const length = this.controller.fleet[this.controller.humanShipsPlaced];
        if (!length) return;

        const board = this.controller.human.gameboard;
        let valid = true;

        for (let i = 0; i < length; i++) {
            const newX = this.currentDirection === "horizontal" ? x : x + i;
            const newY = this.currentDirection === "horizontal" ? y + i : y;

            if (newX >= board.size || newY >= board.size || board.board[newX][newY]) {
                valid = false;
                break;
            }
        }

        for (let i = 0; i < length; i++) {
            const newX = this.currentDirection === "horizontal" ? x : x + i;
            const newY = this.currentDirection === "horizontal" ? y + i : y;

            if (newX >= board.size || newY >= board.size) continue;

            const cell = document.querySelector(`[data-x="${newX}"][data-y="${newY}"]`);

            if (cell) {
                cell.classList.add (valid ? "preview-valid" : "preview-invalid");
                this.previewCells.push(cell);
            }
        }
    }

    clearPreview () {
        this.previewCells.forEach(cell => {
            cell.classList.remove("preview-valid", "preview-invalid");
        });

        this.previewCells = [];
    }

    handlePlacement(x, y) {
        const placed = this.controller.placeHumanShip(x, y, this.currentDirection);

        if (!placed) {
            this.updateStatus("Invalid placement");
            return;
        }

        this.renderBoards();

        if (this.controller.phase === "battle") {
            this.updateStatus("Battle started! Your turn.");
        }else {
            const nextShip = this.controller.fleet[this.controller.humanShipsPlaced];
            this.updateStatus(`Place ship of length ${nextShip}`);
        }
    }

    handleBattle(x, y) {
        const result = this.controller.playTurn(x, y);

        if (result === "invalid") return;

        this.renderBoards();

        if (this.controller.gameOver) {
            this.showGameOver(result);
            return;
        }

        setTimeout(() => {
            const compResult = this.controller.playTurn();
            this.renderBoards();

            if (this.controller.gameOver) {
                this.showGameOver(compResult);
            }
        }, 500);
    }

    showGameOver(message) {
        const overlay = document.createElement("div");
        overlay.classList.add("game-over-overlay");

        overlay.innerHTML = `
            <div>${message}</div>
            <button id="play-again">Play Again</button>
        `;

        document.body.appendChild(overlay);

        document
            .getElementById("play-again")
            .addEventListener("click", () => {
                overlay.remove();
                this.restartGame();
            });
    }

    attachEvents() {
        this.elements.humanBoardEl.addEventListener("click", (e) => {
            if (!e.target.classList.contains("cell")) return;

            const x  = Number(e.target.dataset.x);
            const y = Number(e.target.dataset.y);

            if (this.controller.phase === "placement") {
                this.handlePlacement(x, y);
            }
        });

        this.elements.humanBoardEl.addEventListener("mousemove", (e) => {
            if (!e.target.classList.contains("cell")) return;

            const x = Number(e.target.dataset.x);
            const y = Number(e.target.dataset.y);

            this.handleHover(x, y);
        });

        this.elements.humanBoardEl.addEventListener("mouseleave", () => {
            this.clearPreview();
        });

        this.elements.computerBoardEl.addEventListener("click", (e) => {
            if (!e.target.classList.contains("cell")) return;

            if (this.controller.phase !== "battle") return;

            const x  = Number(e.target.dataset.x);
            const y = Number(e.target.dataset.y);

            this.handleBattle(x, y);
        })

        this.elements.rotateBtn.addEventListener("click", (e) => {
            this.toggleDirection();
        })

        this.elements.restartBtn.addEventListener("click", (e) => {
            this.restartGame();
        })
    }

    updateStatus(message) {
        this.elements.statusEl.textContent = message;
    }

    toggleDirection() {
        if (this.currentDirection === "horizontal") {
            this.currentDirection = "vertical";
        } else {
            this.currentDirection = "horizontal";
        }
    }

    restartGame() {
        this.controller = new GameController();
        this.controller.placeComputerShips();
        this.currentDirection = "horizontal";
        this.elements.rotateBtn.textContent = "Rotate";
        this.renderBoards();
        this.updateStatus("place your ships");
    }
}