const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.fire = 0;
    this.score = 0;
    this.moving = 0;
    this.stone = 0;
    this.powerStone = 0;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Update score
    this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 && this.fire == 1) {
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      this.fire = 0;
      return new Bullet(this.id, this.x, this.y, this.directionFace);
    }

    this.fire = 0;
    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  onDealtDamage(resources) {
      if ((Math.random(100) * 100 )+ 1 >= 20 ) {
          this.stone += 1;
      }
      else {
          this.powerStone += 1;
      }
    }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      directionMove: this.directionMove,
      direction: this.directionFace,
      hp: this.hp,
    };
  }
}

module.exports = Player;
