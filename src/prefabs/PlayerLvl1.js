
PowerGym.Prefabs.PlayerLvl1 = function(game, x, y) {

  this.game = game;
  this.isReady = false;
  this._health = 100;

  // Group
  this.body = game.add.group(game.world, "playerLvl1");
  this._grBodyPlay = game.add.group(this.body);

  this._head = game.add.sprite(0, 39, "playerLvl1Head", 0, this._grBodyPlay);
  this._head.anchor.set(0.5);

  this._body = game.add.sprite(152, 178, "playerLvl1Body", 0, this._grBodyPlay);
  this._body.anchor.set(0.5);

  this._bar = game.add.sprite(10, 0, "lvl1Bar" + PowerGym.UserData.lvl1Difficulty, 34, this._grBodyPlay);
  this._bar.anchor.set(0.5);

  this._bar.animations.add("pressRight2", [0, 1, 2, 3, 4]);
  this._bar.animations.add("pressRight", [5, 6, 7, 8, 9]);
  this._bar.animations.add("pressLeft2", [10, 11, 12, 13, 14]);
  this._bar.animations.add("pressLeft", [15, 16, 17, 18, 19]);
  this._bar.animations.add("pressCenter", [20, 21, 22, 23, 24]);
  this._bar.animations.add("start", [34, 33, 32, 31, 30, 29, 28, 27, 26, 25]);

  this._arms = game.add.sprite(20, 52, "playerLvl1Arms", 34, this._grBodyPlay);
  this._arms.anchor.set(0.5);

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

  this._grBodyPlay.x = 189;
  this._grBodyPlay.y = 12;

  // Seperate invisible fall down body
  this._grBodyFallDown = game.add.group(this.body, "playerLvl1FallDown");
  this._bodyFallDown = this.game.add.sprite(0, 0, "playerLvl1FallDown", 3, this._grBodyFallDown);
  this._barFallDown = this.game.add.sprite(-63, -54, "lvl1Bar" + PowerGym.UserData.lvl1Difficulty + "FallDown", 3, this._grBodyFallDown);

  this._bodyFallDown.animations.add("fallLeft", [3, 2, 1, 0]);
  this._bodyFallDown.animations.add("fallRight", [7, 6, 5, 4]);
  this._bodyFallDown.animations.add("fallLeftWithHeadache", [11, 10, 9, 8]);
  this._bodyFallDown.animations.add("fallRightWithHeadache", [15, 14, 13, 12]);

  this._barFallDown.animations.add("fallLeft", [3, 2, 1, 0]);
  this._barFallDown.animations.add("fallRight", [7, 6, 5, 4]);

  this._grBodyFallDown.visible = false;

  this.body.x = x;
  this.body.y = y;

  PowerGym.Keys.Spacebar.onDown.add(function() {
    this.fallDown(false, "right");
  }, this);

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
        this._arms.animations.play(toBePlayedAnimName, 0);
        this._bar.animations.play(toBePlayedAnimName, 0);
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

    this._arms.animations.play("start", 8);
    this._bar.animations.play("start", 8);

  },

  stepFrameForward: function() {

  this._arms.animations.next(1);

  },

  stepFrameBackwards: function() {

    this._arms.animations.previous(1);

  },

  changeHeadTint: function() {

    var gb = 0.6 + 0.4 * (this._health / 100);
    this._head.tint = PIXI.rgb2hex([1, gb, gb]);

  },

  fallDown: function(direction) {

    if (direction === undefined) {
      direction = Math.random() > 0.5 ? "left" : "right";
    }

    if (direction == "left") {
      toBePlayedAnimName = "fallLeft";
    } else {
      toBePlayedAnimName = "fallRight";
    }

    headache = this._health <= 0 ? true : false;

    this._grBodyPlay.visible = false;
    this._grBodyFallDown.visible = true;

    this._bodyFallDown.animations.play(toBePlayedAnimName + (headache ? "WithHeadache" : ""), 4);
    this._barFallDown.animations.play(toBePlayedAnimName, 4);

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

Object.defineProperty(PowerGym.Prefabs.PlayerLvl1.prototype, 'health', {

  set: function(value) {
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    }

    this._health = value;
    this.changeHeadTint();
  },

  get: function() {
    return this._health;
  }

});
