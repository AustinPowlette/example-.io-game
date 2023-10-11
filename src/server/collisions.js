const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < players.length; j++) {
      const bullet = bullets[i];
      const player = players[j];
      if (
        bullet.parentID !== player.id &&
        player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        player.takeBulletDamage(bullet);
        break;
      }
    }
  }
  return destroyedBullets;
}

function applyCollisions(resources, bullets, players) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    for (let j = 0; j < resources.length; j++) {
      const bullet = bullets[i];
      const resource = resources[j];
      if (
        bullet.parentID != resource.id &&
        resource.distanceTo(bullet) <= Constants.RESOURCE_RADIUS + Constants.BULLET_RADIUS
      ) {
        destroyedBullets.push(bullet);
        resource.takeBulletDamage();
        bullet.parent.onDealtDamage(resource);

        break;
      }
    }
  }
  return destroyedBullets;
}

module.exports = applyCollisions;
