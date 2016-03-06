
PowerGym.Home = function(game) { };

PowerGym.Home.prototype = {

  create: function () {

    this.add.sprite(0, 0, "bgHome");

    // Player
    this.player = new PowerGym.Prefabs.PlayerHome(this, 100, 100);
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

    var grMenuBtns = this.add.group(this.world, 'menuBtns');
    grMenuBtns.add(this.add.button(col1, row1, "btnLvl1Sheet", this.btnLvl1Callback, this, 1, 0, 2, 0));
    grMenuBtns.add(this.add.button(col2, row1, "btnLvl2Sheet", this.btnLvl2Callback, this, 1, 0, 2, 0));
    grMenuBtns.add(this.add.button(col1, row2, "btnLvl3Sheet", this.btnLvl3Callback, this, 1, 0, 2, 0));
    grMenuBtns.add(this.add.button(col2, row2, "btnLvl4Sheet", this.btnLvl4Callback, this, 1, 0, 2, 0));

    grMenuBtns.x = this.scale.width - (this.scale.width / 4) - (btnImgSize * btnScale) - margin - 40;
    grMenuBtns.y = this.world.centerY - col2;

    grMenuBtns.forEach(function(item) {
      item.scale.setTo(btnScale, btnScale);
      PowerGym.Mixins.withFloatAnim.call(item);
      item.startFloat();
    });

    // Input
    PowerGym.Keys.upKey.onDown.add(this.player.scaleEverythingUp, this.player);
    PowerGym.Keys.downKey.onDown.add(this.player.scaleEverythingDown, this.player);

  },

  update: function () {

    this.player.update();

  },

  quitGame: function(pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    //  Then let's go back to the main menu.
    this.state.start("MainMenu");

  },

  btnLvl1Callback: function() {
    this.state.start("Lvl1");
  },

  btnLvl2Callback: function() {
    this.state.start("Lvl2");
  },

  btnLvl3Callback: function() {
    this.state.start("Lvl3");
  },

  btnLvl4Callback: function() {
    this.state.start("Lvl4");
  }

};
