
PowerGym.States.MainMenu = function (game) {

  this.gameScale = 0;

};

PowerGym.States.MainMenu.prototype = {

  create: function() {

    this.gameScale = PowerGym.gameScale;

    this.bgImage = this.add.sprite(0, 0, "bgMainMenu");
    this.adjustGameObject("bg");

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

    this.adjustGameObject("titleAndPlayBtn");

    this.copyrightText = this.game.add.bitmapText(0, 0, "carrierCommand", "A game by Ignas Strimaitis", 8);
    this.adjustGameObject("copyrightText");

  },

  update: function() { },

  adjustGameObject: function(name) {

    switch (name) {
      case "titleAndPlayBtn":
        var marginTitlePlayBtn = 15 * this.gameScale;

        this.title.scale.set(1.3 * this.gameScale);
        this.btnPlay.scale.set(this.gameScale);
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
        break;
      case "copyrightText":
        var margin = 25 * this.gameScale;
        this.copyrightText.y = this.game.height - this.copyrightText.fontSize - margin;
        this.copyrightText.x = margin;
        break;
      default:
    }

  },

  render: function() {

    // If window was resized readjusting game objects
    if (this.gameScale != PowerGym.gameScale) {

      this.gameScale = PowerGym.gameScale;
      var gameObjectsToAdjust = ["bg", "titleAndPlayBtn", "copyrightText"];
      for (var i = 0, l = gameObjectsToAdjust.length; i < l; i++) {
        this.adjustGameObject(gameObjectsToAdjust[i]);
      }
    }

  },

  btnPlayCallback: function() {

    this.state.start("Home");

  },

};
