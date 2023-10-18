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
    initWinBoard();
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
        setTimeout(() => winAnimation(), 700);
        const winBoard = document.querySelector(".winBoard");
        setTimeout(() => winBoard.classList.add("winBoard-active"), 2000);
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

function initScoreboard() {
    const scoreBtn = document.querySelector(".score-btn");
    const scoreBoard = document.querySelector(".scoreBoard");
    scoreBtn.addEventListener("click", () => {
        scoreBoard.classList.add("scoreBoard-active");
        score = localStorage.getItem("top10");
        result1.innerHTML = score;
        console.log(score);
    });

    const modalMenuOverlayScore = document.querySelector(
        ".overlay-modal-score"
    );
    modalMenuOverlayScore.addEventListener("click", () => {
        scoreBoard.classList.remove("scoreBoard-active");
    });
}

function initWinBoard() {
    const winBoard = document.querySelector(".winBoard");
    const modalMenuOverlayWin = document.querySelector(".overlay-modal-win");
    modalMenuOverlayWin.addEventListener("click", () => {
        winBoard.classList.remove("winBoard-active");
        setTimeout(() => window.history.go(0), 700);
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
}

const digits = document.getElementsByClassName("digit");

const result1 = document.getElementById("scoreItem1");
const result2 = document.getElementById("scoreItem2");
console.log(result1, result2);

const Counter = function () {
    this.count = 0;
    this.increase = function () {
        this.count = this.count + 1;
    };
};

const counter = new Counter();
result1.innerHTML = counter.count;
result2.innerHTML = counter.count;
let score;

localStorage.getItem("top10") > 0
    ? (score = localStorage.getItem("top10"))
    : (score = 0);

for (const digit of digits) {
    digit.addEventListener("click", () => {
        counter.increase();
        result1.innerHTML = counter.count;
        score = result1.innerHTML;
        result2.innerHTML = counter.count;
        score = result2.innerHTML;
        console.log(score);
        localStorage.setItem("top10", score);
    });
}
