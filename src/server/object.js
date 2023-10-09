class Object {

  constructor(id, x, y, dir, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.directionMove = dir;
    this.directionFace = dir;
    this.speed = speed;
    this.moving = 0;
  }

  update(dt) {
  if (this.moving == 1) {
    this.x += dt * this.speed * Math.sin(this.directionMove);
    this.y -= dt * this.speed * Math.cos(this.directionMove);
  }

  }

  distanceTo(object) {
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  setDirectionMove(dir) {
    this.directionMove = dir;
  }
  setDirectionFace(dir) {
    this.directionFace = dir;
  }

  serializeForUpdate() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      moving: this.moving,
    };
  }
}

module.exports = Object;
