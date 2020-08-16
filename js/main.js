import * as Grid from "./grid.js";
import { findPath } from "./algorithm.js";
import { ANIMATION_DELAY } from "./util.js";

Grid.setup();

// color picker
document.querySelectorAll("input[type='color']").forEach(input => {
    input.addEventListener("change", e => {
        document.documentElement.style.setProperty(`--${input.name}`, input.value);
    });
});

// full clear
document.querySelector("button[name='clear']").addEventListener("click", e => {
    e.preventDefault();
    Grid.clear();
});

// soft clear
document.querySelector("button[name='softClear']").addEventListener("click", e => {
    e.preventDefault();
    Grid.clear(false);
});

// starts the search
document.querySelector("button[name='search']").addEventListener("click", e => {
    e.preventDefault();

    Grid.clear(false);

    const startPos = Grid.getStartingPosition();
    const goalPos = Grid.getgoalingPosition();

    if (startPos && goalPos) {
        console.time("search time");
        const result = findPath(startPos, goalPos);
        console.timeEnd("search time");

        // not so great way to animate?
        let index = 0;
        let pathAnimation;
        // start interval for the visited cells
        const visitAnimation = setInterval(() => {
            // if looped through visited list clear the inteval, index and start the interval for the path
            if (index >= result.order.length) {
                index = 0;
                pathAnimation = setInterval(() => {
                    if (index >= result.path.length) return clearInterval(pathAnimation);
                    // get the cell and add the path class
                    const pos = result.path[index];
                    Grid.getCell(pos.row, pos.col).classList.add("path");
                    index++;
                }, ANIMATION_DELAY);

                return clearInterval(visitAnimation);
            }
            // get the cell and add the visited class
            const pos = result.order[index];
            Grid.getCell(pos.row, pos.col).classList.add("visited");
            index++;
        }, ANIMATION_DELAY);
    }
});
