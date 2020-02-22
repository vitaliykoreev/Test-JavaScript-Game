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
        overlay = document.getElementById("overlay"),
        playPauseButtons = document.querySelectorAll("[data-button-play]"),
        initialPlayButton = document.getElementById("button-play");

    window.isPaused = true; // Global variable for play/pause status

    gameElement.classList.add("paused");

    let game = requestAnimationFrame(loop);

    function pause() {
        if (!window.isPaused) {
            cancelAnimationFrame(game);
            gameElement.classList.add("paused");
            initialPlayButton.innerText = "Continue";
        } else {
            game = requestAnimationFrame(loop);
            gameElement.classList.remove("paused");
        }

        window.isPaused = !window.isPaused;
    }

    // Play/Pause Buttons Handler
    playPauseButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            pause();
        });
    });

    let Jane = new Character( {width: 64, height: 153}, {x: 100, y: 300}, 9, 1, {width: 50, height: 140, x: 5});
    Jane.render();

    // Game Objects Array
    let blocks = [
        new Ground(window.innerWidth, 100, {x: 0, y: 0}), // Ground block
        new Block(200, 50, {x: 450, y: 150}),
        new Block(200, 50, {x: 1250, y: 120}),
        new Block(350, 50, {x: 700, y: 280}),
        new Block(50, 50, {x: 600, y: 210}),
        new Pipe(70, 70, {x: 100, y: 100}),
        new Pipe(70, 120, {x: 170, y: 100}),
        new Block(50, 500, {x: -40, y: 100}), // Left wall
        new Block(50, 500, {x: window.innerWidth - 10, y: 100}) // Right wall
    ];

    // Initial Render Game Objects
    blocks.forEach(block => block.render());

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
            pause();
        }
    });

    document.addEventListener('keyup', (event) => {
        Jane.stop();
    });

    function loop() {
        Jane.update(blocks);
        Jane.render();

        if (!isPaused) {
            game = requestAnimationFrame(loop);
        }
    }

    window.focus();
});

