
PowerGym.States.MainMenu = function (game) {

  this.gameScale = 0;

};

PowerGym.States.MainMenu.prototype = {

  create: function() {

    this.gameScale = PowerGym.GameData.scale;

    this.bgImage = this.add.sprite(0, 0, "bgMainMenu");

    this.titleAndPlayBtn = this.add.group(this.world);
    this.title = this.add.group(this.titleAndPlayBtn, "gameTitleMainMenu");
    this.titleBlack = this.add.image(0, 0, "gameTitleMainMenuBlack", 0, this.title);
    this.titleWhite = this.add.image(0, 0, "gameTitleMainMenuWhite", 0, this.title);
    this.titleBlack.anchor.set(0.5);
    this.titleBlack.x = this.titleBlack.width / 2;
    this.titleBlack.y = this.titleBlack.height / 2;
    PowerGym.Mixins.withFloatAnim.call(this.titleBlack, 3);
    this.titleBlack.startFloat();
    PowerGym.Mixins.withTeeterAnim.call(this.titleBlack, 2, 4);
    this.titleBlack.startTeeter();
    this.btnPlay = this.add.button(0, 0, "btnPlay", this.btnPlayCallback, this, 1, 0, 2, 0, this.titleAndPlayBtn);
    PowerGym.Mixins.withFloatAnim.call(this.btnPlay);
    this.btnPlay.startFloat();


    this.copyrightText = this.game.add.bitmapText(0, 0, "carrierCommand", "A game by igstr", 8);

    this.putEverythingInPlace();

  },

  update: function() { },

  placeGameObject: function(name) {

    var isMobile = !this.game.device.desktop || PowerGym.UserData.forceMobile;

    switch (name) {
      case "titleAndPlayBtn":
        var marginTitlePlayBtn = 15 * this.gameScale;

        var titleScale = isMobile ? 1.8 * this.gameScale : 1.3 * this.gameScale;
        this.title.scale.set(titleScale);
        var btnPlayScale = isMobile ? this.gameScale * 1.6 : this.gameScale;
        this.btnPlay.scale.set(btnPlayScale);
        this.btnPlay.y = this.title.height + marginTitlePlayBtn * 2;
        this.btnPlay.x = this.title.width / 2 - this.btnPlay.width / 2;
        if (typeof this.btnPlay.setFloatStartPosition == "function") {
          this.btnPlay.setFloatStartPosition(new Phaser.Point(this.btnPlay.x, this.btnPlay.y));
        }

        this.titleAndPlayBtn.x = this.game.width / 2 - this.title.width / 2;
        this.titleAndPlayBtn.y = this.game.height / 2 - this.titleAndPlayBtn.height / 2;

        break;
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "copyrightText":
        this.copyrightText.fontSize = 8;
        var margin = 25 * this.gameScale;
        this.copyrightText.y = this.game.height - this.copyrightText.fontSize - margin;
        this.copyrightText.x = margin;
        this.
        break;
      default:
    }

  },

  putEverythingInPlace: function() {

    var gameObjectsToAdjust = ["bg", "titleAndPlayBtn", "copyrightText"];
    for (var i = 0, l = gameObjectsToAdjust.length; i < l; i++) {
      this.placeGameObject(gameObjectsToAdjust[i]);
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

  btnPlayCallback: function() {

    this.state.start("Home");

  },

};
