
PowerGym.Prefabs.PlayerLvl4 = function(game, x, y) {

  this.game = game;

  this._repFrac = 0;
  this.flattened = false;

  this.bodySprite = game.add.sprite(0, 0, "playerLvl4", 0);
  this.bodySprite.animations.add("rep", [0, 1, 2, 3, 4, 5, 6], 6, false);
  this.bodySprite.animations.add("flatten", [7, 8, 9, 10, 11, 12, 13, 14, 15], 6, false);
  this.bodySprite.animations.play("rep");
  this.bodySprite.animations.paused = true;

}

PowerGym.Prefabs.PlayerLvl4.prototype = {

  update: function() { },

  updatePlayerRepFrame: function() {

    var frameCount = this.bodySprite.animations.currentAnim.frameTotal
      , newFrame = Math.round((frameCount - 1) * this.repFrac);
    this.bodySprite.animations.currentAnim.frame = newFrame;

  },

  flatten: function() {

    this.bodySprite.animations.paused = false;
    var currentAnim = this.bodySprite.animations.currentAnim;
    currentAnim.speed = 32;
    currentAnim.onComplete.add(function() {
      this.bodySprite.animations.play("flatten", 10);
    }, this);
    this.flattened = true;

  }

}

Object.defineProperty(PowerGym.Prefabs.PlayerLvl4.prototype, 'repFrac', {

  set: function(value) {

    if (!this.flattened) {
      value = Phaser.Math.clamp(value, 0, 1);

      this._repFrac = value;
      this.updatePlayerRepFrame();
    }

  },

  get: function() {

    return this._repFrac;

  }

});
