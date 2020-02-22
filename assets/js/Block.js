import { GameObject } from "./GameObject.js";

export class Block extends GameObject {
    constructor(width, height, position, collision, element = null) {
        super(width, height, position, collision, element);
    }

    render() {
        super.render();
        this.element.classList.add("block");
    }
}