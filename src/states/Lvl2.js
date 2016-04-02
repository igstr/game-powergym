
PowerGym.Lvl2 = function(game) { };

PowerGym.Lvl2.prototype = {

  create: function () {

    this.repsCounter = 0;
    this.failCounter = 0;
    this.leftArmReachedRepBottom = true;
    this.rightArmReachedRepBottom = true;

    // BACKGROUND
    this.add.sprite(0, 0, "bgLvl2");

    // PLAYER
    this.player = new PowerGym.Prefabs.PlayerLvl2(this, 314, 150, this.headBangCallback, this);

    // GUI
    this.repsCounterText = this.add.bitmapText(this.world.centerX, 80, "carrierCommand", this.repsCounter);
    this.repsCounterText.anchor.setTo(0.5, 0.5);

    var btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this),
        margin = 20;
    btnGoBack.x = margin;
    btnGoBack.y = this.scale.height - btnGoBack.height - margin;

    // INPUT
    PowerGym.Keys.Left.onDown.add(this.fKeyCallback, this);
    PowerGym.Keys.Right.onDown.add(this.jKeyCallback, this);
    PowerGym.Keys.J.onDown.add(this.jKeyCallback, this);
    PowerGym.Keys.F.onDown.add(this.fKeyCallback, this);

    PowerGym.Keys.Spacebar.onDown.add(this.spacebarKeyCallback, this);

  },

  update: function () {

    // Updating reps counter text
    this.repsCounterText.text = this.repsCounter;

    if (PowerGym.Keys.J.isDown || PowerGym.Keys.Right.isDown) {
      this.jKeyCallback();
    }
    if (PowerGym.Keys.F.isDown || PowerGym.Keys.Left.isDown) {
      this.fKeyCallback();
    }

    // Reps counter
    if (this.leftArmReachedRepBottom
        && this.rightArmReachedRepBottom
        && this.player._leftArm.rotation < -Math.PI / 2
        && this.player._rightArm.rotation > Math.PI / 2
    ) {
      this.leftArmReachedRepBottom = false;
      this.rightArmReachedRepBottom = false;
      this.repsCounter++;
    }

    // Checking if rep bottom reached
    if (!this.leftArmReachedRepBottom && this.player._leftArm.rotation > 0) {
      this.leftArmReachedRepBottom = true;
    }
    if (!this.rightArmReachedRepBottom && this.player._rightArm.rotation < 0) {
      this.rightArmReachedRepBottom = true;
    }

    this.player.update();

  },

  render: function() {

    if (PowerGym.DEBUG_MODE) {
      this.game.debug.text("leftArm rotation: " + this.player._leftArm.rotation, 8, 16);
      this.game.debug.text("leftArm angle: " + this.player._leftArm.angle, 8, 32);
      this.game.debug.text("leftArm angular velocity: " + this.player._leftArm.body.angularVelocity, 8, 48);
      this.game.debug.text("leftArm angular acceleration: " + this.player._leftArm.body.angularAcceleration, 8, 64);
      this.game.debug.text("reps: " + this.repsCounter, 8, 80);
      this.game.debug.text("fails: " + this.failCounter, 8, 96);
      this.game.debug.text("left arm bottom: " + this.leftArmReachedRepBottom, 8, 112);
      this.game.debug.text("right arm bottom: " + this.rightArmReachedRepBottom, 8, 128);
    }

  },

  headBangCallback: function() {

    this.failCounter++;

    // Lower Player health
    var newHealth = this.player.health - 20;
    this.game.tweens.create(this.player).to({health: newHealth}, 1000, Phaser.Easing.Quadratic.In, true);

  },

  spacebarKeyCallback: function() {

    if (!this.playerReady) {
      this.player.getReady();
      this.playerReady = true;
    }
    PowerGym.Keys.Spacebar.onDown.remove(this.spacebarKeyCallback, this);

  },

  btnGoBackCallback: function() {

    this.state.start("Home");

  },

  fKeyCallback: function() {

    if (this.playerReady) {
      this.player.rightArmVelocity += 50 * this.game.time.physicsElapsed;
    }

  },

  jKeyCallback: function() {

    if (this.playerReady) {
      this.player.leftArmVelocity -= 50 * this.game.time.physicsElapsed;
    }

  },

};
