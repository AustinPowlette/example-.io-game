const Constants = require('../shared/constants');
const Player = require('./player');
const Resource = require('./resource');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.resources = [];
    this.lastResourceSpawnTime = Date.now();
    this.resourceSpawnInterval = Constants.RESOURCE_SPAWN_INTERVAL; // Define this constant
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].moving = 1;
      this.players[socket.id].setDirectionMove(dir);

    }
  }

  handleMouseInput(socket, dirMouse) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirectionFace(dirMouse);
    }
  }

  attack(socket, dirLClick) {
    if (this.players[socket.id]) {
      //this.players[socket.id].
    }
  }

  fireBullet(socket, dirRClick) {
    if (this.players[socket.id]) {
      const player = this.players[socket.id];
      this.players[socket.id].setDirectionFace(dirRClick);
      player.fire = 1;
    }
  }

  stopDirection(socket, noDir) {
    if (this.players[socket.id]) {
      this.players[socket.id].moving = 0;
    }
  }

  updateResources() {
      const now = Date.now();
      if (now - this.lastResourceSpawnTime >= this.resourceSpawnInterval) {
        this.spawnResource();
        this.lastResourceSpawnTime = now;
      }
    }

    spawnResource() {
      const x = Math.random() * Constants.MAP_SIZE;
      const y = Math.random() * Constants.MAP_SIZE;
      const resource = new Resource(this.resources.length, x, y);
      this.resources.push(resource);
    }

  update() {
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update resources
    this.updateResources();

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      const newBullet = player.update(dt);
      if (newBullet) {
        newBullet.moving = 1;
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, give players score for hitting bullets
    let destroyedBullets = applyCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Apply collisions, give players score for hitting bullets
    destroyedBullets = applyCollisions(Object.values(this.resources), this.bullets, (this.players));
    destroyedBullets.forEach(b => {
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyResources = this.resources.filter(
      r => r.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      resources: nearbyResources.map(r => r.serializeForUpdate()),
      leaderboard,
    };
  }
}

module.exports = Game;
