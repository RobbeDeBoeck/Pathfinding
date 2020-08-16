import { fourDirections as directions, MAX_ITERS, isGoal, reversePath } from "../util.js";
import { canMoveTo } from "../grid.js";

let unvisited;
let visited;
let order;

export function search(start, goal) {
    // initialize lists
    unvisited = [];
    visited = new Map();
    order = [];

    // add the starting node to the unvisited list and initialize the iteration counter
    unvisited.push({ pos: start, parent: null });
    let iters = 0;

    while (unvisited.length > 0) {
        // get the first node in the list
        const node = unvisited.shift();

        // check if node is the goal and if so break out of loop
        if (checkCell(node.pos, node.parent, goal)) break;

        // increase iteration count and check if it does not exceed the maximum
        if (++iters >= MAX_ITERS) return { path: [], order };
    }

    // return an object containing the path and the order in which the cells have been visited
    return { path: reversePath(visited, goal), order };
}

function checkCell(cur, parent, goal) {
    // ignore if cannot move to position or position has already been checked
    if (!canMoveTo(cur.row, cur.col)) return false;
    if (visited.has(JSON.stringify(cur))) return false;

    // add position to visited list with it's parent and add to order list
    visited.set(JSON.stringify(cur), { parent });
    order.push(cur);

    // return true if this is the goal position
    if (isGoal(cur, goal)) return true;

    // add neighbours to unvisited list
    for (const direction of directions) {
        unvisited.push({ pos: { row: cur.row + direction.row, col: cur.col + direction.col }, parent: cur });
    }

    return false;
}
