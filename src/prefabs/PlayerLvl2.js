
PowerGym.Prefabs.PlayerLvl2 = function(game, x, y, headBangCallback, headBangCallbackContext) {

  this.game = game;
  this._health = 100;

  var difficulty = PowerGym.UserData.lvl2Difficulty;

  if (typeof headBangCallback === "function") {
    this._headBangCallback = headBangCallback;
    if (typeof headBangCallbackContext !== undefined) {
      this._headBangCallbackContext = headBangCallbackContext;
    } else {
      this._headBangCallbackContext = this;
    }
  }

  if (game.physics.p2 == null) {
    game.physics.startSystem(Phaser.Physics.P2JS);
  }
  game.physics.p2.setImpactEvents(true);
  game.physics.p2.gravity.y = 1000;

  this._armsAngularDrag = 1000;
  this._armsMaxAngularVelocity = 2000;

  this.isReady = false;

  // GROUPS

  // Main player body group which is not visible in the begining. It becomes
  // visible after get ready animations have been played.
  this.body = game.add.group(game.world, "playerLvl2");
  this.body.x = x;
  this.body.y = y;
  this.body.visible = false;
  this.body.scale.set(PowerGym.GameData.scale);

  // Inner group for arms
  this.arms = game.add.group(this.body, "playerLvl2arms", false, true, Phaser.Physics.P2JS);
  this.arms.enableBodyDebug = PowerGym.DEBUG_MODE;
  var armsCollisionGroup = game.physics.p2.createCollisionGroup(),
      headCollisionGroup = game.physics.p2.createCollisionGroup();

  // BODY

  this._body = game.add.sprite(95, 210, "playerLvl2Body", 0, this.body);
  game.physics.p2.enable(this._body, false);
  this._body.body.static = true;

  // Body on which animations are being played.
  // Position differs because animations sprite is larger then body group.
  var gameScale = PowerGym.GameData.scale;
  this._bodyAnims = game.add.sprite(x - 37 * gameScale, y - 25 * gameScale, "playerLvl2BodyAnimations", 0);
  this._bodyAnims.scale.set(gameScale);
  switch (difficulty) {
    case 2:
      this._bodyAnims.animations.add("idle", [15], 6, true);
      this._bodyAnims.animations.add("getReady", [14, 13, 12, 11, 10, 9, 8], 6);
      this._bodyAnims.animations.add("fallDown", [7, 6, 5, 4, 3, 2, 1, 0], 6);
      break;
    case 1:
      this._bodyAnims.animations.add("idle", [31], 6, true);
      this._bodyAnims.animations.add("getReady", [30, 29, 28, 27, 26, 25, 24], 6);
      this._bodyAnims.animations.add("fallDown", [23, 22, 21, 20, 19, 18, 17, 16], 6);
      break;
    case 0:
    default:
      this._bodyAnims.animations.add("idle", [47], 6, true);
      this._bodyAnims.animations.add("getReady", [46, 45, 44, 43, 42, 41, 40], 6);
      this._bodyAnims.animations.add("fallDown", [39, 38, 37, 36, 35, 34, 33, 32], 6);
      break;
  }
  this._bodyAnims.animations.play("idle");


  // HEAD

  this._head = game.add.sprite(92, 30, "playerLvl2Head", 0, this.body);
  game.physics.p2.enable(this._head, PowerGym.DEBUG_MODE);
  this._head.body.static = true;
  this._head.body.clearShapes();
  this._head.body.loadPolygon("playerLvl2HeadPhysics", "head");
  this._head.body.setCollisionGroup(headCollisionGroup);
  this._head.body.collides(armsCollisionGroup, this.headBang, this);
  PowerGym.Mixins.withShakeAnim.call(this._head);

  // ARMS

  this._leftArm = game.add.sprite(148, 144, "playerLvl2ArmsAtlas", "leftArm" + difficulty, this.arms);
  this._leftArm.body.clearShapes();
  this._leftArm.body.loadPolygon("playerLvl2ArmsPhysics", "leftArm" + difficulty);

  this._rightArm = game.add.sprite(32, 145, "playerLvl2ArmsAtlas", "rightArm" + difficulty, this.arms);
  this._rightArm.body.clearShapes();
  this._rightArm.body.loadPolygon("playerLvl2ArmsPhysics", "rightArm" + difficulty);

  this.arms.forEach(function(item) {
    // Arms are statitc until get ready animation is played
    item.body.static = true;

    item.body.setCollisionGroup(armsCollisionGroup);
    item.body.collides([armsCollisionGroup, headCollisionGroup]);
  }, this);
  this.body.bringToTop(this.arms);

  // Creating constrains between body and arms
  game.physics.p2.createRevoluteConstraint(this._body, [26, -129], this._leftArm, [-25, -61]);
  game.physics.p2.createRevoluteConstraint(this._body, [-39, -129], this._rightArm, [24, -64]);

  this.headBangCounter = 0;
  this.timeStarted = this.game.time.now;

};

PowerGym.Prefabs.PlayerLvl2.prototype = {

  update: function() {

  },

  getReady: function() {

    var getReadyAnim = this._bodyAnims.animations.play("getReady");
    getReadyAnim.onComplete.add(function() {
      this.game.time.events.add(1000 / 6, function() {
        this._bodyAnims.visible = false;
        this.body.visible = true;
        this._leftArm.body.static = false;
        this._rightArm.body.static = false;
      }, this);
    }, this);

  },

  fallDown: function() {

    this.body.visible = false;
    this._bodyAnims.visible = true;
    this._bodyAnims.animations.play("fallDown");

  },

  headBang: function(body1, body2) {

    // Preventing initial headbang
    if (this.game.time.now - this.timeStarted > 1000) {

      if (!this._head.shakeAnimIsPlaying) {
        this._head.startShakeOutAnim(6, 1500);

        console.log(body2.angularVelocity)
        // body2.sprite.key == ""
        // this.rightArmVelocity -= 10;
        // this.leftArmVelocity += 10;

        if (typeof this._headBangCallback !== undefined) {
          this._headBangCallback.call(this._headBangCallbackContext);
        }
      }
    }
  },

  changeHeadTint: function() {

    var gb = 0.7 + 0.3 * (this._health / 100);
    this._head.tint = PIXI.rgb2hex([1, gb, gb]);

  }

}

Object.defineProperty(PowerGym.Prefabs.PlayerLvl2.prototype, 'leftArmVelocity', {

  set: function(value) {

    if (!this._leftArm.body.static) {
      this._leftArm.body.angularVelocity = value;
    }

  },

  get: function() {

    return this._leftArm.body.angularVelocity;

  }

});

Object.defineProperty(PowerGym.Prefabs.PlayerLvl2.prototype, 'rightArmVelocity', {

  set: function(value) {

    if (!this._rightArm.body.static) {
      this._rightArm.body.angularVelocity = value;
    }

  },

  get: function() {

    return this._rightArm.body.angularVelocity;

  }

});

Object.defineProperty(PowerGym.Prefabs.PlayerLvl2.prototype, 'health', {

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
