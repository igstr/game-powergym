
PowerGym.Lvl1 = function(game) { };

PowerGym.Lvl1.prototype = {

  create: function () {

    this.add.sprite(0, 0, "bgLvl1");

    var btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this),
        margin = 20;

    btnGoBack.x = margin;
    btnGoBack.y = this.scale.height - btnGoBack.height - margin;

  },

  update: function () { },

  quitGame: function(pointer) {

      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
    this.state.start("MainMenu");

  },

  btnGoBackCallback: function() {
    this.state.start("Home");
  }


};
