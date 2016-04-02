
PowerGym.Prefabs.PlayerLvl2 = function(game, x, y, headBangCallback, headBangCallbackContext) {

  this.game = game;
  this._health = 100;

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
  var armsCollisionGroup = game.physics.p2.createCollisionGroup(),
      headCollisionGroup = game.physics.p2.createCollisionGroup();
  this.body = game.add.group(game.world, "playerLvl2");
  this.body.x = x;
  this.body.y = y;
  this.arms = game.add.group(this.body, "playerLvl2arms", false, true, Phaser.Physics.P2JS);
  this.arms.enableBodyDebug = PowerGym.DEBUG_MODE;

  // BODY
  this._body = game.add.sprite(88, 210, "playerLvl2Body", 0, this.body);
  game.physics.p2.enable(this._body, false);
  this._body.body.static = true;

  // HEAD
  this._head = game.add.sprite(85, 30, "playerLvl2Head", 0, this.body);
  game.physics.p2.enable(this._head, PowerGym.DEBUG_MODE);
  this._head.body.static = true;
  this._head.body.clearShapes();
  this._head.body.loadPolygon("playerLvl2HeadPhysics", "head");
  this._head.body.setCollisionGroup(headCollisionGroup);
  this._head.body.collides(armsCollisionGroup, this.headBang, this);
  PowerGym.Mixins.withShakeAnim.call(this._head);

  // ARMS
  this._leftArm = game.add.sprite(137, 140, "playerLvl2LeftArm", 0, this.arms);
  this._leftArm.body.clearShapes();
  this._leftArm.body.loadPolygon("playerLvl2LeftArmPhysics", "leftArm");
  this._leftArm.body.static = true;

  this._rightArm = game.add.sprite(28, 140, "playerLvl2RightArm", 0, this.arms);
  this._rightArm.body.clearShapes();
  this._rightArm.body.loadPolygon("playerLvl2RightArmPhysics", "rightArm");
  this._rightArm.body.static = true;

  this.arms.forEach(function(item) {
    item.body.setCollisionGroup(armsCollisionGroup);
    item.body.collides([armsCollisionGroup, headCollisionGroup]);
  }, this);
  this.body.bringToTop(this.arms);

  game.physics.p2.createRevoluteConstraint(this._body, [28, -130], this._leftArm, [-22, -60]);
  game.physics.p2.createRevoluteConstraint(this._body, [-37, -130], this._rightArm, [21, -61]);

  this.headBangCounter = 0;
  this.timeStarted = this.game.time.now;

};

PowerGym.Prefabs.PlayerLvl2.prototype = {

  update: function() {

  },

  getReady: function() {

    this._leftArm.body.static = false;
    this._rightArm.body.static = false;

    // this._arms.animations.play("start", 8, false);
    // this._bar.animations.play("start", 8, false);

  },

  headBang: function(body1, body2) {

    // Preventing initial headbang
    if (this.game.time.now - this.timeStarted > 1000) {
      if (!this._head.shakeAnimIsPlaying) {
        this._head.startShakeOutAnim(6, 1500);

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

    this._leftArm.body.angularVelocity = value;

  },

  get: function() {

    return this._leftArm.body.angularVelocity;

  }

});

Object.defineProperty(PowerGym.Prefabs.PlayerLvl2.prototype, 'rightArmVelocity', {

  set: function(value) {

    this._rightArm.body.angularVelocity = value;

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
