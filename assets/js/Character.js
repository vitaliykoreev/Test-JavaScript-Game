import { GameObject } from "./GameObject.js";

export class Character extends GameObject {
    positionDelta;
    direction; // Character direction
    speed;
    gravity;
    isOnGround;
    jumpPower;
    isInCollision;

    constructor(dimensions, position, speed, direction, collision, element = null) {
        super(dimensions.width, dimensions.height, position, collision, element);

        this.speed = parseFloat(speed);
        this.direction = direction;
        this.isOnGround = false;
        this.gravity = .5; // .5;
        this.jumpPower = 12;
        this.positionDelta = {x: 0, y: 0};
        this.isInCollision = false;
    }

    move(direction) {
        if (this.isOnGround && this.isInCollision) {
            this.element.classList.add('walk');

            switch (direction) {
                case 'LEFT':
                    this.positionDelta.x = -this.speed;
                    this.direction = -1;
                    break;
                case 'RIGHT':
                    this.positionDelta.x = this.speed;
                    this.direction = 1;
                    break;
            }
        }
    }

    jump() {
        if (this.isOnGround) {
            this.element.classList.add('jump');
            this.positionDelta.y = this.jumpPower;

            if (this.direction === 1) {
                this.positionDelta.x = this.speed;
            } else if (this.direction === -1) {
                this.positionDelta.x = -this.speed;
            }
        }
    }

    setDirection(direction) {
        this.direction = direction;
    }

    stop() {
        this.element.classList.remove('walk');
    }

    isOnObject(gameObject) {
        return (
            this.getCollision().y <= gameObject.getCollision().y + gameObject.getCollision().height &&
            this.getCollision().y >= gameObject.getCollision().y + gameObject.getCollision().height - 18 &&
            this.getCollision().x + this.getCollision().width >= gameObject.getCollision().x &&
            this.getCollision().x <= gameObject.getCollision().x + gameObject.getCollision().width
        );
    }

    isCollisionX(gameObject) {
        return (
            this.getCollision().x + this.getCollision().width >= gameObject.getCollision().x &&
            this.getCollision().x <= gameObject.getCollision().x + gameObject.getCollision().width &&
            ((
                this.getCollision().y + this.getCollision().height >= gameObject.getCollision().y + gameObject.getCollision().height &&
                this.getCollision().y <= gameObject.getCollision().y
            )
            ||
            (
                this.getCollision().y + this.getCollision().height <= gameObject.getCollision().y + gameObject.getCollision().height &&
                this.getCollision().y >= gameObject.getCollision().y
            )
            ||
            (
                this.getCollision().y + this.getCollision().height <= gameObject.getCollision().y + gameObject.getCollision().height &&
                this.getCollision().y + this.getCollision().height >= gameObject.getCollision().y + this.speed
            )
            // ||
            // (
            //     this.getCollision().y + this.getCollision().height > gameObject.getCollision().y + gameObject.getCollision().height &&
            //     this.getCollision().y <= gameObject.getCollision().y + gameObject.getCollision().height
            // )
            // ||
            // (
            //     this.getCollision().y + this.getCollision().height >= gameObject.getCollision().y + gameObject.getCollision().height &&
            //     this.getCollision().y > gameObject.getCollision().y &&
            //     this.getCollision().y < gameObject.getCollision().y + gameObject.getCollision().height
            // )
            )
        );
    }

    isCollision(gameObject) {
        return (
            this.getCollision().x < gameObject.getCollision().x + gameObject.getCollision().width &&
            this.getCollision().x + this.getCollision().width > gameObject.getCollision().x &&
            this.getCollision().y < gameObject.getCollision().y + gameObject.getCollision().height &&
            this.getCollision().y + this.getCollision().height > gameObject.getCollision().y
        );
    }

    update(objects) {
        this.positionDelta.y -= this.gravity;
        this.positionDelta.y *= .999;
        this.positionDelta.x *= this.isOnGround ? .5 : .999;
        this.position.x += this.positionDelta.x;
        this.position.y += this.positionDelta.y;

        for (let i = 0; i < objects.length; i++) {
            if (this.isCollisionX(objects[i])) {
                if (this.direction === 1) {
                    this.position.x = objects[i].getCollision().x - this.getCollision().width - this.speed;
                } else if (this.direction === -1) {
                    this.position.x = objects[i].getCollision().x + objects[i].getCollision().width - this.speed;
                }

                this.element.classList.remove("walk");
                this.positionDelta.x = 0;
                break;
            }
        }

        // Is player collided any object
        for (let i = 0; i < objects.length; i++) {
            if (this.isCollision(objects[i])) {
                if (this.isOnObject(objects[i])) {
                    this.position.y = objects[i].getCollision().y + objects[i].getCollision().height;
                    this.positionDelta.y = 0;
                    this.isOnGround = true;
                    this.element.classList.remove("jump");
                    this.element.classList.remove("fall");
                } else {
                    if (this.isCollisionX(objects[i])) {
                        if (this.direction === 1) {
                            this.position.x = objects[i].getCollision().x - this.getCollision().width - this.speed;
                        } else if (this.direction === -1) {
                            this.position.x = objects[i].getCollision().x + objects[i].getCollision().width - this.speed;
                        }

                        this.element.classList.remove("walk");
                        this.positionDelta.x = 0;

                    } else {
                        //this.isOnGround = false;

                        if (this.getCollision().y + this.getCollision().height <= objects[i].getCollision().y + this.speed) {
                            this.isOnGround = false;
                            this.position.y = objects[i].getCollision().y - this.getCollision().height;
                            this.positionDelta.y = 0;
                        }
                    }
                }

                this.isInCollision = true;

                break;
            } else {
                this.isInCollision = false;
                this.isOnGround = false;

                if (!this.element.classList.contains("jump")) {
                    this.element.classList.remove("jump");
                    this.element.classList.add("fall");
                }
            }
        }
    }

    // Display object on scene
    render() {
        this.element.classList.add("character");
        this.element.style.transform = "scaleX(" + this.direction + ")";

        super.render();
    }
}