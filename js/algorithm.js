import { search as bfs } from "./algorithms/bfs.js";
import { search as dfs } from "./algorithms/dfs.js";
import { search as aStar } from "./algorithms/aStar.js";
import { search as dijkstra } from "./algorithms/dijkstra.js";

const alg = document.querySelector("select[name='algorithm']");

// execute alrorithm based on selectbox value
export function findPath(startPos, goalPos) {
    const val = alg.value;

    if (val == "a*") return aStar(startPos, goalPos);
    if (val == "dijkstra") return dijkstra(startPos, goalPos);
    if (val == "bfs") return bfs(startPos, goalPos);
    if (val == "dfs") return dfs(startPos, goalPos);

    return { path: [], visited: [] };
}
