import { Sudoku } from "./sudoku.js";
import {
    BOX_SIZE,
    GRID_SIZE,
    convertIndexToPosition,
    convertPositionToIndex,
} from "./utilities.js";

const sudoku = new Sudoku();

let cells;
let selectedCellIndex;
let selectedCell;

Init();

function Init() {
    initCells();
    initDigits();
    initRemover();
    initNewGame();
    initScoreboard();
    initKeyEvent();
}

function initCells() {
    cells = document.querySelectorAll(".cell");
    fillCells();
    initCellsEvent();
}

function fillCells() {
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const { row, column } = convertIndexToPosition(i);

        if (sudoku.grid[row][column] !== null) {
            cells[i].classList.add("filled");
            cells[i].innerHTML = sudoku.grid[row][column];
        }
    }
}

function initCellsEvent() {
    cells.forEach((cell, index) => {
        cell.addEventListener("click", () => onCellClick(cell, index));
    });
}

function onCellClick(clickedCell, index) {
    cells.forEach((cell) =>
        cell.classList.remove("selected", "highlighted", "error")
    );

    if (clickedCell.classList.contains("filled")) {
        selectedCellIndex = null;
        selectedCell = null;
    } else {
        selectedCellIndex = index;
        selectedCell = clickedCell;
        clickedCell.classList.add("selected");
        highlightCellBy(index);
    }

    if (clickedCell.innerHTML === "") return;
    cells.forEach((cell) => {
        if (cell.innerHTML === clickedCell.innerHTML)
            cell.classList.add("selected");
    });
}

function highlightCellBy(index) {
    highlightColumnBy(index);
    highlightRowBy(index);
    highlightBoxBy(index);
}

function highlightColumnBy(index) {
    const column = index % GRID_SIZE;
    for (let row = 0; row < GRID_SIZE; row++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add("highlighted");
    }
}

function highlightRowBy(index) {
    const row = Math.floor(index / GRID_SIZE);
    for (let column = 0; column < GRID_SIZE; column++) {
        const cellIndex = convertPositionToIndex(row, column);
        cells[cellIndex].classList.add("highlighted");
    }
}

function highlightBoxBy(index) {
    const column = index % GRID_SIZE;
    const row = Math.floor(index / GRID_SIZE);
    const firstRowInBox = row - (row % BOX_SIZE);
    const firstColumnInBox = column - (column % BOX_SIZE);

    for (let iRow = firstRowInBox; iRow < firstRowInBox + BOX_SIZE; iRow++) {
        for (
            let iColumn = firstColumnInBox;
            iColumn < firstColumnInBox + BOX_SIZE;
            iColumn++
        ) {
            const cellIndex = convertPositionToIndex(iRow, iColumn);
            cells[cellIndex].classList.add("highlighted");
        }
    }
}

function initDigits() {
    const digits = document.querySelectorAll(".digit");
    digits.forEach((digit) => {
        digit.addEventListener("click", () =>
            onDigitClick(parseInt(digit.innerHTML))
        );
    });
}

function onDigitClick(digit) {
    if (!selectedCell) return;
    if (selectedCell.classList.contains("filled")) return;

    cells.forEach((cell) =>
        cell.classList.remove("error", "shake", "zoom", "selected")
    );
    selectedCell.classList.add("selected");
    setValueInSelectedCell(digit);

    if (!sudoku.hasEmptyCells()) {
        setTimeout(() => winAnimation(), 500);
    }
}

function setValueInSelectedCell(value) {
    const { row, column } = convertIndexToPosition(selectedCellIndex);
    const duplicatesPositions = sudoku.getDuplicatePositions(
        row,
        column,
        value
    );
    if (duplicatesPositions.length) {
        highlightDuplicates(duplicatesPositions);
        return;
    }
    sudoku.grid[row][column] = value;
    selectedCell.innerHTML = value;
    setTimeout(() => selectedCell.classList.add("zoom"), 0);
}

function highlightDuplicates(duplicatesPositions) {
    duplicatesPositions.forEach((duplicate) => {
        const index = convertPositionToIndex(duplicate.row, duplicate.column);
        setTimeout(() => cells[index].classList.add("error", "shake"), 0);
    });
}

function initRemover() {
    const remover = document.querySelector(".remove");
    remover.addEventListener("click", () => onRemoveClick());
}

function onRemoveClick() {
    if (!selectedCell) return;
    if (selectedCell.classList.contains("filled")) return;

    cells.forEach((cell) =>
        cell.classList.remove("error", "shake", "zoom", "selected")
    );
    selectedCell.classList.add("selected");
    const { row, column } = convertIndexToPosition(selectedCellIndex);
    selectedCell.innerHTML = "";
    sudoku.grid[row][column] = null;
}

function initNewGame() {
    const game = document.querySelector(".game");
    const newGame = document.querySelector(".newGame");
    game.addEventListener("click", () => {
        newGame.classList.add("newGame-active");
    });

    const modalMenuOverlayGame = document.querySelector(".overlay-modal-game");
    modalMenuOverlayGame.addEventListener("click", () => {
        newGame.classList.remove("newGame-active");
    });

    const chooseGame = document.querySelector(".newGame-btn");
    chooseGame.addEventListener("click", () => {
        newGame.classList.remove("newGame-active");
    });

    alert(
        "Привет, Проверяющий! Немного не успела доделать игру, перепроверь ближе к концу ревью, пожалуйста)"
    );
}

function initScoreboard() {
    const score = document.querySelector(".score");
    const scoreBoard = document.querySelector(".scoreBoard");
    score.addEventListener("click", () => {
        scoreBoard.classList.add("scoreBoard-active");
    });

    const modalMenuOverlayScore = document.querySelector(
        ".overlay-modal-score"
    );
    modalMenuOverlayScore.addEventListener("click", () => {
        scoreBoard.classList.remove("scoreBoard-active");
    });
}

function initKeyEvent() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "Backspace" || event.key === "Delete") {
            onRemoveClick();
        } else if (event.key >= "1" && event.key <= "9") {
            onDigitClick(parseInt(event.key));
        }
    });
}

function winAnimation() {
    cells.forEach((cell) =>
        cell.classList.remove(
            "error",
            "shake",
            "zoom",
            "selected",
            "highlighted"
        )
    );
    cells.forEach((cell, i) =>
        setTimeout(() => cell.classList.add("highlighted", "zoom"), i * 15)
    );
    for (let i = 1; i < 10; i++) {
        setTimeout(
            () => cells.forEach((cell) => cell.classList.toggle("highlighted")),
            500 + cells.length * 15 + 300 * i
        );
    }
    cells.forEach((cell) => cell.classList.add("win"));

    const scoreBoard = document.querySelector(".scoreBoard");

    setTimeout(() => scoreBoard.classList.add("scoreBoard-active"), 2000);
}

const digits = document.getElementsByClassName("digit");
const result = document.getElementById("counter");
console.log(result);

const Counter = function () {
    this.count = 0;
    this.increase = function () {
        this.count = this.count + 1;
    };
};

const counter = new Counter();
result.innerHTML = counter.count;

for (const digit of digits) {
    digit.addEventListener("click", (event) => {
        counter.increase();
        result.innerHTML = counter.count;
        console.log(result);
    });
}
