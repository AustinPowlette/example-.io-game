const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.kind = 1;
    this.maxHP = Constants.PLAYER_MAX_HP;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.fire = 0;
    this.eatCooldown = 0;
    this.eat = 0;
    this.score = 0;
    this.moving = 0;
    this.stone = 0;
    this.powerStone = 0;
    this.level = 1;
    this.experience = 0;
    this.baseExperience = 100;
    this.increment = 50;
    this.experienceRequired = this.calculateExperienceRequired();

  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    this.fireCooldown -= dt;
    if (this.fireCooldown <= 0 && this.fire == 1) {
      this.fireCooldown = 0;
      this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
      return new Bullet(this.id, this.x, this.y, this.directionFace, this);
    }

    // Eat a power stone
    this.eatCooldown -= dt;
        if (this.eatCooldown <= 0 && this.eat == 1 && this.powerStone > 0) {
          this.eatCooldown += Constants.PLAYER_EAT_COOLDOWN;
          this.eat = 0;
          this.calculateExperienceRequired();
          while (this.powerStone > 0 && this.experience < this.experienceRequired)  {
            this.powerStone--;
            this.experience += Constants.POWERSTONE_EXP_GAIN;

            // Update score
            this.score += Constants.POWERSTONE_EXP_GAIN;
          }
          console.log("Experience: " + this.experience + "/" + this.experienceRequired);
          if (this.experience >= this.experienceRequired) {
            this.experience -= this.experienceRequired;
            this.level++;
            this.calculateExperienceRequired();
            this.updateStats();
            console.log("You have leveled up to level " + this.level + "!");
          }

        }

    return null;
  }

  takeBulletDamage(bullet, player) {
  //console.log("Bullet Player: " + bullet.playerID + " Player: " + player.id);
    this.hp -= Constants.BULLET_DAMAGE * Math.pow(1.3, bullet.bulletDmg);
    if (this.hp <= 0) {
      player.powerStone += this.powerStone;
      player.stone += this.stone;
    }
  }

  onDealtDamage() {
      if ((Math.random(100) * 100 )+ 1 >= 20 ) {
          this.stone += 1;
      }
      else {
          this.powerStone += 1;
      }
      console.log("" + this.stone + " " + this.powerStone);
    }

  calculateExperienceRequired() {
    this.experienceRequired = (this.baseExperience + (this.level - 1) * this.increment);
  }

  updateStats() {
    this.speed *= 1.05;
    this.maxHP *= 1.3;
    this.hp = this.maxHP;

  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      directionMove: this.directionMove,
      direction: this.directionFace,
      hp: this.hp,
      powerStone: this.powerStone,
      stone: this.stone,
      maxHP: this.maxHP,
      level: this.level,
    };
  }
}

module.exports = Player;
