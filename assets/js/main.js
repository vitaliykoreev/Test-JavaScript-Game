"use strict";

import { Character } from "./Character.js";
import { Block } from "./Block.js";
import { Pipe } from "./Objects/Pipe.js";
import { Ground } from "./Objects/Ground.js";
import { Cloud } from "./Objects/Cloud.js";

window.Config = {
    displayObjectsBorder: false,
    displayObjectsCollisionModel: false
};

window.addEventListener('DOMContentLoaded', () => {
    let world = document.getElementById("scene"),
        gameElement = document.getElementById("game"),
        playPauseButtons = document.querySelectorAll("[data-button-play]"),
        initialPlayButton = document.getElementById("button-play"),
        buttonBuilderMode = document.getElementById("button-builder-mode");

    window.isPaused = true; // Global variable for play/pause status
    window.isBuilderMode = false; // Creation mode status

    gameElement.classList.add("paused");

    // Player init & render
    let Jane = new Character( {width: 64, height: 153}, {x: 100, y: 300}, 9, 1, {width: 50, height: 140, x: 5});
    Jane.render();

    // Game Objects Array
    let blocks = [
        new Ground(window.innerWidth, 100, {x: 0, y: 0}), // Ground block
        new Block(200, 50, {x: 450, y: 150}),
        new Block(200, 50, {x: 1250, y: 120}),
        new Block(350, 50, {x: 700, y: 280}),
        new Block(100, 50, {x: 600, y: 210}),
        new Pipe(70, 70, {x: 100, y: 100}),
        new Block(50, window.innerHeight, {x: -40, y: 100}), // Left wall
        new Block(50, window.innerHeight, {x: window.innerWidth - 10, y: 100}), // Right wall
        new Block(window.innerWidth, 50, {x: 0, y: window.innerHeight - 10}), // Top bar
    ];

    let clouds = [
        new Cloud(200, 150, {x: 200, y: window.innerHeight - 200}),
        new Cloud(150, 100, {x: 400, y: window.innerHeight - 150}),
        new Cloud(170, 120, {x: 560, y: window.innerHeight - 180}),
    ];

    // Initial Render Game Objects
    blocks.forEach(block => block.render());

    // Init Non-game objects (e.g. Clouds, etc.)
    clouds.forEach(cloud => cloud.render());

    let game = requestAnimationFrame(loop); // Init game animation

    function pause() {
        if (!window.isPaused) {
            cancelAnimationFrame(game);
            gameElement.classList.add("paused");
            gameElement.classList.remove("builder");
            initialPlayButton.innerText = "Continue";
        } else {
            game = requestAnimationFrame(loop);
            gameElement.classList.remove("paused");
        }

        window.isPaused = !window.isPaused;
    }

    function builderMode() {
        pause();
        window.isBuilderMode = !window.isBuilderMode;

        if (window.isBuilderMode) {
            Jane.element.style.display = "none";
            gameElement.classList.add("builder");
        } else {
            Jane.element.style.display = "block";
            gameElement.classList.remove("builder");
        }
    }

    // Builder Mode
    let isClicked = false,
        positionStart = 0,
        positionEnd = 0,
        newElementPlaceholder;

    world.addEventListener("click", (event) => {
        if (window.isBuilderMode) {
            if (event.target.classList.contains("gameObject")) {
                alert("brick");
            } else {
                if (!isClicked) {
                    newElementPlaceholder = document.createElement("section");
                    newElementPlaceholder.classList.add("gameObject", "block", "block-placeholder");

                    positionStart = {x: event.clientX, y: window.innerHeight - event.clientY};

                    newElementPlaceholder.style.left = positionStart.x + "px";
                    newElementPlaceholder.style.bottom = positionStart.y + "px";
                    newElementPlaceholder.style.height = "50px";
                    newElementPlaceholder.style.display = "block";

                    world.appendChild(newElementPlaceholder);

                    isClicked = true;
                } else {
                    positionEnd = {x: event.clientX, y: window.innerHeight - event.clientY};

                    let newBlock = new Block(Math.abs(positionEnd.x - positionStart.x), 50, {x: (positionStart.x > positionEnd.x ? positionEnd.x : positionStart.x), y: positionStart.y});

                    blocks.push(newBlock);
                    newBlock.render();

                    newElementPlaceholder.remove();

                    isClicked = false;
                }
            }
        }
    });

    world.addEventListener("mousemove", (event) => {
        if (window.isBuilderMode && isClicked) {
            if (event.clientX < positionStart.x) {
                newElementPlaceholder.style.left = event.clientX + "px";
            }

            newElementPlaceholder.style.width = Math.abs(event.clientX - positionStart.x ) + "px";
        }
    });

    // Builder Button Handler
    buttonBuilderMode.addEventListener("click", (event) => {
        event.preventDefault();
        builderMode();
    });

    // Play/Pause Buttons Handler
    playPauseButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            pause();
        });
    });

    document.addEventListener('keydown', (event) => {
        if (!window.isPaused) {
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
            }
        }

        if (event.code === "Escape") {
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

