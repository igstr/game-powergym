
PowerGym.States.Home = function(game) { };

PowerGym.States.Home.prototype = {

  create: function () {

    this.gameScale = PowerGym.GameData.scale;
    this.bgImage = this.add.image(0, 0, "bgHome");

    // Loading data from storage and "binding" data manager to it
    if (!this.dataManager) {
      this.dataManager = new PowerGym.DataManager();
      var userData = this.dataManager.load();
      if (userData) {
        PowerGym.UserData = userData;
      } else {
        this.dataManager.data = PowerGym.UserData;
      }
    }

    // Player
    this.player = new PowerGym.Prefabs.PlayerHome(
        this,
        100,
        100,
        PowerGym.UserData.playerProgress
    );

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
      var scaleAmount = scores.lvl4 / 8000;
      this.game.time.events.add(1000, function() {
        this.player.enlargeMuscleByAmount("sixPack", scaleAmount);
      }, this);
      PowerGym.UserData.Stats.overallLvl4Score += scores.lvl4;
      PowerGym.UserData.Stats.overallScore += scores.lvl4;
      scores.lvl4 = 0;
      PowerGym.UserData.playerProgress.sixPack += scaleAmount;
    }

    // Save scores to storage
    this.dataManager.save();


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

    // Button to force mobile mode
    if (this.game.device.desktop) {
      this.btnMobile = this.add.button(0, 0, "btnMobile", this.btnMobileCallback, this, 1, 0, 0, 0);
      this.btnMobileOn = this.add.button(0, 0, "btnMobileOn", this.btnMobileCallback, this, 1, 0, 0, 0);
    }
    this.btnBin = this.add.button(0, 0, "btnBin", this.btnBinCallback, this, 1, 0, 2, 0);

    this.putEverythingInPlace();

  },

  update: function() {

    this.player.update();

  },

  putEverythingInPlace: function() {

    var gameObjects = ["bg", "player", "lvlBtns", "btnBin"];
    if (this.menuLvlOptions && this.menuLvlOptions.window.visible) {
      gameObjects.push("menuLvlOptions");
    }
    if (this.game.device.desktop && !this.menuLvlOptions) {
      gameObjects.push("btnMobile");
    }
    for (var i = 0, l = gameObjects.length; i < l; i++) {
      this.placeGameObject(gameObjects[i]);
    }

  },

  btnMobileCallback: function() {

    PowerGym.UserData.forceMobile = !PowerGym.UserData.forceMobile;
    this.dataManager.save();
    this.putEverythingInPlace();

  },

  btnBinCallback: function() {

    // Needed for comparison of two objects if they contain equal data
    var currentProgress = JSON.stringify(PowerGym.UserData.playerProgress)
        defaultProgress = JSON.stringify(PowerGym.Defaults.UserData.playerProgress)

    // If not already reset
    if (currentProgress != defaultProgress) {
      // Clone default progress data
      PowerGym.UserData.playerProgress = JSON.parse(defaultProgress);
      PowerGym.UserData.Stats.resetCount++;
      this.player.resetMuscles();
      this.dataManager.save();
    }

  },

  placeGameObject: function(name) {

    var isMobile = !this.game.device.desktop || PowerGym.UserData.forceMobile;

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "player":
        var playerScale = isMobile ? this.gameScale * 1.2 : this.gameScale;
        this.player.body.scale.set(playerScale);
        this.player.body.x = this.game.width / 2
          - 164 * this.gameScale
          - this.player.body.width / 2;
        this.player.body.y = this.game.height / 2
          - this.player.body.height / 2;
        break;
      case "lvlBtns":
        var xPixels = isMobile ? 185 : 165,
            btnsScale = isMobile ? this.gameScale * 1.4 : this.gameScale;
        this.grLvlBtns.scale.set(btnsScale);
        this.grLvlBtns.x = this.game.width / 2
          + xPixels * this.gameScale
          - this.grLvlBtns.width / 2;
        this.grLvlBtns.y = this.game.height / 2
          - this.grLvlBtns.height / 2;
        break;
      case "btnMobile":
        this.btnMobile.scale.set(this.gameScale);
        this.btnMobileOn.scale.set(this.gameScale);

        var margin = 10 * this.gameScale,
            y =  this.btnBin.top - this.btnMobile.height - margin;

        this.btnMobile.x = margin;
        this.btnMobile.y = y;
        this.btnMobileOn.x = margin;
        this.btnMobileOn.y = y;
        this.btnMobileOn.visible = PowerGym.UserData.forceMobile;
        this.btnMobile.visible = !PowerGym.UserData.forceMobile;
        break;
      case "btnBin":
        var margin = 10 * this.gameScale,
            scale = isMobile ? this.gameScale * 2 : this.gameScale;
        this.btnBin.scale.set(scale);
        this.btnBin.x = margin;
        this.btnBin.y = this.game.height - this.btnBin.height - margin;
        break;
      case "menuLvlOptions":
        this.menuLvlOptions.window.scale.set(this.gameScale);
        this.menuLvlOptions.window.x = this.game.width / 2
          - this.menuLvlOptions.window.width / 2;
        this.menuLvlOptions.window.y = this.game.height / 2
          - this.menuLvlOptions.window.height / 2;
        break;
      default:
    }

  },

  resize: function() {

    this.gameScale = PowerGym.GameData.scale;
    this.putEverythingInPlace();

  },

  render: function() {

    if (PowerGym.DEBUG_MODE) {
      this.game.debug.text("fps: " + this.game.time.fps, 8, 16);
    }

  },

  quitGame: function(pointer) {

    //  Then let's go back to the main menu.
    this.state.start("MainMenu");

  },

  cancelMenuLvlOptions: function() {

    this.destroyMenuLvlOptions();
    this.enableStateBtns();
    this.putEverythingInPlace();

  },

  destroyMenuLvlOptions: function() {

    this.menuLvlOptions.window.destroy();
    this.menuLvlOptions.destroy();
    this.menuLvlOptions = null;

  },

  btnLvl1Callback: function() {

    this.disableStateBtns();
    this.menuLvlOptions = new PowerGym.Prefabs.MenuLvlOptions(this, 1, function() {

      this.destroyMenuLvlOptions();
      this.state.start("Lvl1");

    }, this.cancelMenuLvlOptions);
    this.placeGameObject("menuLvlOptions");

  },

  btnLvl2Callback: function() {

    this.disableStateBtns();
    this.menuLvlOptions = new PowerGym.Prefabs.MenuLvlOptions(this, 2, function() {

      this.destroyMenuLvlOptions();
      this.state.start("Lvl2");

    }, this.cancelMenuLvlOptions);
    this.placeGameObject("menuLvlOptions");

  },

  btnLvl3Callback: function() {

    this.state.start("Lvl3");

  },

  btnLvl4Callback: function() {

    this.state.start("Lvl4");

  },

  disableStateBtns: function() {

    this.grLvlBtns.visible = false;

    // If mobile button visible disable it
    if (this.game.device.desktop) {
      var button;
      if (PowerGym.UserData.forceMobile) {
        button = this.btnMobileOn;
      } else {
        button = this.btnMobile;
      }
      // button.visible = true;
      button.onInputUp.remove(this.btnMobileCallback, this);
      button.freezeFrames = true;
      button.input.useHandCursor = false;
    }

    // Disable bin button
    this.btnBin.onInputUp.remove(this.btnBinCallback, this);
    this.btnBin.freezeFrames = true;
    this.btnBin.input.useHandCursor = false;

  },

  enableStateBtns: function() {

    this.grLvlBtns.visible = true;

    // If mobile button visible enable it
    if (this.game.device.desktop) {
      var button;
      if (PowerGym.UserData.forceMobile) {
        button = this.btnMobileOn;
      } else {
        button = this.btnMobile;
      }
      // button.visible = true;
      button.onInputUp.add(this.btnMobileCallback, this);
      button.freezeFrames = false;
      button.input.useHandCursor = true;
    }

    // Enable bin button
    this.btnBin.onInputUp.add(this.btnBinCallback, this);
    this.btnBin.freezeFrames = false;
    this.btnBin.input.useHandCursor = true;

  }

};
