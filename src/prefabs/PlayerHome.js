
PowerGym.Prefabs.PlayerHome = function(game, x, y, scaleParams) {

  this.game = game;

  if (!scaleParams || typeof scaleParams.torso == "undefined") {
    var scaleParams = {
      torso: 1,
      arms: 1,
      legs: 1,
      head: 1,
      shorts: 1,
      sixPack: 1
    };
  }

  this.body = game.add.group(game.world, "playerHomeBody");
  this.body.x = x;
  this.body.y = y;

  // this._head = game.add.add.group()
  this._headShape = game.add.sprite(76, 35, "playerHomeHead", 0, this.body);
  this._headShape.anchor.set(0.5);
  this._headShape.scale.x = scaleParams.head;

  this._face = game.add.sprite(79, 38, "playerHomeFace", 0, this.body);
  this._face.anchor.set(0.5);

  this._torso = game.add.sprite(73, 155, "playerHomeTorso", 0, this.body);
  this._torso.anchor.set(0.5);
  this._torso.scale.x = scaleParams.torso;

  this._sixPack = game.add.sprite(80, 171, "playerHomeSixPack", 0, this.body);
  this._sixPack.anchor.set(0.5);
  this._sixPack.scale.set(this.getSixPackScale(scaleParams.sixPack));
  this._sixPack.alpha = this.getSixPackAlpha(scaleParams.sixPack);

  this._rightArm = game.add.sprite(41, 84, "playerHomeRightArm", 0, this.body);
  this._rightArm.anchor.set(0.8, 0);
  this._rightArm.scale.x = scaleParams.arms;

  this._leftArm = game.add.sprite(103, 83, "playerHomeLeftArm", 0, this.body);
  this._leftArm.anchor.set(0.2, 0);
  this._leftArm.scale.x = scaleParams.arms;

  this._rightLeg = game.add.sprite(58, 232, "playerHomeRightLeg", 0, this.body);
  this._rightLeg.anchor.set(0.5, 0);
  this._rightLeg.scale.x = scaleParams.legs;

  this._leftLeg = game.add.sprite(100, 232, "playerHomeLefgLeg", 0, this.body);
  this._leftLeg.anchor.set(0.5, 0);
  this._leftLeg.scale.x = scaleParams.legs;

  this._shorts = game.add.sprite(80, 239, "playerHomeShorts", 0, this.body);
  this._shorts.anchor.set(0.5);
  this._shorts.scale.x = scaleParams.shorts;

  this._headShape.animations.add("idle", [3, 2, 1, 0], 1, true).play();
  this._torso.animations.add("idle", [3, 2, 1, 0], 1, true).play();
  this._rightArm.animations.add("idle", [3, 2, 1, 0], 1, true).play();
  this._leftArm.animations.add("idle", [3, 2, 1, 0], 1, true).play();
  this._rightLeg.animations.add("idle", [3, 2, 1, 0], 1, true).play();
  this._leftLeg.animations.add("idle", [3, 2, 1, 0], 1, true).play();


};

PowerGym.Prefabs.PlayerHome.prototype = {

  update: function() {},

  getSixPackAlpha: function(progress) {

    return Math.min(1, progress - 1);

  },

  getSixPackScale: function(progress) {

    return 1 + progress / 20;

  },

  scaleEverythingUp: function() {

    var notToScale = ["playerHomeHead", "playerHomeShorts", "playerHomeFace"];

    this.body.forEach(function(item) {
      if (notToScale.indexOf(item.key) === -1) {
        item.scale.x += 0.1;
      }
    });

  },


  scaleEverythingDown: function() {

    var notToScale = ["playerHomeHead", "playerHomeShorts", "playerHomeFace"];

    this.body.forEach(function(item) {
      if (notToScale.indexOf(item.key) === -1) {
        item.scale.x -= 0.1;
      }
    });

  },

  enlargeMuscleByAmount: function(muscle, amount) {

    var playEnlargeAnim = function(muscle, amount) {

      var enlargeTo = muscle.scale.x + amount;

      var enlargeTween = this.game.tweens.create(muscle.scale);
      enlargeTween.to({x: enlargeTo}, 300, Phaser.Easing.Elastic.Out, true);

    };

    switch (muscle) {
      case "torso":
        playEnlargeAnim.call(this, this._torso, amount);
        break;
      case "arms":
        playEnlargeAnim.call(this, this._leftArm, amount);
        playEnlargeAnim.call(this, this._rightArm, amount);
        break;
      case "legs":
        playEnlargeAnim.call(this, this._leftLeg, amount);
        playEnlargeAnim.call(this, this._rightLeg, amount);
        break;
      case "shorts":
        playEnlargeAnim.call(this, this._shorts, amount);
        break;
      case "head":
        playEnlargeAnim.call(this, this._headShape, amount);
        break;
      case "sixPack":
        var newProgress = PowerGym.UserData.playerProgress.sixPack + amount,
            newScale = this.getSixPackScale(newProgress),
            newAlpha = this.getSixPackAlpha(newProgress);

        var enlargeTween = this.game.tweens.create(this._sixPack.scale);
        enlargeTween.to({x: newScale, y: newScale}, 300, Phaser.Easing.Elastic.Out, true);
        var alphaTween = this.game.tweens.create(this._sixPack);
        alphaTween.to({alpha: newAlpha}, 300, Phaser.Easing.Elastic.Out, true);
        break;
      default:
    }

  },

  resetMuscles: function(scales) {

    this.body.forEach(function(item) {
      item.scale.x = 1;
      if (item.key == "playerHomeSixPack") {
        item.alpha = 0;
      }
    }, this)

  }

}

