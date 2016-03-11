
PowerGym.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  this.ready = false;

};

PowerGym.Preloader.prototype = {

  preload: function () {

    //  These are the assets we loaded in Boot.js
    //  A nice sparkly background and a loading progress bar
    // this.background = this.add.sprite(0, 0, "preloaderBackground");
    // this.preloadBar = this.add.sprite(300, 400, "preloaderBar");

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    // this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    //  As this is just a Project Template I"ve not provided these assets, swap them for your own.

    // this.load.image("titlepage", "images/title.jpg");
    // this.load.atlas("playButton", "images/play_button.png", "images/play_button.json");
    // this.load.audio("titleMusic", ["audio/main_menu.mp3"]);
    // this.load.bitmapFont("caslon", "fonts/caslon.png", "fonts/caslon.xml");
    //  + lots of other required assets here

    // Player
    this.load.image("playerHomeHead", "assets/sprites/home/player/head.png");
    this.load.image("playerHomeLeftArm", "assets/sprites/home/player/left_arm.png");
    this.load.image("playerHomeLefgLeg", "assets/sprites/home/player/left_leg.png");
    this.load.image("playerHomeRightArm", "assets/sprites/home/player/right_arm.png");
    this.load.image("playerHomeRightLeg", "assets/sprites/home/player/right_leg.png");
    this.load.image("playerHomeShorts", "assets/sprites/home/player/shorts.png");
    this.load.image("playerHomeTorso", "assets/sprites/home/player/torso.png");

    this.load.image("playerLvl1Body", "assets/sprites/lvl1/player/body.png");
    this.load.image("playerLvl1Head", "assets/sprites/lvl1/player/head.png");
    this.load.spritesheet("playerLvl1Arms", "assets/sprites/lvl1/player/arms400x350.png", 400, 350);

    // Buttons
    this.load.spritesheet("btnLvl1", "assets/sprites/buttons/btn-lvl1-sheet.png", 100, 100);
    this.load.spritesheet("btnLvl2", "assets/sprites/buttons/btn-lvl2-sheet.png", 100, 100);
    this.load.spritesheet("btnLvl3", "assets/sprites/buttons/btn-lvl3-sheet.png", 100, 100);
    this.load.spritesheet("btnLvl4", "assets/sprites/buttons/btn-lvl4-sheet.png", 100, 100);
    this.load.image("btnGoBack", "assets/sprites/buttons/btn-go_back.png");
    this.load.image("btnPlay", "assets/sprites/buttons/btn-play.png");

    // Backgrounds
    this.load.image("bgMainMenu", "assets/sprites/bg-main_menu.png");
    this.load.image("bgHome", "assets/sprites/home/bg-home.png");
    this.load.image("bgLvl1", "assets/sprites/lvl1/bg-lvl1.png");
  },

  create: function () {

    // this.stage.setBackgroundColor("#fff123");

    // this.state.start("MainMenu");
    this.state.start("Home");

    //  Once the load has finished we disable the crop because we"re going to sit in the update loop for a short while as the music decodes
    // this.preloadBar.cropEnabled = false;

  },

  update: function () {

    //  You don"t actually need to do this, but I find it gives a much smoother game experience.
    //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
    //  You can jump right into the menu if you want and still play the music, but you"ll have a few
    //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
    //  it"s best to wait for it to decode here first, then carry on.

    //  If you don"t have any music in your game then put the game.state.start line into the create function and delete
    //  the update function completely.


    // if (this.cache.isSoundDecoded("titleMusic") && this.ready == false)
    // {
    //     this.ready = true;
    //     this.state.start("MainMenu");
    // }

  }

};
