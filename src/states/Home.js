
PowerGym.States.Home = function(game) { };

PowerGym.States.Home.prototype = {

  create: function () {

    this.gameScale = PowerGym.GameData.scale;
    this.gameAspectRatio = PowerGym.GameData.aspectRatio;

    this.bgImage = this.add.image(0, 0, "bgHome");
    this.adjustGameObject("bg");

    if (!PowerGym.UserData.playerProgress) {
      PowerGym.UserData.playerProgress = {
        torso: 1,
        arms: 1,
        legs: 1,
        head: 1,
        shorts: 1
      };
    }

    // Player
    this.player = new PowerGym.Prefabs.PlayerHome(
        this,
        100,
        100,
        PowerGym.UserData.playerProgress
    );
    this.adjustGameObject("player");

    // Enlarging player muscles if there are some scores from levels. After
    // that setting all scores to zero.
    var scores = PowerGym.UserData.Scores;
    if (typeof scores.lvl1 != "undefined" && scores.lvl1 != 0) {
      var scaleAmount = scores.lvl1 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("torso", scaleAmount);
      }, this);
      PowerGym.UserData.Stats.overallLvl1Score += scores.lvl1;
      PowerGym.UserData.Stats.overallScore += scores.lvl1;
      scores.lvl1 = 0;
      PowerGym.UserData.playerProgress.torso += scaleAmount;
    }
    if (typeof scores.lvl2 != "undefined" && scores.lvl2 != 0) {
      var scaleAmount = scores.lvl2 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("arms", scaleAmount);
      }, this);
      PowerGym.UserData.Stats.overallLvl2Score += scores.lvl2;
      PowerGym.UserData.Stats.overallScore += scores.lvl2;
      scores.lvl2 = 0;
      PowerGym.UserData.playerProgress.arms += scaleAmount;
    }
    if (typeof scores.lvl3 != "undefined" && scores.lvl3 != 0) {
      var scaleAmount = scores.lvl3 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("legs", scaleAmount);
        this.player.enlargeMuscleByAmount("shorts", scaleAmount / 4);
      }, this);
      PowerGym.UserData.Stats.overallLvl3Score += scores.lvl3;
      PowerGym.UserData.Stats.overallScore += scores.lvl3;
      scores.lvl3 = 0;
      PowerGym.UserData.playerProgress.legs += scaleAmount;
      PowerGym.UserData.playerProgress.shorts += scaleAmount / 4;
    }
    if (typeof scores.lvl4 != "undefined" && scores.lvl4 != 0) {
      var scaleAmount = scores.lvl4 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("head", scaleAmount);
      }, this);
      PowerGym.UserData.Stats.overallLvl4Score += scores.lvl4;
      PowerGym.UserData.Stats.overallScore += scores.lvl4;
      scores.lvl4 = 0;
      PowerGym.UserData.playerProgress.head += scaleAmount;
    }

    // Menu level buttons
    var btnScale = 1.3,
        btnImgSize = 100,
        margin = 10 * btnScale;
        row1 = 0,
        row2 = btnImgSize * btnScale + margin,
        col1 = 0,
        col2 = btnImgSize * btnScale + margin;

    this.grLvlBtns = this.add.group(this.world, 'menuBtns');
    this.add.button(col1, row1, "btnLvl1", this.btnLvl1Callback, this, 1, 0, 2, 0, this.grLvlBtns);
    this.add.button(col2, row1, "btnLvl2", this.btnLvl2Callback, this, 1, 0, 2, 0, this.grLvlBtns);
    this.add.button(col1, row2, "btnLvl3", this.btnLvl3Callback, this, 1, 0, 2, 0, this.grLvlBtns);
    this.add.button(col2, row2, "btnLvl4", this.btnLvl4Callback, this, 1, 0, 2, 0, this.grLvlBtns);

    this.grLvlBtns.forEach(function(item) {
      item.scale.setTo(btnScale, btnScale);
      PowerGym.Mixins.withFloatAnim.call(item);
      item.startFloat();
    });

    this.adjustGameObject("lvlBtns");

  },

  update: function() {

    this.player.update();

  },

  adjustGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "player":
        this.player.body.scale.set(this.gameScale);
        this.player.body.x = this.game.width / 2
          - 164 * this.gameScale
          - this.player.body.width / 2;
        this.player.body.y = this.game.height / 2
          - this.player.body.height / 2;
        break;
      case "lvlBtns":
        this.grLvlBtns.scale.set(this.gameScale);
        this.grLvlBtns.x = this.game.width / 2
          + 164 * this.gameScale
          - this.grLvlBtns.width / 2;
        this.grLvlBtns.y = this.game.height / 2
          - this.grLvlBtns.height / 2;
        break;
      default:
    }

  },

  render: function() {

    // If window was resized readjusting game objects
    if (this.gameAspectRatio != PowerGym.GameData.aspectRatio) {

      this.gameAspectRatio = PowerGym.GameData.aspectRatio;
      this.gameScale = PowerGym.GameData.scale;

      var gameObjectsToAdjust = ["bg", "player", "lvlBtns"];
      for (var i = 0, l = gameObjectsToAdjust.length; i < l; i++) {
        this.adjustGameObject(gameObjectsToAdjust[i]);
      }
    }

    if (PowerGym.DEBUG_MODE) {
      // this.game.debug.text("aspect ratio: " + this.game.scale.aspectRatio, 32, 16);
      // this.game.debug.text("source aspect ratio: " + this.game.scale.sourceAspectRatio, 32, 32);
      // this.game.debug.text("aspect scale factor: " + this.game.scale.scaleFactor, 32, 48);
    }

  },

  quitGame: function(pointer) {

    //  Then let's go back to the main menu.
    this.state.start("MainMenu");

  },

  disableMenuLvlOptions: function() {

    this.menuLvlOptions.destroy();
    this.enableLvlButtons();

  },

  btnLvl1Callback: function() {

    this.disableLvlButtons();
    this.menuLvlOptions = new PowerGym.Prefabs.MenuLvlOptions(this, 1, function() {

      this.state.start("Lvl1");

    }, this.disableMenuLvlOptions);

  },

  btnLvl2Callback: function() {

    this.disableLvlButtons();
    this.menuLvlOptions = new PowerGym.Prefabs.MenuLvlOptions(this, 2, function() {

      this.state.start("Lvl2");

    }, this.disableMenuLvlOptions);

  },

  btnLvl3Callback: function() {

    this.state.start("Lvl3");

  },

  btnLvl4Callback: function() {

    this.state.start("Lvl4");

  },

  disableLvlButtons: function() {

    this.grLvlBtns.visible = false;

  },

  enableLvlButtons: function() {

    this.grLvlBtns.visible = true;

  }

};
