import { Block } from "../Block.js";

export class Pipe extends Block {
    render() {
        super.render();
        this.element.classList.add('gameObject-pipe');
    }
}