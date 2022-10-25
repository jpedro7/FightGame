import {
    ATK_BOX_HEIGHT,
    ATK_BOX_WIDTH,
    BASE_HEALTH,
    GRAVITY,
    HEALTH_BAR_HEIGHT,
    HEALTH_BAR_WIDTH,
    PLAYER_HEIGHT,
    PLAYER_WIDTH,
} from "./constants.js";

export class Sprite {

    constructor({
        position,
        imageSrc,
    }) {
        this.position = position;
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y);
    }

    update(ctx) {
        this.draw(ctx);
    }
}

export class Player {

    constructor({
        position,
        color,
        healthBarPosition
    }) {
        this.position = position;
        this.velocity = {
            x: 0,
            y: 0,
        };
        this.width = PLAYER_WIDTH;
        this.height = PLAYER_HEIGHT;
        this.jumpLock = false;
        this.lastKey;
        this.atkBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: ATK_BOX_WIDTH,
            height: ATK_BOX_HEIGHT,
            offset: {
                x: 0,
                y: 0,
            },
        };
        this.color = color;
        this.isAttacking = false;
        this.health = BASE_HEALTH;
        this.healthBar = {
            position: healthBarPosition,
            direction:healthBarPosition.direction,
            width: HEALTH_BAR_WIDTH,
            height: HEALTH_BAR_HEIGHT,
        };
        this.imune = false;
        this.moveLock = false;
    }

    draw(ctx) {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		if (this.isAttacking) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(this.atkBox.position.x, this.atkBox.position.y, this.atkBox.width, this.atkBox.height);
		}

		ctx.fillStyle = 'yellow';
		ctx.fillRect(this.healthBar.position.x, this.healthBar.position.y, this.healthBar.width, this.healthBar.height);

		ctx.fillStyle = 'red';
		if (this.healthBar.position.direction === 'left') {
			ctx.fillRect(
				this.healthBar.position.x + this.health * HEALTH_BAR_WIDTH / 100,
				this.healthBar.position.y,
				this.healthBar.width - this.health * HEALTH_BAR_WIDTH / 100,
				this.healthBar.height
			);
		} else if (this.healthBar.position.direction === 'right') {
			ctx.fillRect(
				this.healthBar.position.x,
				this.healthBar.position.y,
				this.healthBar.width - this.health * HEALTH_BAR_WIDTH / 100,
				this.healthBar.height
			);
		}
	}

    update(ctx, canvas) {
		this.draw(ctx);
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		this.atkBox.position.x = this.position.x - this.atkBox.offset.x;
		this.atkBox.position.y = this.position.y;

		if (this.position.y + this.height >= canvas.height) {
			this.position.y = canvas.height - this.height;
			this.velocity.y = 0;
			this.jumpLock = false;
			this.moveLock = false;
		} else {
			this.velocity.y += GRAVITY;
		}

		if (this.position.x <= 0) {
			this.position.x = 0;
		} else if (this.position.x >= canvas.width - this.width) {
			this.position.x = canvas.width - this.width;
		}
	}

    attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}