
PowerGym.Prefabs.MenuLvlOptions = function(game, lvlNum, okCallback, cancelCallback) {

  this._menuWindow = game.add.group(game.world, "menuLvlOptionsWindow");
  game.add.sprite(0, 0, "menuLvlOptionsBg", 0, this._menuWindow);

  if (lvlNum === 1) {

    var btnOk = game.add.button(0, 0, "btnOk", okCallback, game, 1, 0, 2, 0, this._menuWindow),
        btnCancel = game.add.button(0, 0, "btnCancel", cancelCallback, game, 1, 0, 2, 0, this._menuWindow),
        btnMargin = 10;

    btnOk.x = this._menuWindow.width / 2 + btnMargin;
    btnOk.y = this._menuWindow.height - this._menuWindow.height / 4;
    btnCancel.x = this._menuWindow.width / 2 - btnCancel.width - btnMargin;
    btnCancel.y = this._menuWindow.height - this._menuWindow.height / 4;


    if (typeof PowerGym.GameData.lvl1Difficulty == "undefined") {
      PowerGym.GameData.lvl1Difficulty = 0;
    }

    // Weights
    this._weights = [];
    for (var i = 0; i < 3; i++) {
      this._weights[i] = game.add.sprite(0, 0, "menuLvlOptionsLvl1Weights", i, this._menuWindow);
      this._weights[i].x = this._menuWindow.width / 2 - this._weights[i].width / 2;
      this._weights[i].y = (this._menuWindow.height / 5) * 2;

      if (PowerGym.GameData.lvl1Difficulty != i) {
        this._weights[i].visible = false;
      }
    }

    var btnLeftArrow = game.add.button(0, 0, "btnMenuLvlOptionsArrow", this.btnLeftArrowCallback, this, 1, 0, 1, 0, this._menuWindow),
        btnRightArrow = game.add.button(0, 0, "btnMenuLvlOptionsArrow", this.btnRightArrowCallback, this, 1, 0, 1, 0, this._menuWindow);

    btnLeftArrow.anchor.y = 0.5;
    btnLeftArrow.anchor.x = 1;
    btnLeftArrow.x = btnCancel.left - 30;
    btnLeftArrow.y = (this._menuWindow.height / 7) * 3;
    btnRightArrow.anchor.y = 0.5;
    btnRightArrow.anchor.x = 0.9; // turetų būt 1 bet turbūt nelygios rodyklės
    btnRightArrow.x = btnOk.right + 30;
    btnRightArrow.y = (this._menuWindow.height / 7) * 3;
    btnRightArrow.rotation = Math.PI;

    // Positioning the whole window in the center of screen
    this._menuWindow.x = game.world.centerX - this._menuWindow.width / 2;
    this._menuWindow.y = game.world.centerY - this._menuWindow.height / 2;
  }

};

PowerGym.Prefabs.MenuLvlOptions.prototype = {

  update: function() {

  },

  destroy: function() {

    this._menuWindow.destroy();

  },

  btnLeftArrowCallback: function() {

    var nextIndex = PowerGym.GameData.lvl1Difficulty - 1;
    if (nextIndex >= 0) {
      this._weights[PowerGym.GameData.lvl1Difficulty].visible = false;
      this._weights[nextIndex].visible = true;
      PowerGym.GameData.lvl1Difficulty = nextIndex;
    }

  },

  btnRightArrowCallback: function() {

    var nextIndex = PowerGym.GameData.lvl1Difficulty + 1;
    if (nextIndex < this._weights.length) {
      this._weights[PowerGym.GameData.lvl1Difficulty].visible = false;
      this._weights[nextIndex].visible = true;
      PowerGym.GameData.lvl1Difficulty = nextIndex;
    }

  }

}
