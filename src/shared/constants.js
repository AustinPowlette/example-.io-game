module.exports = Object.freeze({
  PLAYER_RADIUS: 20,
  PLAYER_MAX_HP: 100,
  PLAYER_SPEED: 400,
  PLAYER_FIRE_COOLDOWN: 0.25,
  PLAYER_EAT_COOLDOWN: 0.25,
  POWERSTONE_EXP_GAIN: 500,

  BULLET_RADIUS: 3,
  BULLET_SPEED: 800,
  BULLET_DAMAGE: 10,

  SCORE_BULLET_HIT: 20,
  SCORE_PER_SECOND: 1,

  RESOURCE_RADIUS: 60,
  RESOURCE_SPAWN_INTERVAL: 1000,
  RESOURCE_LIMIT: 75,

  MAP_SIZE: 3000,
  MSG_TYPES: {
    JOIN_GAME: 'join_game',
    GAME_UPDATE: 'update',
    INPUT: 'input',
    GAME_OVER: 'dead',
    LCLICK: 'left_click',
    SLCLICK: 'stop_left_click',
    RCLICK: 'right_click',
    MOUSE: 'move_mouse',
    NOKEY: 'no_key',
  },
});
