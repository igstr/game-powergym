
PowerGym.States.Lvl2 = function(game) { };

PowerGym.States.Lvl2.prototype = {

  create: function () {

    this.gameAspectRatio = PowerGym.GameData.aspectRatio;
    this.gameScale = PowerGym.GameData.scale;
    this.repsCounter = 0;
    this.failCounter = 0;
    this.leftArmReachedRepBottom = true;
    this.rightArmReachedRepBottom = true;
    this.playerReady = false;
    this.fallenDown = false;
    this.stateStartTime = 0;
    this.controlsDisabled = false;


    // BACKGROUND
    this.bgImage = this.add.image(0, 0, "bgLvl2");

    // PLAYER

    this.player = new PowerGym.Prefabs.PlayerLvl2(this, 0, 0, this.headBangCallback, this);

    // GUI
    this.repsCounterText = this.add.bitmapText(0, 0, "carrierCommand", this.repsCounter);
    this.repsCounterText.anchor.setTo(0.5, 0.5);

    this.btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this);

    this.putEverythingInPlace();

    // INPUT

    PowerGym.Keys.Spacebar.onDown.add(this.spacebarKeyCallback, this);

  },

  update: function () {

    // Updating reps counter text
    this.repsCounterText.text = this.repsCounter;

    if (!this.fallenDown) {

      if (!this.controlsDisabled) {
        if (PowerGym.Keys.J.isDown || PowerGym.Keys.Right.isDown) {
          this.jKeyCallback();
        }
        if (PowerGym.Keys.F.isDown || PowerGym.Keys.Left.isDown) {
          this.fKeyCallback();
        }
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

      if (this.player.health <= 0) {
        this.player.fallDown();
        this.fallenDown = true;
        this.endState();
      }
    }

    this.player.update();

  },

  putEverythingInPlace: function() {

    var gameObjectsToAdjust = [
        "bg",
        "player",
        "btnGoBack",
        "repsCounterText",
    ];
    if (this.menuLvlStats) {
      gameObjectsToAdjust.push("menuLvlStats");
    }
    for (var i = 0, l = gameObjectsToAdjust.length; i < l; i++) {
      this.placeGameObject(gameObjectsToAdjust[i]);
    }

  },

  placeGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "player":
        this.player.body.scale.set(this.gameScale);
        this.player.body.x = this.game.width / 2
          - 86 * this.gameScale;
        this.player.body.y = 160 * this.gameScale;
        break;
      case "repsCounterText":
        this.repsCounterText.scale.set(this.gameScale);
        this.repsCounterText.x = this.game.width / 2;
        this.repsCounterText.y = 80 * this.gameScale;
      break;
      case "btnGoBack":
        this.btnGoBack.scale.set(this.gameScale);
        var margin = 20 * this.gameScale;
        this.btnGoBack.x = margin;
        this.btnGoBack.y = this.game.height - this.btnGoBack.height - margin;
      break;
      case "menuLvlStats":
        this.menuLvlStats.window.scale.set(this.gameScale);
        this.menuLvlStats.window.x = this.game.width / 2
          - this.menuLvlStats.window.width / 2;
        this.menuLvlStats.window.y = this.game.height / 2
          - this.menuLvlStats.window.height / 2;
      break;
      default:
    }

  },

  render: function() {

    // If window was resized readjusting game objects
    if (this.gameAspectRatio != PowerGym.GameData.aspectRatio) {

      this.gameAspectRatio = PowerGym.GameData.aspectRatio;
      this.gameScale = PowerGym.GameData.scale;
      this.putEverythingInPlace();

    }

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

  endState: function(pointer) {

    var stats = [
      {
        name: "Reps",
        amount: this.repsCounter,
        multiplier: 3 * PowerGym.UserData.lvl2Difficulty
      },
      {
        name: "Speed bonus",
        amount: Math.round(500 * (4000 * this.repsCounter) / (this.game.time.now - this.stateStartTime)),
        multiplier: 1
      },
      {
        name: "Difficulty bonus",
        amount: 200 * PowerGym.UserData.lvl2Difficulty,
        multiplier: 1
      },
      {
        name: "Respect points",
        amount: 10 * this.repsCounter * this.game.rnd.integerInRange(1, 4),
        multiplier: 1
      }
    ];

    var total = 0;
    for (var i = 0, l = stats.length; i < l; i++) {
      total += stats[i].amount;
    }

    PowerGym.UserData.Scores.lvl2 = total;

    // Stats
    this.game.time.events.add(2000, function() {

      this.menuLvlStats = new PowerGym.Prefabs.MenuLvlStats(this, function() {
        this.game.state.start("Home");
      }, stats, 4000);
      this.placeGameObject("menuLvlStats");
      this.btnGoBack.visible = false;

      PowerGym.Keys.MouseL.onDown.add(function() {
        this.menuLvlStats.skipCurrentLine();
      }, this);
      PowerGym.Keys.Spacebar.onDown.add(function(){
        this.menuLvlStats.skipCurrentLine();
      }, this);
    }, this);

  },

  headBangCallback: function() {

    this.failCounter++;

    // Lower Player health
    var newHealth = this.player.health - 20;
    this.game.tweens.create(this.player).to({health: newHealth}, 1000, Phaser.Easing.Quadratic.In, true);

    // Disable user input for half a second
    this.controlsDisabled = true;
    this.game.time.events.add(500, function() {
      this.controlsDisabled = false;
    }, this);

  },

  spacebarKeyCallback: function() {

    if (!this.playerReady) {
      this.getReady();
    }
    PowerGym.Keys.Spacebar.onDown.remove(this.spacebarKeyCallback, this);

  },

  btnGoBackCallback: function() {

    this.state.start("Home");

  },

  getReady: function() {

    this.player.getReady();
    this.playerReady = true;
    this.stateStartTime = this.game.time.now;

  },

  fKeyCallback: function() {

    if (this.playerReady && !this.controlsDisabled) {
      this.player.rightArmVelocity += 50 * this.game.time.physicsElapsed;
    }
    if (!this.playerReady) {
      this.getReady();
    }

  },

  jKeyCallback: function() {

    if (this.playerReady && !this.controlsDisabled) {
      this.player.leftArmVelocity -= 50 * this.game.time.physicsElapsed;
    }

    if (!this.playerReady) {
      this.getReady();
    }

  },

};
