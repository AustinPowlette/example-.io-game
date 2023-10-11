const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir, parent) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.kind = 2;
    this.moving = 1;
    this.parent = parent;
    this.bulletSize = parent.level - 1;
    this.bulletDmg = parent.level - 1;
    this.speed *= Math.pow(1.05, parent.level - 1);
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }

  serializeForUpdate() {
      return {
        ...(super.serializeForUpdate()),
        parentID: this.parentID,
        bulletSize: this.bulletSize,
        bulletDmg: this.bulletDmg,
        parent: this.parent,
      };
    }
}

module.exports = Bullet;
