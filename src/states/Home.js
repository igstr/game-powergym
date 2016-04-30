
PowerGym.States.Home = function(game) { };

PowerGym.States.Home.prototype = {

  create: function () {

    this.gameScale = PowerGym.gameScale;

    this.bgImage = this.add.image(0, 0, "bgHome");
    this.adjustGameObject("bg");

    if (!PowerGym.GameData.playerProgress) {
      PowerGym.GameData.playerProgress = {
        torso: 1,
        arms: 1,
        legs: 1,
        head: 1
      };
    }

    // Player
    this.player = new PowerGym.Prefabs.PlayerHome(this, 100, 100, PowerGym.GameData.playerProgress);
    this.player.body.scale.set(PowerGym.gameScale);
    this.player.body.x = this.game.width / 4 - this.player.body.width / 2;
    this.player.body.y = this.game.height / 2 - this.player.body.height / 2;

    // Enlarging player muscles if there are some scores from levels. After
    // that setting all scores to zero.
    var scores = PowerGym.GameData.Scores;
    if (typeof scores.lvl1 != "undefined" && scores.lvl1 != 0) {
      var scaleAmount = scores.lvl1 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("torso", scaleAmount);
      }, this);
      PowerGym.GameData.Stats.overallLvl1Score += scores.lvl1;
      PowerGym.GameData.Stats.overallScore += scores.lvl1;
      scores.lvl1 = 0;
      PowerGym.GameData.playerProgress.torso += scaleAmount;
    }
    if (typeof scores.lvl2 != "undefined" && scores.lvl2 != 0) {
      var scaleAmount = scores.lvl2 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("arms", scaleAmount);
      }, this);
      PowerGym.GameData.Stats.overallLvl2Score += scores.lvl2;
      PowerGym.GameData.Stats.overallScore += scores.lvl2;
      scores.lvl2 = 0;
      PowerGym.GameData.playerProgress.arms += scaleAmount;
    }
    if (typeof scores.lvl3 != "undefined" && scores.lvl3 != 0) {
      var scaleAmount = scores.lvl3 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("legs", scaleAmount);
      }, this);
      PowerGym.GameData.Stats.overallLvl3Score += scores.lvl3;
      PowerGym.GameData.Stats.overallScore += scores.lvl3;
      scores.lvl3 = 0;
      PowerGym.GameData.playerProgress.legs += scaleAmount;
    }
    if (typeof scores.lvl4 != "undefined" && scores.lvl4 != 0) {
      var scaleAmount = scores.lvl4 / 4000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("head", scaleAmount);
      }, this);
      PowerGym.GameData.Stats.overallLvl4Score += scores.lvl4;
      PowerGym.GameData.Stats.overallScore += scores.lvl4;
      scores.lvl4 = 0;
      PowerGym.GameData.playerProgress.head += scaleAmount;
    }

    // Menu level buttons
    var btnScale = PowerGym.gameScale * 1.3,
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

    this.grLvlBtns.x = this.game.width - (this.game.width / 4) - (btnImgSize * btnScale) - margin - 40;
    this.grLvlBtns.y = this.world.centerY - col2;
    // this.adjustGameObject("lvlBtns");

    this.grLvlBtns.forEach(function(item) {
      item.scale.setTo(btnScale, btnScale);
      PowerGym.Mixins.withFloatAnim.call(item);
      item.startFloat();
    });

    // Input
    PowerGym.Keys.Up.onDown.add(this.player.scaleEverythingUp, this.player);
    PowerGym.Keys.Down.onDown.add(this.player.scaleEverythingDown, this.player);

  },

  update: function() {

    this.player.update();

  },

  adjustGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        break;
      case "player":
        break;
      case "lvlBtns":
        break;
      default:
    }

  },

  render: function() {

    // If window was resized readjusting game objects
    if (this.gameScale != PowerGym.gameScale) {

      this.gameScale = PowerGym.gameScale;
      var gameObjectsToAdjust = ["bg"];
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
