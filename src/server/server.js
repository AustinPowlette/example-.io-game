const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const socketio = require('socket.io');

const Constants = require('../shared/constants');
const Game = require('./game');
const webpackConfig = require('../../webpack.dev.js');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  socket.on(Constants.MSG_TYPES.MOUSE, handleMouseInput);
  socket.on(Constants.MSG_TYPES.LCLICK, fireBullet);
  socket.on(Constants.MSG_TYPES.RCLICK, eatStone);
  socket.on(Constants.MSG_TYPES.NOKEY, stopDirection);
  socket.on(Constants.MSG_TYPES.SLCLICK, stopClick);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function handleMouseInput(dirMouse) {
  game.handleMouseInput(this, dirMouse);
}

function eatStone(dirRClick) {
  game.eatStone(this, dirRClick);
}

function fireBullet(dirLClick) {
  game.fireBullet(this, dirLClick);
}

function stopDirection(noDir) {
  game.stopDirection(this, noDir);
}

function stopClick(dirSLClick) {
  game.stopClick(this, dirSLClick);
}

function onDisconnect() {
  game.removePlayer(this);
}
