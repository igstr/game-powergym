
PowerGym.Prefabs.PlayerLvl1 = function(game, x, y) {

  this._isPressing = true;

  this._head = game.add.sprite(0, 0, "playerLvl1Head");
  this._head.anchor.setTo(0.5, 0.5);
  this._head.x = 180;
  this._head.y = 207;

  this._body = game.add.sprite(0, 0, "playerLvl1Body");
  this._body.anchor.setTo(0.5, 0.5);
  this._body.x = 332;
  this._body.y = 346;

  this._arms = game.add.sprite(0, 0, "playerLvl1Arms", 30);
  this._arms.anchor.setTo(0.5, 0.5);
  this._arms.x = 200;
  this._arms.y = 175;

  this._arms.animations.add("pressRight2", [0, 1, 2, 3, 4]);
  this._arms.animations.add("pressRight", [5, 6, 7, 8, 9]);
  this._arms.animations.add("pressLeft2", [10, 11, 12, 13, 14]);
  this._arms.animations.add("pressLeft", [15, 16, 17, 18, 19]);
  this._arms.animations.add("pressCenter", [20, 21, 22, 23, 24]);

  this.body = game.add.group(null, "player");
  this.body.add(this._head);
  this.body.add(this._body);
  this.body.add(this._arms);

  this.body.x = x;
  this.body.y = y;

  game.world.add(this.body);

};

PowerGym.Prefabs.PlayerLvl1.prototype = {

  update: function() {

    if (this._isPressing) {
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
        }

      }
    }
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
