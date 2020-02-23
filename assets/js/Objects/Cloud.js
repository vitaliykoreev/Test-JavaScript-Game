import { Block } from "../Block.js";

export class Cloud extends Block {
    render() {
        super.render();
        this.element.classList.add('gameObject-cloud');
    }
}