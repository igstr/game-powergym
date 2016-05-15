
PowerGym.States.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  this.ready = false;

};

PowerGym.States.Preloader.prototype = {

  preload: function () {

    //  These are the assets we loaded in Boot.js
    //  A nice sparkly background and a loading progress bar
    // this.background = this.add.sprite(0, 0, "preloaderBackground");
    // this.preloadBar = this.add.sprite(300, 400, "preloaderBar");

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    // this.load.setPreloadSprite(this.preloadBar);

    // Texts

    this.load.bitmapFont("carrierCommand", "assets/fonts/bitmapFonts/carrier_command.png", "assets/fonts/bitmapFonts/carrier_command.xml");
    this.load.image("gameTitleMainMenuBlack", "assets/images/title-main_menu-black.png")
    this.load.image("gameTitleMainMenuWhite", "assets/images/title-main_menu-white.png")

    // Player
    this.load.spritesheet("playerHomeHead", "assets/sprites/home/player/head55x75.png", 55, 75);
    this.load.spritesheet("playerHomeLeftArm", "assets/sprites/home/player/left_arm60x150.png", 60, 150);
    this.load.spritesheet("playerHomeLefgLeg", "assets/sprites/home/player/left_leg40x165.png", 40, 165);
    this.load.spritesheet("playerHomeRightArm", "assets/sprites/home/player/right_arm60x155.png", 60, 155);
    this.load.spritesheet("playerHomeRightLeg", "assets/sprites/home/player/right_leg44x170.png", 44, 170);
    this.load.spritesheet("playerHomeTorso", "assets/sprites/home/player/torso80x165.png", 80, 165);
    this.load.image("playerHomeShorts", "assets/sprites/home/player/shorts.png");
    this.load.image("playerHomeFace", "assets/sprites/home/player/face.png");
    this.load.image("playerHomeSixPack", "assets/sprites/home/player/six_pack.png");

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
    this.load.atlas("playerLvl2ArmsAtlas", "assets/sprites/lvl2/player/arms-atlas.png", "assets/sprites/lvl2/player/arms-atlas.json");
    this.load.physics("playerLvl2ArmsPhysics", "assets/sprites/lvl2/player/arms-physics.json");
    this.load.spritesheet("playerLvl2BodyAnimations", "assets/sprites/lvl2/player/player260x400.png", 260, 400);

    this.load.spritesheet("playerLvl3Run", "assets/sprites/lvl3/player/run200x320.png", 200, 320);
    this.load.spritesheet("playerLvl3Falloff", "assets/sprites/lvl3/player/falloff700x340.png", 700, 340);

    this.load.spritesheet("playerLvl4", "assets/sprites/lvl4/player500x310.png", 500, 310);

    // Icons
    this.load.image("whiteArrow", "assets/sprites/arrow.png");

    // Buttons
    this.load.spritesheet("btnLvl1", "assets/buttons/btn-lvl1_100x100.png", 100, 100);
    this.load.spritesheet("btnLvl2", "assets/buttons/btn-lvl2_100x100.png", 100, 100);
    this.load.spritesheet("btnLvl3", "assets/buttons/btn-lvl3_100x100.png", 100, 100);
    this.load.spritesheet("btnLvl4", "assets/buttons/btn-lvl4_100x100.png", 100, 100);
    this.load.spritesheet("btnArrow", "assets/buttons/btn-arrow45x45.png", 45, 45);
    this.load.spritesheet("btnW", "assets/buttons/btn-w45x45.png", 45, 45);
    this.load.image("btnGoBack", "assets/buttons/btn-go_back.png");
    this.load.spritesheet("btnPlay", "assets/buttons/btn-play.png", 160, 85);
    this.load.spritesheet("btnMobile", "assets/buttons/btn-mobile75x75.png", 75, 75);
    this.load.spritesheet("btnMobileOn", "assets/buttons/btn-mobile-on75x75.png", 75, 75);
    this.load.spritesheet("btnBin", "assets/buttons/btn-bin75x75.png", 75, 75);

    // Menus
    this.load.image("menuLvlOptionsBg", "assets/menus/lvl_options/bg.png");
    this.load.spritesheet("menuLvlOptionsLvl1Weights", "assets/menus/lvl_options/weights-lvl1_165x120.png", 165, 120);
    this.load.spritesheet("menuLvlOptionsLvl2Weights", "assets/menus/lvl_options/weights-lvl2_170x70.png", 170, 70);
    this.load.spritesheet("btnMenuLvlOptionsArrow", "assets/menus/lvl_options/btn-arrow55x120.png", 55, 120);
    this.load.spritesheet("btnCancel", "assets/menus/lvl_options/btn-cancel110x85.png", 110, 85);
    this.load.spritesheet("btnOk", "assets/menus/lvl_options/btn-ok110x85.png", 110, 85);

    this.load.image("menuLvlStatsBg", "assets/menus/lvl_stats/bg.png");
    this.load.image("menuLvlStatsMeter", "assets/menus/lvl_stats/meter.png");
    this.load.image("menuLvlStatsMeterIndicator", "assets/menus/lvl_stats/meter-indicator.png");
    this.load.spritesheet("btnNext", "assets/menus/lvl_stats/btn-next110x85.png", 110, 85);

    this.load.image("lvl1Info", "assets/menus/lvl_info/lvl1.png");
    this.load.image("lvl2Info", "assets/menus/lvl_info/lvl2.png");
    this.load.image("lvl3Info", "assets/menus/lvl_info/lvl3.png");

    // Backgrounds
    this.load.image("bgMainMenu", "assets/images/bg-main_menu.png");
    this.load.image("bgHome", "assets/sprites/home/bg.png");
    this.load.image("bgLvl1", "assets/sprites/lvl1/bg.png");
    this.load.image("bgLvl2", "assets/sprites/lvl2/bg.png");
    this.load.image("bgLvl3", "assets/sprites/lvl3/bg.png");
    this.load.image("bgLvl4", "assets/sprites/lvl4/bg.png");

    this.load.spritesheet("treadmillTrack", "assets/sprites/lvl3/treadmill_track500x75.png", 500, 75);

  },

  create: function () {

    // this.stage.setBackgroundColor("#fff123");

    if (!PowerGym.MAIN_MENU_DISABLED) {
      this.state.start("MainMenu");
    } else {
      this.state.start("Home");
    }

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
