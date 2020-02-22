import { Block } from "../Block.js";

export class Ground extends Block {
    render() {
        super.render();
        this.element.classList.add('gameObject-ground');
    }
}