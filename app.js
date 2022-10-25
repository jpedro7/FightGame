import { checkAtk, checkPosition } from './functions.js';
import {
	GRAVITY,
	PLAYER2_MOVES,
	JUMP_FORCE,
	KEYS,
	MOVE_SPEED,
	PLAYER1_MOVES,
	HEALTH_BAR_WIDTH,
	HEALTH_BAR_HEIGHT,
	ATK_BOX_WIDTH,
	SPRITE_HEIGHT,
	SPRITE_WIDTH,
	ATK_BOX_HEIGHT,
	ATK_OFFSET,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	PLAYER1_SPRITE,
	PLAYER2_SPRITE,
	KNOCKBACK_X,
	KNOCKBACK_Y,
	ATK_DMG,
	BASE_HEALTH,
	GAME_TIME,
} from './constants.js';

let gameOver = false;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

ctx.fillRect(0, 0, canvas.width, canvas.height);

class Sprite {

	constructor({
		position,
		velocity,
		color = 'red',
		offset,
		healthBarPosition
	}) {
		this.position = position;
		this.velocity = velocity;
		this.height = SPRITE_HEIGHT;
		this.width = SPRITE_WIDTH;
		this.jumpLock = false;
		this.lastKey;
		this.atkbox = {
			position: {
				x: this.position.x,
				y: this.position.y,
			},
			width: ATK_BOX_WIDTH,
			height: ATK_BOX_HEIGHT,
			offset: offset,
		};
		this.color = color;
		this.isAttacking = false;
		this.health = BASE_HEALTH;
		this.healthBar = {
			position: healthBarPosition,
			direction: healthBarPosition.direction,
			width: HEALTH_BAR_WIDTH,
			height: HEALTH_BAR_HEIGHT,
		};
		this.imune = false;
		this.moveLock = false;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

		if (this.isAttacking) {
			ctx.fillStyle = 'yellow';
			ctx.fillRect(this.atkbox.position.x, this.atkbox.position.y, this.atkbox.width, this.atkbox.height);
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

	update() {
		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		this.atkbox.position.x = this.position.x - this.atkbox.offset.x;
		this.atkbox.position.y = this.position.y;

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

const player1 = new Sprite(PLAYER1_SPRITE);
const player2 = new Sprite(PLAYER2_SPRITE);

let timer = GAME_TIME;
const timerEl = document.querySelector('#timer');
timerEl.innerHTML = timer;
function decreaseTimer() {
	setTimeout(() => {
		if (timer > 0 && !gameOver) {
			timer--;
			timerEl.innerHTML = timer;
			decreaseTimer();
		} else gameOver = true;
	}, 1000);
}

function animate() {
	window.requestAnimationFrame(animate);
	ctx.fillStyle = 'black';
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	player1.update();
	player2.update();

	if (!player1.moveLock) player1.velocity.x = 0;
	if (!player2.moveLock) player2.velocity.x = 0;

	if (!gameOver) {
		if (KEYS.a.pressed && player1.lastKey === 'a' && !player1.moveLock) {
			player1.velocity.x = -MOVE_SPEED;
		} else if (KEYS.d.pressed && player1.lastKey === 'd' && !player1.moveLock) {
			player1.velocity.x = MOVE_SPEED;
		}

		if (KEYS.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft' && !player2.moveLock) {
			player2.velocity.x = -MOVE_SPEED;
		} else if (KEYS.ArrowRight.pressed && player2.lastKey === 'ArrowRight' && !player2.moveLock) {
			player2.velocity.x = MOVE_SPEED;
		}

		if (KEYS.w.pressed && !player1.jumpLock) {
			player1.velocity.y = JUMP_FORCE;
			player1.jumpLock = true;
		} if (KEYS.ArrowUp.pressed && !player2.jumpLock) {
			player2.velocity.y = JUMP_FORCE;
			player2.jumpLock = true;
		}

		if (checkAtk(player1, player2) && player1.isAttacking) {
			player1.isAttacking = false;

			if (player2.health > 0 && !player2.imune) {
				player2.health -= ATK_DMG;

				player2.moveLock = true;
				player2.jumpLock = true;
				player2.velocity.y = -KNOCKBACK_Y;

				if (checkPosition(player2, player1))
					player2.velocity.x += KNOCKBACK_X;
				else
					player2.velocity.x -= KNOCKBACK_X;

				player2.imune = true;
				setTimeout(() => {
					player2.imune = false;
				}, 250);
			}

			if (player2.health === 0) {
				gameOver = true;
				document.querySelector('#player1-wins').style.display = 'flex'
			}
		} if (checkAtk(player2, player1) && player2.isAttacking) {
			player2.isAttacking = false;

			if (player1.health > 0 && !player1.imune) {
				player1.health -= ATK_DMG;

				player1.moveLock = true;
				player1.jumpLock = true;
				player1.velocity.y = -KNOCKBACK_Y;

				if (checkPosition(player1, player2))
					player1.velocity.x += KNOCKBACK_X;
				else
					player1.velocity.x -= KNOCKBACK_X;

				player1.imune = true;
				setTimeout(() => {
					player1.imune = false;
				}, 250);
			}

			if (player1.health === 0) {
				gameOver = true;
				document.querySelector('#player2-wins').style.display = 'flex';
			}
		}

		if (timer === 0 && !gameOver) {
			gameOver = true;

			if (player1.health > player2.health)
				document.querySelector('#player1-wins').style.display = 'flex';
			else if (player2.health > player1.health)
				document.querySelector('#player2-wins').style.display = 'flex';
			else
				document.querySelector('#tie').style.display = 'flex';
		}
	}

	if (checkPosition(player1, player2)) {
		player1.atkbox.offset.x = ATK_OFFSET;
	} else {
		player1.atkbox.offset.x = 0;
	}

	if (checkPosition(player2, player1)) {
		player2.atkbox.offset.x = ATK_OFFSET;
	} else {
		player2.atkbox.offset.x = 0;
	}
}

decreaseTimer();
animate();

window.addEventListener('keydown', event => {
	if (PLAYER1_MOVES.includes(event.key)) {
		KEYS[event.key].pressed = true;
		if (event.key !== 'w' && event.key !== 's') {
			player1.lastKey = event.key;
		} if (event.key === 's' && !gameOver) {
			player1.attack();
		}
	} else if (PLAYER2_MOVES.includes(event.key)) {
		KEYS[event.key].pressed = true;
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
			player2.lastKey = event.key;
		} if (event.key === 'ArrowDown' && !gameOver) {
			player2.attack();
		}
	}
});

window.addEventListener('keyup', event => {
	if (PLAYER1_MOVES.includes(event.key) || PLAYER2_MOVES.includes(event.key)) {
		KEYS[event.key].pressed = false;
	}
});
