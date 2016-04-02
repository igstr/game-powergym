
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

    // Fonts

    this.load.bitmapFont("carrierCommand", "assets/fonts/bitmapFonts/carrier_command.png", "assets/fonts/bitmapFonts/carrier_command.xml");

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
    this.load.spritesheet("playerLvl1Arms", "assets/sprites/lvl1/player/arms270x375.png", 270, 375);
    this.load.spritesheet("playerLvl1FallDown", "assets/sprites/lvl1/player/body-fall_down618x336.png", 618, 336);
    this.load.spritesheet("lvl1Bar0", "assets/sprites/lvl1/bar0_400x350.png", 400, 350);
    this.load.spritesheet("lvl1Bar1", "assets/sprites/lvl1/bar1_400x350.png", 400, 350);
    this.load.spritesheet("lvl1Bar2", "assets/sprites/lvl1/bar2_400x350.png", 400, 350);
    this.load.spritesheet("lvl1Bar0FallDown", "assets/sprites/lvl1/bar0-fall_down755x369.png", 755, 369);
    this.load.spritesheet("lvl1Bar1FallDown", "assets/sprites/lvl1/bar1-fall_down755x369.png", 755, 369);
    this.load.spritesheet("lvl1Bar2FallDown", "assets/sprites/lvl1/bar2-fall_down755x369.png", 755, 369);

    this.load.image("playerLvl2Body", "assets/sprites/lvl2/player/body.png");
    this.load.image("playerLvl2Head", "assets/sprites/lvl2/player/head.png");
    this.load.physics("playerLvl2HeadPhysics", "assets/sprites/lvl2/player/head.json");
    this.load.image("playerLvl2LeftArm", "assets/sprites/lvl2/player/left-arm.png");
    this.load.physics("playerLvl2LeftArmPhysics", "assets/sprites/lvl2/player/left-arm.json");
    this.load.image("playerLvl2RightArm", "assets/sprites/lvl2/player/right-arm.png");
    this.load.physics("playerLvl2RightArmPhysics", "assets/sprites/lvl2/player/right-arm.json");

    // Icons
    this.load.image("whiteArrow", "assets/sprites/arrow.png");

    // Buttons
    this.load.spritesheet("btnLvl1", "assets/buttons/btn-lvl1_100x100.png", 100, 100);
    this.load.spritesheet("btnLvl2", "assets/buttons/btn-lvl2_100x100.png", 100, 100);
    this.load.spritesheet("btnLvl3", "assets/buttons/btn-lvl3_100x100.png", 100, 100);
    this.load.spritesheet("btnLvl4", "assets/buttons/btn-lvl4_100x100.png", 100, 100);
    this.load.spritesheet("btnArrow", "assets/buttons/btn-arrow45x45.png", 45, 45);
    this.load.image("btnGoBack", "assets/buttons/btn-go_back.png");
    this.load.image("btnPlay", "assets/buttons/btn-play.png");

    // Menus
    this.load.image("menuLvlOptionsBg", "assets/menus/lvl_options/bg.png");
    this.load.spritesheet("menuLvlOptionsLvl1Weights", "assets/menus/lvl_options/weights165x120.png", 165, 120);
    this.load.spritesheet("btnMenuLvlOptionsArrow", "assets/menus/lvl_options/btn-arrow55x120.png", 55, 120);
    this.load.spritesheet("btnCancel", "assets/menus/lvl_options/btn-cancel110x85.png", 110, 85);
    this.load.spritesheet("btnOk", "assets/menus/lvl_options/btn-ok110x85.png", 110, 85);

    this.load.image("menuLvlStatsBg", "assets/menus/lvl_stats/bg.png");
    this.load.image("menuLvlStatsMeter", "assets/menus/lvl_stats/meter.png");
    this.load.image("menuLvlStatsMeterIndicator", "assets/menus/lvl_stats/meter-indicator.png");
    this.load.spritesheet("btnNext", "assets/menus/lvl_stats/btn-next110x85.png", 110, 85);

    // Backgrounds
    this.load.image("bgMainMenu", "assets/sprites/bg-main_menu.png");
    this.load.image("bgHome", "assets/sprites/home/bg.png");
    this.load.image("bgLvl1", "assets/sprites/lvl1/bg.png");
    this.load.image("bgLvl2", "assets/sprites/lvl2/bg.png");
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
