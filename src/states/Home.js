
PowerGym.Home = function(game) { };

PowerGym.Home.prototype = {

  create: function () {

    this.add.sprite(0, 0, "bgHome");

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
    this.player.grBody.x = this.scale.width / 4 - this.player.grBody.width / 2;
    this.player.grBody.y = this.world.centerY - this.player.grBody.height / 2;

    // Menu
    var btnScale = 1.3,
        btnImgSize = 100,
        margin = 10 * btnScale;
        row1 = 0,
        row2 = btnImgSize * btnScale + margin,
        col1 = 0,
        col2 = btnImgSize * btnScale + margin;

    this.grLvlBtns = this.add.group(this.world, 'menuBtns');
    this.grLvlBtns.add(this.add.button(col1, row1, "btnLvl1", this.btnLvl1Callback, this, 1, 0, 2, 0));
    this.grLvlBtns.add(this.add.button(col2, row1, "btnLvl2", this.btnLvl2Callback, this, 1, 0, 2, 0));
    this.grLvlBtns.add(this.add.button(col1, row2, "btnLvl3", this.btnLvl3Callback, this, 1, 0, 2, 0));
    this.grLvlBtns.add(this.add.button(col2, row2, "btnLvl4", this.btnLvl4Callback, this, 1, 0, 2, 0));

    this.grLvlBtns.x = this.scale.width - (this.scale.width / 4) - (btnImgSize * btnScale) - margin - 40;
    this.grLvlBtns.y = this.world.centerY - col2;

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

    this.state.start("Lvl2");

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
