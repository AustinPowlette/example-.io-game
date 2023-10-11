// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#6-client-input-%EF%B8%8F
import { updateDirection, updateMouseDirection, eatStone, fireBullet, stopDirection, stopClick } from './networking';

let isUpKeyPressed = false;
let isDownKeyPressed = false;
let isLeftKeyPressed = false;
let isRightKeyPressed = false;

function onMouseInput(e) {
  const dirMouse = Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
  updateMouseDirection(dirMouse);


  if (e.type === 'mousedown' && e.button === 0) {
    fireBullet(dirMouse);
  }

  else if (e.type === 'mouseup' && e.button === 0) {
    stopClick(dirMouse);
  }


}

function onClick(e) {
  //console.log("Left Click");
  //const dirLClick = Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
  //fireBullet(dirLClick);
}

function onContextMenu(e) {
  e.preventDefault();
  const dirRClick = Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
  eatStone(dirRClick);

}

function onKeyDown(e) {
  handleKeyPress(e.key, true);
}

function onKeyUp(e) {
  handleKeyPress(e.key, false);
}

function handleKeyPress(key, isPressed) {
  switch (key) {
    case 'w':
      isUpKeyPressed = isPressed;
      break;
    case 's':
      isDownKeyPressed = isPressed;
      break;
    case 'a':
      isLeftKeyPressed = isPressed;
      break;
    case 'd':
      isRightKeyPressed = isPressed;
      break;
  }

  if (isUpKeyPressed || isDownKeyPressed || isRightKeyPressed || isLeftKeyPressed) {
    updateDirection(calculateDirection());
  }
  else {
    stopDirection(0);
  }

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

export function startCapturingInput() {
  window.addEventListener('mousemove', onMouseInput);
  window.addEventListener('click', onMouseInput);
  window.addEventListener('mousedown', onMouseInput);
  window.addEventListener('mouseup', onMouseInput);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('click', onClick);
  window.addEventListener('contextmenu', onContextMenu);
}

export function stopCapturingInput() {
  window.removeEventListener('mousemove', onMouseInput);
  window.removeEventListener('click', onMouseInput);
  window.removeEventListener('mousedown', onMouseInput);
  window.removeEventListener('mouseup', onMouseInput);
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  window.removeEventListener('click', onClick);
  window.removeEventListener('contextmenu', onContextMenu);
}