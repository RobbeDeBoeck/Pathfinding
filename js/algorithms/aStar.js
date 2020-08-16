import { canMoveTo } from "../grid.js";
import { eightDirections as directions, MAX_ITERS, isGoal, reversePath, manhattan as calculateH } from "../util.js";

let unvisited;
let visited;
let order;

export function search(start, goal) {
    // initialize lists
    unvisited = new Map();
    visited = new Map();
    order = [];

    // add the starting node to the unvisited list and initialize the iteration counter
    unvisited.set(JSON.stringify(start), { pos: start, parent: null, f: 0, g: 0, h: 0 });
    let iters = 0;

    while (unvisited.size > 0) {
        // get entry with lowest f value and remove from list
        const q = [...unvisited.values()].reduce((prev, next) => (next.f < prev.f ? next : prev), { f: Infinity });
        unvisited.delete(JSON.stringify(q.pos));

        // add neighbours to the unvisited list
        for (const direction of directions) {
            // get the position of the neighbour and check if it is possible to move to it
            const pos = { row: q.pos.row + direction.row, col: q.pos.col + direction.col };
            if (!canMoveTo(pos.row, pos.col)) continue;

            // create an object that holds the position and parent
            let node = { pos, parent: q.pos };
            // if this position is the goal, clear the unvisited list, add the node to the visited list and break out of the loop
            if (isGoal(pos, goal)) {
                unvisited.clear();
                visited.set(JSON.stringify(pos), node);
                break;
            }

            // calculate the g and h value and add it to the node
            const g = q.g + direction.dist;
            const h = calculateH(pos, goal);
            node = { ...node, f: g + h, g, h };

            // if the unvisited or visited list already contains this position with a lower f value ignore this node
            if (unvisited.has(JSON.stringify(pos)) && unvisited.get(JSON.stringify(pos)).f <= node.f) continue;
            if (visited.has(JSON.stringify(pos)) && visited.get(JSON.stringify(pos)).f <= node.f) continue;

            // add the node to the unvisited list
            unvisited.set(JSON.stringify(pos), node);
        }

        // add the node to the visited list
        visited.set(JSON.stringify(q.pos), q);
        // add the node to the order list if it doesn't already contain it
        if (!order.some(v => v.row == q.pos.row && v.col == q.pos.col)) order.push(q.pos);
        // increase iteration count and check if it does not exceed the maximum
        if (++iters > MAX_ITERS) return { path: [], order };
    }

    // return an object containing the path and the order in which the cells have been visited
    return { path: reversePath(visited, goal), order };
}
