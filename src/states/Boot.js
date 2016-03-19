
PowerGym.Boot = function(game) {};

PowerGym.Boot.prototype = {

  init: function () {

    //  Configuration

    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {

      //  If you have any desktop specific settings, they can go in here
      this.scale.pageAlignHorizontally = true;

    } else {
      //  Same goes for mobile settings.
      //  In this case we"re saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(480, 260, 1024, 768);
      this.scale.forceLandscape = true;
      this.scale.pageAlignHorizontally = true;
    }

    // Adding game states
    this.state.add("Preloader", PowerGym.Preloader);
    this.state.add("MainMenu", PowerGym.MainMenu);
    this.state.add("Home", PowerGym.Home);
    this.state.add("Lvl1", PowerGym.Lvl1);
    this.state.add("Lvl2", PowerGym.Lvl2);
    this.state.add("Lvl3", PowerGym.Lvl3);
    this.state.add("Lvl4", PowerGym.Lvl4);

    // Initializing game keys
    PowerGym.Keys.Up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    PowerGym.Keys.Down = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    PowerGym.Keys.Left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    PowerGym.Keys.Right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    PowerGym.Keys.J = this.input.keyboard.addKey(Phaser.Keyboard.J);
    PowerGym.Keys.F = this.input.keyboard.addKey(Phaser.Keyboard.F);
    PowerGym.Keys.D = this.input.keyboard.addKey(Phaser.Keyboard.D);
    PowerGym.Keys.K = this.input.keyboard.addKey(Phaser.Keyboard.K);
    PowerGym.Keys.Spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


  },

  preload: function () {

    //  Here we load the assets required for our preloader (in this case a background and a loading bar)
    // this.load.image("preloaderBackground", "images/preloader_background.jpg");
    // this.load.image("preloaderBar", "images/preloadr_bar.png");

  },

  create: function () {

    //  By this point the preloader assets have loaded to the cache, we"ve set the game settings
    //  So now let"s start the real preloader going
    this.state.start("Preloader");
  }

};
