
PowerGym.States.Lvl3 = function(game) { };

PowerGym.States.Lvl3.prototype = {

  create: function () {

    this.gameScale = PowerGym.GameData.scale;

    this.bgImage = this.add.image(0, 0, "bgMainMenu");
    this.adjustGameObject("bg");

    this.btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this);
    this.adjustGameObject("btnGoBack");

  },

  update: function () { },

  adjustGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        break;

      case "btnGoBack":
        var margin = 20 * this.gameScale;
        this.btnGoBack.x = margin;
        this.btnGoBack.y = this.game.height - this.btnGoBack.height - margin;
        break;
      default:
    }

  },

  render: function() {

    // If window was resized readjusting game objects
    if (this.gameScale != PowerGym.GameData.scale) {

      this.gameScale = PowerGym.GameData.scale;
      var gameObjectsToAdjust = ["bg", "btnGoBack"];
      for (var i = 0, l = gameObjectsToAdjust.length; i < l; i++) {
        this.adjustGameObject(gameObjectsToAdjust[i]);
      }
    }

  },

  btnGoBackCallback: function() {

    this.state.start("Home");

  }

};
