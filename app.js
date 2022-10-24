import { checkAtk, checkPosition } from './functions.js';
import {
	GRAVITY,
	ENEMY_MOVES,
	JUMP_FORCE,
	KEYS,
	MOVE_SPEED,
	PLAYER_MOVES,
	HEALTH_BAR_WIDTH,
	HEALTH_BAR_HEIGHT,
	ATK_BOX_WIDTH,
	SPRITE_HEIGHT,
	SPRITE_WIDTH,
	ATK_BOX_HEIGHT,
	ATK_OFFSET,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	PLAYER_SPRITE,
	ENEMY_SPRITE,
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
		this.health = 100;
		this.healthBar = {
			position: healthBarPosition,
			direction: healthBarPosition.direction,
			width: HEALTH_BAR_WIDTH,
			height: HEALTH_BAR_HEIGHT,
		};
		this.imune = false;
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
			this.velocity.y = 0;
			this.position.y = canvas.height - this.height;
			this.jumpLock = false;
		} else {
			this.velocity.y += GRAVITY;
		}
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}

const player = new Sprite(PLAYER_SPRITE);
const enemy = new Sprite(ENEMY_SPRITE);

let timer = 30;
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
	player.update();
	enemy.update();

	player.velocity.x = 0;
	enemy.velocity.x = 0;

	if (!gameOver) {
		if (KEYS.a.pressed && player.lastKey === 'a' && player.position.x >= 0) {
			player.velocity.x = -MOVE_SPEED;
		} else if (KEYS.d.pressed && player.lastKey === 'd' && player.position.x + player.width <= canvas.width) {
			player.velocity.x = MOVE_SPEED;
		}
	
		if (KEYS.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x >= 0) {
			enemy.velocity.x = -MOVE_SPEED;
		} else if (KEYS.ArrowRight.pressed && enemy.lastKey === 'ArrowRight' && enemy.position.x + enemy.width <= canvas.width) {
			enemy.velocity.x = MOVE_SPEED;
		}
	
		if (KEYS.w.pressed && !player.jumpLock) {
			player.velocity.y = JUMP_FORCE;
			player.jumpLock = true;
		} if (KEYS.ArrowUp.pressed && !enemy.jumpLock) {
			enemy.velocity.y = JUMP_FORCE;
			enemy.jumpLock = true;
		}
	
		if (checkAtk(player, enemy) && player.isAttacking) {
			player.isAttacking = false;
			
			if (enemy.health > 0 && !enemy.imune) {
				enemy.health -= 10;
				enemy.imune = true;
				setTimeout(() => {
					enemy.imune = false;
				}, 250);
			}
			
			if (enemy.health === 0) {
				gameOver = true;
				document.querySelector('#player1-wins').style.display = 'flex'
			}
		} if (checkAtk(enemy, player) && enemy.isAttacking) {
			enemy.isAttacking = false;
	
			if (player.health > 0 && !player.imune) {
				player.health -= 10;
				player.imune = true;
				setTimeout(() => {
					player.imune = false;
				}, 250);
			}
			
			if (player.health === 0) {
				gameOver = true;
				document.querySelector('#player2-wins').style.display = 'flex';
			}
		}
	
		if (timer === 0 && !gameOver) {
			gameOver = true;
	
			if (player.health > enemy.health)
				document.querySelector('#player1-wins').style.display = 'flex';
			else if (enemy.health > player.health)
				document.querySelector('#player2-wins').style.display = 'flex';
			else
				document.querySelector('#tie').style.display = 'flex';
		}
	}

	if (checkPosition(player, enemy)) {
		player.atkbox.offset.x = ATK_OFFSET;
	} else {
		player.atkbox.offset.x = 0;
	}

	if (checkPosition(enemy, player)) {
		enemy.atkbox.offset.x = ATK_OFFSET;
	} else {
		enemy.atkbox.offset.x = 0;
	}
}

decreaseTimer();
animate();

window.addEventListener('keydown', event => {
	if (PLAYER_MOVES.includes(event.key)) {
		KEYS[event.key].pressed = true;
		if (event.key !== 'w' && event.key !== 's') {
			player.lastKey = event.key;
		} if (event.key === 's' && !gameOver) {
			player.attack();
		}
	} else if (ENEMY_MOVES.includes(event.key)) {
		KEYS[event.key].pressed = true;
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
			enemy.lastKey = event.key;
		} if (event.key === 'ArrowDown' && !gameOver) {
			enemy.attack();
		}
	}
});

window.addEventListener('keyup', event => {
	if (PLAYER_MOVES.includes(event.key) || ENEMY_MOVES.includes(event.key)) {
		KEYS[event.key].pressed = false;
	}
});
