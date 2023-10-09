const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Resource extends ObjectClass {
  constructor(id, x, y) {
    super(id, x, y, 0, 0);
    this.resourceNum = 200;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    return null;
  }

  takeBulletDamage() {
    this.resourceNum -= 1;
    return this.resourceNum;
  }


  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      resourceNum: this.resourceNum,
    };
  }
}

module.exports = Resource;
