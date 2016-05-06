
PowerGym.Prefabs.PlayerLvl3 = function(game, x, y) {

  this.game = game;
  this._health = 100;
  this.runMinFrameRate = 5;

  // GROUPS

  this.bodyGr = game.add.group(game.world, "playerLvl2");

  this.bodySprite = game.add.sprite(0, 0, "playerLvl3Run", 0, this.bodyGr);
  this.bodySprite.animations.add("run", [0, 1, 2, 3, 4], 6, true);
  this.bodySprite.animations.play("run");

  this.bodyGr.x = x;
  this.bodyGr.y = y;

}

PowerGym.Prefabs.PlayerLvl3.prototype = {

  update: function() { }

}

Object.defineProperty(PowerGym.Prefabs.PlayerLvl3.prototype, 'health', {

  set: function(value) {
    value = Phaser.Math.clamp(value, 0, 100);

    this._health = value;
    this.changeHeadTint();
  },

  get: function() {
    return this._health;
  }

});

Object.defineProperty(PowerGym.Prefabs.PlayerLvl3.prototype, 'runSpeed', {

  set: function(value) {

    var currentAnim = this.bodySprite.animations.currentAnim;
    if (currentAnim.name == "run") {
      var frameRate = Math.round(this.runMinFrameRate + Math.max(0, value));
      currentAnim.delay = 1000 / frameRate;
    }

  },

  get: function() {

    var currentAnim = this.bodySprite.animations.currentAnim;
    if (currentAnim.name == "run") {
      return 1000 / currentAnim.delay;
    } else {
      return 0;
    }

  }

});
