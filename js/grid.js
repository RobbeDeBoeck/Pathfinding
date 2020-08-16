import { MIN_SIZE } from "./util.js";
const gridElement = document.getElementById("grid");
const widthInput = document.querySelector("input[name='width']");
const heightInput = document.querySelector("input[name='height']");

let grid;
let obstacleToggle = false;

// single setup function to create the grid
export function setup() {
    widthInput.addEventListener("change", changeHandler);
    heightInput.addEventListener("change", changeHandler);
    update();
}

// get the cell at a given row and column index
export function getCell(row, col) {
    if (!grid[row]) return null;
    return grid[row][col];
}

// check if a cell exists / isn't an obstacle
export function canMoveTo(row, col) {
    const cell = getCell(row, col);
    if (!cell) return false;
    return !cell.classList.contains("obstacle");
}

// shortcut function to get the starting position
export function getStartingPosition() {
    return getPositionByClassName(".start");
}

// shortcut function to get the goal position
export function getgoalingPosition() {
    return getPositionByClassName(".goal");
}

// clears all the path and visited cells and obstacles if full = true
export function clear(full = true) {
    gridElement.querySelectorAll(".obstacle, .path, .visited").forEach(cell => {
        cell.classList.remove("path", "visited");
        cell.innerText = "";
        if (full) cell.classList.remove("obstacle");
    });
}

// handler for when the width or height input fields change
function changeHandler(event) {
    if (event.target.value < MIN_SIZE) event.target.value = MIN_SIZE;
    update();
}

// recreates the grid when the width or height has been changed
function update() {
    grid = [];
    const width = widthInput.value;
    const height = heightInput.value;
    gridElement.style.gridTemplate = `repeat(${width}, 50px) / repeat(${height}, 50px)`;
    gridElement.innerHTML = "";

    let row = [];
    for (let i = 0; i < width * height; i++) {
        const cell = createCell();
        if (i == 0) cell.classList.add("start");
        if (i == width * height - 1) cell.classList.add("goal");

        if (i != 0 && i % height == 0) {
            grid.push(row);
            row = [];
        }
        row.push(cell);
        gridElement.appendChild(cell);
    }
    grid.push(row);
}

// creates a cell
function createCell() {
    const cell = document.createElement("div");
    cell.classList.add("grid-cell");
    cell.draggable = true;

    addObstacleHandler(cell);
    addDragHandlers(cell);

    return cell;
}

// get the row and col of a cell with a given classname
function getPositionByClassName(className) {
    const cell = gridElement.querySelector(className);
    if (!cell) return null;

    for (let row = 0; row < grid.length; row++) {
        const col = grid[row].indexOf(cell);
        if (col > -1) return { row, col };
    }

    return null;
}

function addObstacleHandler(cell) {
    // toggle obstacles on/of on by click
    cell.addEventListener("click", e => {
        if (cell.classList.contains("start") || cell.classList.contains("goal")) return;
        cell.classList.toggle("obstacle");
        obstacleToggle = !obstacleToggle;
    });

    // toggle obtacle class when obstacles are on and the cursor enters a cell
    cell.addEventListener("mouseenter", e => {
        if (obstacleToggle) cell.classList.toggle("obstacle");
    });
}

function addDragHandlers(cell) {
    // add dragging class for identification
    cell.addEventListener("dragstart", e => {
        cell.classList.add("dragging");
    });

    // cleanup cells after dragging
    cell.addEventListener("dragend", e => {
        cell.classList.remove("start", "goal", "dragging");
        gridElement.querySelector(".start").classList.remove("obstacle");
        gridElement.querySelector(".goal").classList.remove("obstacle");
    });

    // add appropiate class when dragging over a cell
    cell.addEventListener("dragenter", e => {
        const dragging = gridElement.querySelector(".dragging");
        if (!dragging) return;
        if (!dragging.classList.contains("start") && !dragging.classList.contains("goal")) return;
        if (cell.classList.contains("start") || cell.classList.contains("goal")) return;

        const className = dragging.classList.contains("start") ? "start" : "goal";

        gridElement.querySelectorAll(`.${className}:not(.dragging)`).forEach(e => {
            e.classList.remove(className);
        });
        cell.classList.add(className);
    });

    // prevent not allowed cursor from showing
    cell.addEventListener("dragover", e => e.preventDefault());
}
