function addButtonEvents(btn, gameBoard) {
    btn.addEventListener("click", () => {
        if (gameBoard.currentPlayer === gameBoard.player1) {
            btn.classList.add("shinyButtonBlack");
            gameBoard.currentPlayer = gameBoard.player2; 
        } else {
            btn.classList.add("shinyButtonWhite");
            gameBoard.currentPlayer = gameBoard.player1; 
        }

        btn.disabled = true;
    });
    return btn;  
}

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
        this.currentPlayer = player1;
    }

    setBoard() {
        for (let i = 0; i < 225; i++) {
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("buttonContainer");

            var button = document.createElement("button");
            button.setAttribute("value", i);


            button = addButtonEvents(button, this);

            buttonContainer.appendChild(button);
            this.board.appendChild(buttonContainer);
        }
    }
}

const container = document.querySelector(".container");
const player1 = new Player("black");
const player2 = new Player("white");
const currentBoard = new GameBoard(container, player1, player2);
currentBoard.setBoard();
