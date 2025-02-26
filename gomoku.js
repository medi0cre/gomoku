class Player {
    constructor(color) {
        this.color = color;
        this.score = 0;
    }
}

class GameBoard {
    constructor(board, player1, player2) {
        this.board = board;
        this.player1 = player1;
        this.player2 = player2;
        this.grid = Array(225).fill(null);
        this.currentPlayer = player1;
        this.time = 60;
        this.ws = new WebSocket("wss://192.168.2.14:8082");
    }
    
    connect() {
        this.ws.addEventListener("open", () => {
            console.log("You are connected to the server");
        });
        this.ws.addEventListener("message", (event) => {
            const boardButtons = document.querySelectorAll(".boardButton");
            boardButtons.forEach((btn) => {
                if(btn.value == event.data) {
                    if (this.currentPlayer === this.player1) {
                        btn.classList.add("shinyButtonBlack");
                        this.grid[Number(btn.value)] = "black";
                        if(this.checkWinner(Number(btn.value))) {
                            console.log("Black wins");
                            this.disableAllButtons();
                        }
                        this.currentPlayer = this.player2; 
                    } else {
                        btn.classList.add("shinyButtonWhite");
                        this.grid[Number(btn.value)] = "white";
                        if(this.checkWinner(Number(btn.value))) {
                            console.log("White wins");
                            this.disableAllButtons();
                        }
                        this.currentPlayer = this.player1; 
                    }
            
                    btn.disabled = true;
                }
            })
        })
    }

    setBoard() {
        setInterval(this.myTimer.bind(this), 1000);
        for (let i = 0; i < 225; i++) {
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("buttonContainer");

            var button = document.createElement("button");
            button.setAttribute("value", i);
            button.classList.add("boardButton");
            this.addButtonEvents(button);

            buttonContainer.appendChild(button);
            this.board.appendChild(buttonContainer);
        }
    }

    myTimer() {
        var timerValue = document.querySelector(".timerValue");
        this.time-=1;
        timerValue.textContent = this.time;
        if(this.time == 0) {
            this.time = 60;
            this.togglePlayer();
        }
    }

    checkWinner(buttonIndex) {
        const directions = [
            { x: 1, y: 0 },  
            { x: 0, y: 1 },  
            { x: 1, y: 1 },  
            { x: 1, y: -1 }, 
        ];

        for (let direction of directions) {
            let count = 1;

            for (let step = 1; step < 5; step++) {
                const newX = Math.floor(buttonIndex % 15) + direction.x * step;
                const newY = Math.floor(buttonIndex / 15) + direction.y * step;
                if (newX >= 0 && newX < 15 && newY >= 0 && newY < 15 &&
                    this.grid[newY * 15 + newX] === this.currentPlayer.color) {
                    count++;
                } else {
                    break;
                }
            }

            for (let step = 1; step < 5; step++) {
                const newX = Math.floor(buttonIndex % 15) - direction.x * step;
                const newY = Math.floor(buttonIndex / 15) - direction.y * step;
                if (newX >= 0 && newX < 15 && newY >= 0 && newY < 15 &&
                    this.grid[newY * 15 + newX] === this.currentPlayer.color) {
                    count++;
                } else {
                    break;
                }
            }

            if (count >= 5) {
                return true; 
            }
        }
        return false;
    }

    disableAllButtons() {
        const buttons = document.querySelectorAll(".boardButton");
        buttons.forEach((button) => {
            button.disabled = true;
        });
    }
    togglePlayer() {
        if(this.currentPlayer === this.player1) {
            this.currentPlayer = this.player2;
            document.querySelector(".currentPlayer").textContent = "Current Player : White";
            document.querySelector(".currentPlayer").style.color = "white";
        } 
        else {
            this.currentPlayer = this.player1;
            document.querySelector(".currentPlayer").textContent = "Current Player : Black";
            document.querySelector(".currentPlayer").style.color = "black";
        }
    }
    addButtonEvents(btn) {
        btn.addEventListener("click", () => {
            if (this.currentPlayer === this.player1) {
                btn.classList.add("shinyButtonBlack");
                this.grid[Number(btn.value)] = "black";
                this.ws.send(btn.value.toString());
                if(this.checkWinner(Number(btn.value))) {
                    console.log("Black wins");
                    this.disableAllButtons();
                }
                this.togglePlayer();
                this.time = 60;
            } else {
                btn.classList.add("shinyButtonWhite");
                this.grid[Number(btn.value)] = "white";
                this.ws.send(btn.value.toString());
                if(this.checkWinner(Number(btn.value))) {
                    console.log("White wins");
                    this.disableAllButtons();
                }
                this.togglePlayer();
                this.time = 60;
            }
    
            btn.disabled = true;
        });
    }
}

const container = document.querySelector(".container");
const player1 = new Player("black");
const player2 = new Player("white");
const currentBoard = new GameBoard(container, player1, player2);
currentBoard.setBoard();
currentBoard.connect();
