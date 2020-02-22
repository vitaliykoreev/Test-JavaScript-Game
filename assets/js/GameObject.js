export class GameObject {
    width;
    height;
    position;
    collision; // Object Collision Dimensions
    element;

    constructor(width, height, position, collision = {}, element = null) {
        this.width = width;
        this.height = height;
        this.position = position;
        this.collision = {};

        this.collision.width = "width" in collision ? collision.width : width;
        this.collision.height = "height" in collision ? collision.height : height;
        this.collision.x = "x" in collision ? collision.x : 0;
        this.collision.y = "y" in collision ? collision.y : 0;

        if (element == null || element.nodeType !== 1) {
            this.element = document.createElement("section");
        } else {
            this.element = element;
        }

        this.element.classList.add("gameObject");
        this.element.style.display = "block";

        if (window.Config.displayObjectsBorder) {
            this.element.classList.add("border-visible");
        }

        let collisionElement = document.createElement("section");
        collisionElement.classList.add("collision");

        if (window.Config.displayObjectsCollisionModel) {
            collisionElement.classList.add("collision-visible");
        }

        collisionElement.style.width = this.collision.width + "px";
        collisionElement.style.height = this.collision.height + "px";
        collisionElement.style.left = this.collision.x + "px";
        collisionElement.style.bottom = this.collision.y + "px";

        this.element.appendChild(collisionElement);

        document.getElementById("scene").appendChild(this.element);
    }

    getPosition() {
        return this.position;
    }

    getDimensions() {
        return {width: this.width, height: this.height};
    }

    getCollision() {
        return {
            width: this.collision.width,
            height: this.collision.height,
            x: this.position.x + this.collision.x,
            y: this.position.y + this.collision.y
        };
    }

    render() {
        this.element.style.left = this.position.x + "px";
        this.element.style.bottom = this.position.y + "px";
        this.element.style.width = this.width + "px";
        this.element.style.height = this.height + "px";

        //this.element.dataset.collisionY = this.getCollision().y;
    }
}