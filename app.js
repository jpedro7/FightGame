import { Player, Sprite } from './classes.js';
import { checkAtk, checkPosition } from './functions.js';
import {
	PLAYER2_MOVES,
	JUMP_FORCE,
	KEYS,
	MOVE_SPEED,
	PLAYER1_MOVES,
	ATK_OFFSET,
	CANVAS_WIDTH,
	CANVAS_HEIGHT,
	PLAYER1_SPRITE,
	PLAYER2_SPRITE,
	KNOCKBACK_X,
	KNOCKBACK_Y,
	ATK_DMG,
	GAME_TIME,
} from './constants.js';

let timer = GAME_TIME;
let gameOver = false;

const timerEl = document.querySelector('#timer');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	imageSrc: './assets/background.png',
});
const player1 = new Player(PLAYER1_SPRITE);
const player2 = new Player(PLAYER2_SPRITE);

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.fillRect(0, 0, canvas.width, canvas.height);

function decreaseTimer() {
	timerEl.innerHTML = timer;
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

	background.update(ctx);
	player1.update(ctx, canvas);
	player2.update(ctx, canvas);

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

		if (checkPosition(player1, player2)) {
			player1.atkBox.offset.x = ATK_OFFSET;
		} else {
			player1.atkBox.offset.x = 0;
		}
	
		if (checkPosition(player2, player1)) {
			player2.atkBox.offset.x = ATK_OFFSET;
		} else {
			player2.atkBox.offset.x = 0;
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
