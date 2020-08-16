export const MIN_SIZE = 5;
export const MAX_ITERS = 10000;
export const ANIMATION_DELAY = 10;

// North, South, East, West
export const fourDirections = [
    { row: -1, col: 0, dist: 1 },
    { row: 1, col: 0, dist: 1 },
    { row: 0, col: 1, dist: 1 },
    { row: 0, col: -1, dist: 1 },
];

// North, South, East, West, North-East, North-West, South-East, South-West
export const eightDirections = [
    ...fourDirections,
    { row: -1, col: 1, dist: 1.414 },
    { row: -1, col: -1, dist: 1.414 },
    { row: 1, col: 1, dist: 1.414 },
    { row: 1, col: -1, dist: 1.414 },
];

// check if given position is equal to the goal position
export function isGoal(pos, goal) {
    return pos.row == goal.row && pos.col == goal.col;
}

// reverse the path given a visited list and the goal position
export function reversePath(map, goal) {
    const path = [];
    let pos = goal;

    while (map.has(JSON.stringify(pos))) {
        path.unshift(pos);
        pos = map.get(JSON.stringify(pos)).parent;
    }

    return path;
}

// manhattan distance
export function manhattan(pos, goal) {
    return Math.abs(pos.row - goal.row) + Math.abs(pos.col - goal.col);
}

// euclidian distance
export function euclidian(pos, goal) {
    return Math.sqrt(Math.pow(pos.row - goal.row, 2) + Math.pow(pos.col - goal.col, 2));
}

// diagonal distance
export function diagonal(pos, goal) {
    return Math.max(Math.abs(pos.row - goal.row), Math.abs(pos.col - goal.col));
}
