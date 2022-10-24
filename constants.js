// Moves
export const PLAYER1_MOVES = ['a', 'd', 'w', 's'];
export const PLAYER2_MOVES = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
export const KEYS = {
	'w': {
		pressed: false,
	},
    'a': {
        pressed: false,
    },
    'd': {
        pressed: false,
    },
	's': {
		pressed: false,
	},
	'ArrowUp': {
		pressed: false,
	},
    'ArrowLeft': {
        pressed: false,
    },
    'ArrowRight': {
        pressed: false,
    },
    'ArrowDown': {
        pressed: false,
    },
}

// Physics
export const JUMP_FORCE = -20;
export const MOVE_SPEED = 5;
export const GRAVITY = 0.9;

// Sizes
export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 576;
export const SPRITE_WIDTH = 50;
export const SPRITE_HEIGHT = 150;
export const HEALTH_BAR_WIDTH = 400;
export const HEALTH_BAR_HEIGHT = 50;
export const ATK_BOX_WIDTH = 100;
export const ATK_BOX_HEIGHT = 50;
export const ATK_OFFSET = 50;

// Sprites
export const PLAYER1_SPRITE = {
	position: {
		x: 0,
		y: CANVAS_HEIGHT - SPRITE_HEIGHT,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: 'green',
	offset: {
		x: 0,
		y: 0,
	},
	healthBarPosition: {
		x: 0,
		y: 0,
		direction: 'left',
	},
}
export const PLAYER2_SPRITE = {
	position: {
		x: CANVAS_WIDTH - SPRITE_WIDTH,
		y: CANVAS_HEIGHT - SPRITE_HEIGHT,
	},
	velocity: {
		x: 0,
		y: 10
	},
	color: 'red',
	offset: {
		x: ATK_OFFSET,
		y: 0,
	},
	healthBarPosition: {
		x: CANVAS_WIDTH - HEALTH_BAR_WIDTH,
		y: 0,
		direction: 'right',
	},
}