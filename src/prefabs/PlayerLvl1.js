
PowerGym.Prefabs.PlayerLvl1 = function(game, x, y) {

  this.isReady = false;

  // Group
  this.body = game.add.group(game.world, "player");

  this._head = game.add.sprite(0, 0, "playerLvl1Head", 0, this.body);
  this._head.anchor.setTo(0.5, 0.5);
  this._head.x = 180;
  this._head.y = 207;

  this._body = game.add.sprite(0, 0, "playerLvl1Body", 0, this.body);
  this._body.anchor.setTo(0.5, 0.5);
  this._body.x = 332;
  this._body.y = 346;

  this._bar = game.add.sprite(0, 0, "lvl1Bar" + PowerGym.GameData.lvl1Difficulty, 34, this.body);
  this._bar.anchor.setTo(0.5, 0.5);
  this._bar.x = 190;
  this._bar.y = 168;

  this._bar.animations.add("pressRight2", [0, 1, 2, 3, 4]);
  this._bar.animations.add("pressRight", [5, 6, 7, 8, 9]);
  this._bar.animations.add("pressLeft2", [10, 11, 12, 13, 14]);
  this._bar.animations.add("pressLeft", [15, 16, 17, 18, 19]);
  this._bar.animations.add("pressCenter", [20, 21, 22, 23, 24]);
  this._bar.animations.add("start", [34, 33, 32, 31, 30, 29, 28, 27, 26, 25]);

  this._arms = game.add.sprite(0, 0, "playerLvl1Arms", 34, this.body);
  this._arms.anchor.setTo(0.5, 0.5);
  this._arms.x = 200;
  this._arms.y = 220;

  this._arms.animations.add("pressRight2", [0, 1, 2, 3, 4]);
  this._arms.animations.add("pressRight", [5, 6, 7, 8, 9]);
  this._arms.animations.add("pressLeft2", [10, 11, 12, 13, 14]);
  this._arms.animations.add("pressLeft", [15, 16, 17, 18, 19]);
  this._arms.animations.add("pressCenter", [20, 21, 22, 23, 24]);
  this._arms.animations.add("start", [34, 33, 32, 31, 30, 29, 28, 27, 26, 25]);

  this._arms.animations.stop("start");

  // When start animations is completed player is set to ready
  this._arms.animations.getAnimation("start").onComplete.add(function() {
    this.isReady = true;
  }, this);

  this.body.x = x;
  this.body.y = y;

};

PowerGym.Prefabs.PlayerLvl1.prototype = {

  update: function() {

    if (typeof this._balance != "undefined") {

      var toBePlayedAnimName;

      // Balance fuzzy logic
      if (this._balance < 0.2) {
        toBePlayedAnimName = "pressLeft2";
      } else if (this._balance >= 0.2 && this._balance < 0.4) {
        toBePlayedAnimName = "pressLeft";
      } else if (this._balance >= 0.4 && this._balance < 0.6) {
        toBePlayedAnimName = "pressCenter";
      } else if (this._balance >= 0.6 && this._balance < 0.8) {
        toBePlayedAnimName = "pressRight";
      } else if (this._balance >= 0.8 && this._balance <= 1) {
        toBePlayedAnimName = "pressRight2";
      }

      if (this._arms.animations.name != toBePlayedAnimName) {
        this._arms.animations.play(toBePlayedAnimName, 0, false);
        this._bar.animations.play(toBePlayedAnimName, 0, false);
      }

    }

    if (typeof this._pressFrac != "undefined") {

      // Presss fraction fuzzy logic

      var currentAnimFrames = this._arms.animations.currentAnim._frames,
          currentFrameIndex = currentAnimFrames.indexOf(this._arms.animations.frame),
          toBePlayedFrameIndex;

      // Note: Here frame indexes are of current animation frames array and
      // not of sprite frames array.

      if (this._pressFrac < 0.2) {
        toBePlayedFrameIndex = 0;
      } else if (this._pressFrac >= 0.2 && this._pressFrac < 0.4) {
        toBePlayedFrameIndex = 1;
      } else if (this._pressFrac >= 0.4 && this._pressFrac < 0.6) {
        toBePlayedFrameIndex = 2;
      } else if (this._pressFrac >= 0.6 && this._pressFrac < 0.8) {
        toBePlayedFrameIndex = 3;
      } else if (this._pressFrac >= 0.8 && this._pressFrac <= 1) {
        toBePlayedFrameIndex = 4;
      }

      if (toBePlayedFrameIndex != currentFrameIndex) {
        this._arms.animations.frame = currentAnimFrames[toBePlayedFrameIndex];
        this._bar.animations.frame = currentAnimFrames[toBePlayedFrameIndex];
      }

    }
  },

  getReady: function() {

    this._arms.animations.play("start", 8, false);
    this._bar.animations.play("start", 8, false);

  },

  stepFrameForward: function() {

  this._arms.animations.next(1);

  },

  stepFrameBackwards: function() {

    this._arms.animations.previous(1);

  }
}

Object.defineProperty(PowerGym.Prefabs.PlayerLvl1.prototype, 'balance', {

  set: function(value) {
    if (value > 1) {
      value = 1;
    } else if (value < 0) {
      value = 0;
    }

    this._balance = value;
  },

  get: function() {
    return this._balance;
  }

});

Object.defineProperty(PowerGym.Prefabs.PlayerLvl1.prototype, 'pressFrac', {

  set: function(value) {
    if (value > 1) {
      value = 1;
    } else if (value < 0) {
      value = 0;
    }

    this._pressFrac = value;
  },

  get: function() {
    return this._pressFrac;
  }

});
