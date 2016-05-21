
PowerGym.States.Lvl3 = function(game) { };

PowerGym.States.Lvl3.prototype = {

  create: function () {

    this.gameScale = PowerGym.GameData.scale;
    this.isMobile = !this.game.device.desktop || PowerGym.UserData.forceMobile;

    this.fallingOff = false;
    this.playStartTime = 0;
    this.playTime = 0; // Calculated when player falls off
    this.treadmillSpeedLvl = 0;
    this.playerRunSpeed = 0; // Value for linear interpolation
    this.velocityToAdd = 0;
    this.clickTimes = [];
    this.treadmillLvlduration = 10000;
    this.currentCps = 0; // clicks per second
    this.maxCps = 0;
    this.avgCps = 0;
    this.totalClicks = 0;
    this.isPlaying = false;
    this.reachedTreadmillFront = false; // used when player increases speed

    this.maxPos = new Phaser.Point();
    this.minPos = new Phaser.Point();
    // Not using sprite world position. It gets strange values when resizing a
    // window.
    this.playerPosWorld = new Phaser.Point();

    // Just in case arcade system is not started
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // BACKGROUND

    this.bgImage = this.add.image(0, 0, "bgLvl3");

    // TREADMILL

    this.treadmill = this.add.sprite(0, 0, "treadmillTrack", 0);
    this.treadmill.animations.add("run", [1, 2, 3, 4, 5], 6, true);
    this.treadmill.animations.play("run", 6, true);

    // PLAYER

    this.player = new PowerGym.Prefabs.PlayerLvl3(this.game, 0, 0);
    this.physics.enable(this.player.bodySprite, Phaser.Physics.ARCADE, true);

    this.counter = 0;
    this.step = Math.PI * 2 / 4;


    // GUI

    // Treadmill lvl number text
    this.treadmillLvlText = this.add.bitmapText(0, 0, "carrierCommand", this.treadmillSpeedLvl.toString());
    this.treadmillLvlText.anchor.setTo(0.5, 0.5);

    this.btnGoBack = this.add.button(
        0,
        0,
        "btnGoBack",
        this.btnGoBackCallback,
        this
    );

    // Info window

    // If first time playing this level show info window
    if (PowerGym.UserData.Stats.overallLvl3Score == 0) {
      this.time.events.add(1500, function() {

        this.disableBtnGoBack();
        this.menuInfo = new PowerGym.Prefabs.MenuLvlInfo(this, 3, this.menuInfoOkBtnCallback);
        this.placeGameObject("menuInfo");

      }, this);
    } else {
      this.getReady();
    }

    this.putEverythingInPlace();

  },

  menuInfoOkBtnCallback: function() {

    this.menuInfo.destroy();
    this.menuInfo = null;

    this.enableBtnGoBack();
    this.getReady();

  },

  enableBtnGoBack: function() {

    this.btnGoBack.onInputUp.add(this.btnGoBackCallback, this);
    this.btnGoBack.freezeFrames = false;
    this.btnGoBack.input.useHandCursor = true;

  },

  disableBtnGoBack: function() {

    this.btnGoBack.onInputUp.remove(this.btnGoBackCallback, this);
    this.btnGoBack.freezeFrames = true;
    this.btnGoBack.input.useHandCursor = false;

  },

  resize: function(width, height) {

    this.gameScale = PowerGym.GameData.scale;
    this.putEverythingInPlace();

  },

  update: function() {


    if (this.isPlaying && !this.fallingOff) {

      // Updating velocity to add value. Player velocity decreases by the
      // treadmill level number (+5) per treadmill level duration,
      this.velocityToAdd -=  (5 + this.treadmillSpeedLvl) * this.time.physicsElapsed
        / (this.treadmillLvlduration / 1000);

      // Calculate player position
      this.playerPosWorld.set(
        this.player.bodyGr.x + this.player.bodySprite.x * this.gameScale,
        this.player.bodyGr.y + this.player.bodySprite.y * this.gameScale
      );

      // Chech if player is in bounds and clear velocity if neccesary
      if (this.playerPosWorld.x > this.maxPos.x) {
        // No more positive velocity
        this.velocityToAdd = Math.min(0, this.velocityToAdd);

        if (!this.reachedTreadmillFront) {
          this.reachedTreadmillFront = true;
          this.increaseTreadmillSpeedLvl();
        }
      }
      if (this.playerPosWorld.x < this.minPos.x) {

        // No more negative velocity
        this.velocityToAdd = Math.max(0, this.velocityToAdd);

        this.falloff();
      }

      // If velocity was wrong stop the player
      var playerVelocity = this.player.bodySprite.body.velocity;
      if (this.velocityToAdd == 0) {
        playerVelocity.x = 0;
      } else {
        // Add velocity to the player
        playerVelocity.x += this.velocityToAdd * this.time.physicsElapsed;
      }

      // Update player run speed (frame rate)
      this.playerRunSpeed = Phaser.Math.linear(
          this.playerRunSpeed,
          this.currentCps,
          this.time.physicsElapsed * 0.5
      );
      this.player.runSpeed = this.playerRunSpeed * 2;

      // Player moves away from front by 10px he could increase speed again.
      if (this.reachedTreadmillFront
          && this.playerPosWorld.x < this.maxPos.x - 10
      ) {
        this.reachedTreadmillFront = false;
      }

    }

  },

  increaseTreadmillSpeedLvl: function() {

    if (this.treadmillSpeedUpTimerEvent) {
      this.time.events.remove(this.treadmillSpeedUpTimerEvent);
    }

    this.treadmillSpeedLvl += 1;
    this.treadmillLvlText.text = this.treadmillSpeedLvl;

    this.treadmillSpeedUpTimerEvent = this.time.events.loop(this.treadmillLvlduration, function() {
      this.treadmillSpeedLvl += 1;
      this.treadmillLvlText.text = this.treadmillSpeedLvl;
    }, this);

  },

  falloff: function() {

    this.fallingOff = true;

    // Just in case player did't stop
    this.player.bodySprite.body.velocity.x = 0;
    this.velocityToAdd = 0;

    this.playTime = this.time.now - this.playStartTime;
    this.player.falloff();
    this.endState();

  },

  endState: function(pointer) {

    PowerGym.Keys.Spacebar.onDown.remove(this.speedUpClickCallback, this);
    this.bgImage.events.onInputDown.remove(this.speedUpClickCallback);

    this.btnGoBack.destroy();
    this.time.events.remove(this.treadmillSpeedUpTimerEvent);

    var stats = [
      {
        name: "Time played (s)",
        amount: Math.round(this.playTime / 100) / 10,
        multiplier: 10
      },
      {
        name: "Max Speed (c/s)",
        amount: Math.round(this.maxCps * 100) / 100,
        multiplier: 10
      },
      {
        name: "Avg speed (c/s)",
        amount: Math.round(this.avgCps * 100) / 100,
        multiplier: 10
      },
      {
        name: "Total Clicks",
        amount: this.totalClicks,
        multiplier: 4
      },
      {
        name: "Level reached",
        amount: this.treadmillSpeedLvl,
        multiplier: 20
      }
    ];

    var total = 0;
    for (var i = 0, l = stats.length; i < l; i++) {
      total += stats[i].amount * stats[i].multiplier;
    }

    PowerGym.UserData.Scores.lvl3 = total;

    // Stats
    this.game.time.events.add(2000, function() {

      this.menuLvlStats = new PowerGym.Prefabs.MenuLvlStats(this, function() {
        this.game.state.start("Home");
      }, stats, 4000);
      this.placeGameObject("menuLvlStats");

      this.menuLvlStats._windowSprite.inputEnabled = true;
      this.menuLvlStats._windowSprite.events.onInputDown.add(function() {
        this.menuLvlStats.skipCurrentLine();
      }, this);

    }, this);

  },

  countClicksPerSecond: function() {

    var spliceDeleteCount = 0,
        clicksCount = 0,
        now = this.time.now;

    for (var i = 0, l = this.clickTimes.length; i < l; i++) {
      if (now - this.clickTimes[i] < 1000) {
        clicksCount++;
      } else {
        spliceDeleteCount = i + 1;
      }
    }
    if (clicksCount == 0) {
      this.currentCps = 1000 / (now - this.lastButtonPressTime);
    } else {
      clicksCount += (now - this.lastButtonPressTime) / (1000 / clicksCount);
    }
    this.currentCps = clicksCount;
    this.maxCps = Math.max(this.maxCps, clicksCount);
    this.clickTimes.splice(0, spliceDeleteCount);

    this.timePlayed = this.time.now - this.playStartTime;
    this.avgCps = this.totalClicks / (this.timePlayed / 1000);

  },


  putEverythingInPlace: function() {

    var gameObjects = [
      "bg",
      "btnGoBack",
      "player",
      "treadmill",
      "playerMinMaxPos",
      "treadmillLvlText"
    ];
    if (this.menuLvlStats) {
      gameObjects.push("menuLvlStats");
    }
    if (this.menuInfo) {
      gameObjects.push("menuInfo");
    }
    for (var i = 0, l = gameObjects.length; i < l; i++) {
      this.placeGameObject(gameObjects[i]);
    }

  },

  placeGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "player":
        this.player.bodyGr.scale.set(this.gameScale);
        this.player.bodyGr.x = this.game.width / 2
          - this.player.bodyGr.width / 2;
        this.player.bodyGr.y = this.game.height / 2
          - 15 * this.gameScale
          - this.player.bodyGr.height / 2;
      break;
      case "btnGoBack":
        var margin = 20 * this.gameScale
            btnScale = this.isMobile ? this.gameScale * 2 : this.gameScale;
        this.btnGoBack.scale.set(btnScale);
        this.btnGoBack.x = margin;
        this.btnGoBack.y = this.game.height - this.btnGoBack.height - margin;
        break;
      case "treadmill":
        this.treadmill.scale.set(this.gameScale);
        this.treadmill.x = this.game.width / 2
          + 16 * this.gameScale
          - this.treadmill.width / 2;
        this.treadmill.y = 433 * this.gameScale - this.treadmill.height / 2;
        break;
      case "menuLvlStats":
        this.menuLvlStats.window.scale.set(this.gameScale);
        this.menuLvlStats.window.x = this.game.width / 2
          - this.menuLvlStats.window.width / 2;
        this.menuLvlStats.window.y = this.game.height / 2
          - this.menuLvlStats.window.height / 2;
      break;
      case "menuInfo":
        this.menuInfo.window.scale.set(this.gameScale);
        this.menuInfo.window.x = this.game.width / 2
          - this.menuInfo.window.width / 2;
        this.menuInfo.window.y = this.game.height / 2
          - this.menuInfo.window.height / 2;
        break;
      case "playerMinMaxPos":
        this.maxPos.x = this.game.width / 2
            + 150 * this.gameScale
            - this.player.bodyGr.width / 2;
        this.minPos.x = this.game.width / 2
            - 170 * this.gameScale
            - this.player.bodyGr.width / 2;
      break;
      case "treadmillLvlText":
        this.treadmillLvlText.x = this.game.width / 2 + 230 * this.gameScale;
        this.treadmillLvlText.y = this.game.height / 2 - 50;
      break;
      default:
    }

  },

  speedUpClickCallback: function() {

    this.velocityToAdd += 0.2;
    var now = this.time.now;
    this.lastButtonPressTime = now;
    this.clickTimes.push(now);
    this.totalClicks++;

  },

  render: function() {

    if (PowerGym.DEBUG_MODE) {
      this.game.debug.text("player velocity: " + this.player.bodySprite.body.velocity, 16, 16);
      this.game.debug.text("player velocity to add: " + this.velocityToAdd, 16, 32);
      this.game.debug.text("treadmill speed level: " + this.treadmillSpeedLvl, 16, 48);
      this.game.debug.text("clicks per second: " + this.currentCps, 16, 64);
      this.game.debug.text("player world pos: " + this.player.bodySprite.world, 16, 80);
      this.game.debug.text("player not world pos: " + this.playerPosWorld, 16, 96);
      this.game.debug.text("total clicks: " + this.totalClicks, 16, 112);
      this.game.debug.text("fps: " + this.game.time.fps, 16, 128);
    }

  },

  getReady: function() {

    PowerGym.Keys.Spacebar.onDown.add(this.speedUpClickCallback, this);
    this.bgImage.inputEnabled = true;
    this.bgImage.events.onInputDown.add(this.speedUpClickCallback, this);

    // Start speed level incrementer
    this.increaseTreadmillSpeedLvl();

    // Start cps counter. count 10 times per second.
    this.currentCpsCountTimerEvent = this.time.events.loop(100, this.countClicksPerSecond, this);

    this.isPlaying = true;
    this.playStartTime = this.time.now;

  },

  btnGoBackCallback: function() {

    this.state.start("Home");

  }

};
