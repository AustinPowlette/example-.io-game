// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, RESOURCE_RADIUS } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

function setCanvasDimensions() {
  // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
  // 800 in-game units of width.
  const scaleRatio = Math.max(1, 800 / window.innerWidth);
  canvas.width = scaleRatio * window.innerWidth;
  canvas.height = scaleRatio * window.innerHeight;
}

window.addEventListener('resize', debounce(40, setCanvasDimensions));

let animationFrameRequestId;

function render() {
  const { me, others, bullets, resources } = getCurrentState();
  if (me) {
    // Draw background
    renderBackground(me.x, me.y);

    // Draw boundaries
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

    // Draw all bullets
    bullets.forEach(renderBullet.bind(null, me));

    // Draw all resources
    resources.forEach(renderResource.bind(null, me));

    // Draw all players
    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));
  }

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(render);
}

function renderBackground(x, y) {
  const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE / 10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  //backgroundGradient.addColorStop(0.5, 'white');
  backgroundGradient.addColorStop(1, 'gray');
  //backgroundGradient.addColorStop(0, 'yellow');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('Cultivator.png'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  // Draw health bar
  if (player.level - me.level > 10) {
    context.fillStyle = 'red';
  }
  else if (player.level - me.level < -10) {
    context.fillStyle = 'blue';
  }
  else {
    context.fillStyle = 'green';
  }
  //context.fillStyle = 'green';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (player.hp / player.maxHP),
    2,
  );
  context.fillStyle = 'black';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * (player.hp / player.maxHP),
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 - PLAYER_RADIUS * 2 * (player.hp / player.maxHP),
    2,
  );

// Draw number of power stones
if (me.id === player.id) {
context.fillStyle = 'white';
context.font = '12px Arial';
context.fillText('Power Stones: ' + me.powerStone, canvasX - (PLAYER_RADIUS * 2), canvasY + PLAYER_RADIUS + 24);
}}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('fireball.png'),
    canvas.width / 2 + x - me.x - (BULLET_RADIUS + (bullet.bulletSize / 2)),
    canvas.height / 2 + y - me.y - (BULLET_RADIUS + (bullet.bulletSize / 2)),
    ((BULLET_RADIUS * 8) + bullet.bulletSize),
    ((BULLET_RADIUS * 8) + bullet.bulletSize),
  );
}

function renderResource(me, resource) {
  const { x, y} = resource;
  context.drawImage(
    getAsset('Stone.png'),
    canvas.width / 2 + x - me.x,
    canvas.height / 2 + y - me.y,
    RESOURCE_RADIUS,
    RESOURCE_RADIUS,
    );
}

function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);

  // Rerun this render function on the next frame
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// Replaces main menu rendering with game rendering.
export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

// Replaces game rendering with main menu rendering.
export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}
