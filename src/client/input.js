// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateMouseDirection, attack, fireBullet } from './networking';

let isUpKeyPressed = false;
let isDownKeyPressed = false;
let isLeftKeyPressed = false;
let isRightKeyPressed = false;

function onMouseInput(e) {
  //handleInput(e.clientX, e.clientY);
}

function onKeyDown(e) {
  handleKeyPress(e.key, true);
}

function onKeyUp(e) {
  handleKeyPress(e.key, false);
}

function handleKeyPress(key, isPressed) {
  switch (key) {
    case 'ArrowUp':
      isUpKeyPressed = isPressed;
      break;
    case 'ArrowDown':
      isDownKeyPressed = isPressed;
      break;
    case 'ArrowLeft':
      isLeftKeyPressed = isPressed;
      break;
    case 'ArrowRight':
      isRightKeyPressed = isPressed;
      break;
  }

  updateDirection(calculateDirection());
}

function calculateDirection() {
  let x = 0;
  let y = 0;

  if (isUpKeyPressed) {
    y += 1;
  }
  if (isDownKeyPressed) {
    y -= 1;
  }
  if (isLeftKeyPressed) {
    x -= 1;
  }
  if (isRightKeyPressed) {
    x += 1;
  }

  //console.log("" + Math.atan2(x, y));
  return Math.atan2(x, y);
}

function handleInput(x, y) {
  //const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
  //updateDirection(dir);
}

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
}