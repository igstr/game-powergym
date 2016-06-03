
PowerGym.Boot = function(game) {};

PowerGym.Boot.prototype = {

  init: function () {

    //  Configuration

    //  Unless you specifically know your game needs to support multi-touch I
    //  would recommend setting this to 1
    this.input.maxPointers = 3;

    //  Phaser will automatically pause if the browser tab the game is in loses
    //  focus. You can disable that here:
    this.stage.disableVisibilityChange = true;

    // Setting stage backgound to white instead of black
    this.game.stage.backgroundColor = 0xFFFFFF;

    // Scale setup
    this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.RESIZE;
    this.scale.onSizeChange.add(function() {

      // Setting global game scale and aspect ratio for game objects to use.
      PowerGym.GameData.scale = this.game.height / PowerGym.ORIGINAL_HEIGHT;
      PowerGym.GameData.aspectRatio = this.game.width / this.game.height;

    }, this);

    // If mobile
    if (!this.game.device.desktop) {
      this.scale.forceLandscape = true;

      // Adds a signal to every state to go fullscreen if any input is received.
      this.state.onStateChange.add(function() {

        this.input.onDown.add(function() {
          if (!this.game.scale.isFullScreen) {
            this.game.scale.startFullScreen(false);
          }
        }, this);

      }, this);
    }

    // Enabling this for fps monitoring
    if (PowerGym.DEBUG_MODE) {
      this.game.time.advancedTiming = true;
    }

    // Adding game states
    this.state.add("Preloader", PowerGym.States.Preloader);
    this.state.add("MainMenu", PowerGym.States.MainMenu);
    this.state.add("Home", PowerGym.States.Home);
    this.state.add("Lvl1", PowerGym.States.Lvl1);
    this.state.add("Lvl2", PowerGym.States.Lvl2);
    this.state.add("Lvl3", PowerGym.States.Lvl3);
    this.state.add("Lvl4", PowerGym.States.Lvl4);

    // Initializing game keys
    PowerGym.Keys.Up = this.input.keyboard.addKey(Phaser.Keyboard.UP);
    PowerGym.Keys.Down = this.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    PowerGym.Keys.Left = this.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    PowerGym.Keys.Right = this.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    PowerGym.Keys.W = this.input.keyboard.addKey(Phaser.Keyboard.W);
    PowerGym.Keys.A = this.input.keyboard.addKey(Phaser.Keyboard.A);
    PowerGym.Keys.S = this.input.keyboard.addKey(Phaser.Keyboard.S);
    PowerGym.Keys.D = this.input.keyboard.addKey(Phaser.Keyboard.D);

    PowerGym.Keys.J = this.input.keyboard.addKey(Phaser.Keyboard.J);
    PowerGym.Keys.F = this.input.keyboard.addKey(Phaser.Keyboard.F);
    PowerGym.Keys.D = this.input.keyboard.addKey(Phaser.Keyboard.D);
    PowerGym.Keys.K = this.input.keyboard.addKey(Phaser.Keyboard.K);
    PowerGym.Keys.Spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    // Mouse
    PowerGym.Keys.MouseL = this.game.input.activePointer.leftButton;
    PowerGym.Keys.MouseR = this.game.input.activePointer.rightButton;
    PowerGym.Keys.MouseM = this.game.input.activePointer.middleButton;

  },

  preload: function () {

    //  Load assets required for our preloader
    this.load.image("preloaderBar", "assets/images/preloader-bar.png");
    this.load.image("preloaderBarBg", "assets/images/preloader-bar-bg.png");

  },

  create: function () {

    //  By this point the preloader assets have loaded to the cache. So now
    //  let"s start the real preloader going
    this.state.start("Preloader");
  }

};
