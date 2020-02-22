"use strict";

import { Character } from "./Character.js";
import { Block } from "./Block.js";
import { Pipe } from "./Objects/Pipe.js";
import { Ground } from "./Objects/Ground.js";

window.Config = {
    displayObjectsBorder: false,
    displayObjectsCollisionModel: false
};

window.addEventListener('DOMContentLoaded', () => {
    let world = document.getElementById("scene"),
        gameElement = document.getElementById("game"),
        overlay = document.getElementById("overlay");

    let isPaused = true;
    let startTimestamp = performance.now();

    let game = requestAnimationFrame(loop);

    let Jane = new Character( {width: 64, height: 153}, {x: 100, y: 300}, 9, 1, {width: 50, height: 140, x: 5});
    Jane.render();

    let ground = new Ground(window.innerWidth, 100, {x: 0, y: 0});
    ground.render();

    let leftWall = new Block(50, 500, {x: -40, y: 100});
    leftWall.render();
    let rightWall = new Block(50, 500, {x: window.innerWidth - 10, y: 100});
    rightWall.render();

    let block1 = new Block(200, 50, {x: 350, y: 150});
    block1.render();

    let block4 = new Block(200, 50, {x: 1250, y: 120});
    block4.render();

    let block2 = new Block(350, 50, {x: 700, y: 280});
    block2.render();

    let block3 = new Pipe(70, 70, {x: 100, y: 100});
    block3.render();

    let blocks = [ground, block1, block2, block3, block4, leftWall, rightWall];

    document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowRight') {
            if (Jane.getPosition().x + Jane.getDimensions().width <= world.offsetWidth) {
                Jane.move("RIGHT");
            } else {
                Jane.stop();
            }
        } else if (event.code === 'ArrowLeft') {
            if (Jane.getPosition().x > 0) {
                Jane.move("LEFT");
            } else {
                Jane.stop();
            }
        } else if (event.code === 'Space') {
            Jane.jump();
        } else if (event.code === "Escape") {
            if (!isPaused) {
                cancelAnimationFrame(game);
                gameElement.classList.add("paused");
            } else {
                game = requestAnimationFrame(loop);
                gameElement.classList.remove("paused");
            }

            isPaused = !isPaused;
        }
    });

    document.addEventListener('keyup', (event) => {
        //character.classList.remove('walk');
        Jane.stop();
    });

    function loop(timestamp) {
        Jane.update(blocks);
        Jane.render();

        if (!isPaused) {
            game = requestAnimationFrame(loop);
        }
    }

    window.focus();
});

