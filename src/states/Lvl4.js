
PowerGym.States.Lvl4 = function(game) { };

PowerGym.States.Lvl4.prototype = {

  create: function () {

    this.gameScale = PowerGym.GameData.scale;
    this.isMobile = !this.game.device.desktop || PowerGym.UserData.forceMobile;

    this.ready = false;
    this.holdDelay = 100;
    this.repDuration = 1500;
    this.bgImage = this.add.image(0, 0, "bgLvl4");
    this.growingWeight = 0.2;
    this.repsCount = 0;
    this.totalClicks = 0;
    this.reachedRepEnd = false;

    // PLAYER

    this.player = new PowerGym.Prefabs.PlayerLvl4(this, 0, 0);

    // GUI

    // Reps counter text
    this.repsCountText = this.add.bitmapText(0, 0, "carrierCommand");
    this.updateRepsCountText();
    this.repsCountText.anchor.setTo(0.5, 0.5);

    this.btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this);

    // INFO WINDOW

    // If first time playing this level show info window
    if (PowerGym.UserData.Stats.overallLvl4Score == 0) {
      this.time.events.add(1500, function() {

        this.disableBtnGoBack();
        this.menuInfo = new PowerGym.Prefabs.MenuLvlInfo(this, 4, this.menuInfoOkBtnCallback);
        this.placeGameObject("menuInfo");

      }, this);
    } else {
      this.addBtnUpCallback();
      this.ready = true;
    }

    this.putEverythingInPlace();

  },

  update: function () {

    if (this.ready) {
      var spacebar = PowerGym.Keys.Spacebar;
      if (spacebar.isDown && spacebar.duration > this.holdDelay) {
        if (!this.startedInterpolation) {
          this.easeStartValue = this.player.repFrac;
          this.easeStartTime = this.time.now;
          this.easeDuration = this.repDuration * (1 - this.player.repFrac);
          this.startedInterpolation = true;
        }
        var currentPercent = (this.time.now - this.easeStartTime)
          / this.easeDuration;
        if (currentPercent <= 1) {
          var value = Phaser.Easing.Quartic.In(currentPercent);
          this.player.repFrac = this.easeStartValue + value;
        }
      } else {

        this.startedInterpolation = false;

        if (this.player.repFrac > 0.05) {
          this.player.repFrac += this.growingWeight * this.time.physicsElapsed;
        }

      }

      if (this.reachedRepEnd && this.player.repFrac < 0.1) {
        this.repsCount++;
        this.updateRepsCountText();
        this.reachedRepEnd = false;
      } else if (this.player.repFrac > 0.85) {
        this.reachedRepEnd = true;
      }

      if (!this.player.flattened && this.player.repFrac >= 1) {
        this.player.flatten();
        this.endState();
      }
    }

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

  updateRepsCountText: function() {

    this.repsCountText.text = this.repsCount.toString();

  },

  endState: function(pointer) {

    // No comming back at this point
    this.btnGoBack.destroy();

    PowerGym.Keys.Spacebar.onUp.remove(this.btnUpCallback, this);

    var stats = [
      {
        name: "Reps",
        amount: this.repsCount,
        multiplier: 10
      },
      {
        name: "Total Clicks",
        amount: this.totalClicks,
        multiplier: 4
      }
    ];

    var total = 0;
    for (var i = 0, l = stats.length; i < l; i++) {
      total += stats[i].amount * stats[i].multiplier;
    }

    PowerGym.UserData.Scores.lvl4 = total;

    // Stats
    this.game.time.events.add(2000, function() {

      this.menuLvlStats = new PowerGym.Prefabs.MenuLvlStats(this, function() {
        this.game.state.start("Home");
      }, stats, 4000);
      this.placeGameObject("menuLvlStats");

    }, this);

  },

  placeGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "btnGoBack":
        var margin = 20 * this.gameScale
            btnScale = this.isMobile ? this.gameScale * 2 : this.gameScale;
        this.btnGoBack.scale.set(btnScale);
        this.btnGoBack.x = margin;
        this.btnGoBack.y = this.game.height - this.btnGoBack.height - margin;
        break;
      case "repsCountText":
        this.repsCountText.scale.set(this.gameScale);
        this.repsCountText.x = this.game.width / 2;
        this.repsCountText.y = 80 * this.gameScale;
        break;
      case "player":
        this.player.bodySprite.scale.set(this.gameScale);
        this.player.bodySprite.x = this.game.width / 2
          + 25 * this.gameScale
          - this.player.bodySprite.width / 2;
        this.player.bodySprite.y = this.game.height / 2
          + 85 * this.gameScale
          - this.player.bodySprite.height / 2;
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
      default:
    }

  },

  resize: function() {

    this.gameScale = PowerGym.GameData.scale;
    this.putEverythingInPlace();

  },

  putEverythingInPlace: function() {

    var gameObjects = ["bg", "btnGoBack", "player", "repsCountText"];
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

  render: function() {

    if (PowerGym.DEBUG_MODE) {
      this.game.debug.text("player rep frac: " + this.player.repFrac, 32, 16);
    }

  },

  btnGoBackCallback: function() {

    this.state.start("Home");

  },

  btnUpCallback: function() {

    if (PowerGym.Keys.Spacebar.duration < this.holdDelay) {
      this.player.repFrac -= 0.2;
      this.totalClicks++;
    }

  },

  addBtnUpCallback: function() {

    PowerGym.Keys.Spacebar.onUp.add(this.btnUpCallback, this);

  },

  menuInfoOkBtnCallback: function() {

    this.menuInfo.destroy();
    this.menuInfo = null;

    this.enableBtnGoBack();
    this.putEverythingInPlace();

    this.addBtnUpCallback();
    this.ready = true;

  }

};
