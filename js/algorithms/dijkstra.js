import { canMoveTo } from "../grid.js";
import { eightDirections as directions, MAX_ITERS, isGoal, reversePath } from "../util.js";

let unvisited;
let visited;
let order;

export function search(start, goal) {
    // initialize lists
    unvisited = [];
    visited = new Map();
    order = [];

    // add the starting node to the unvisited list and initialize the iteration counter
    unvisited.push({ pos: start, dist: 0 });
    let iters = 0;

    while (unvisited.length > 0) {
        // get entry with the shortest distance and remove from list
        const u = unvisited.reduce((prev, next) => (next.dist < prev.dist ? next : prev), { dist: Infinity });
        unvisited.splice(unvisited.indexOf(u), 1);

        // if node has already been visited ignore
        if (visited.has(JSON.stringify(u.pos))) continue;

        // add neighbours to the unvisited list
        for (const direction of directions) {
            // get the position of the neighbour and check if it is possible to move to it
            const pos = { row: u.pos.row + direction.row, col: u.pos.col + direction.col };
            if (!canMoveTo(pos.row, pos.col)) continue;

            // create an object that holds the current position, parent and distance
            const node = { pos, parent: u.pos, dist: u.dist + direction.dist };

            // if this node is the goal clear the unvisited list, add node to the visited list and break out of loop
            if (isGoal(pos, goal)) {
                unvisited = [];
                visited.set(JSON.stringify(pos), node);
                break;
            }

            // add neighbour to the unvisited list
            unvisited.push(node);
        }

        // increase iteration count and check if it does not exceed the maximum
        if (++iters > MAX_ITERS) return { path: [], order };
        // add node to the order list and the visited list
        order.push(u.pos);
        visited.set(JSON.stringify(u.pos), u);
    }

    // return an object containing the path and the order in which the cells have been visited
    return { path: reversePath(visited, goal), order };
}
