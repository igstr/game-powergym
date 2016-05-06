
PowerGym.Prefabs.MenuLvlOptions = function(game, lvlNum, okCallback, cancelCallback) {

  var isMobile = !game.game.device.desktop || PowerGym.UserData.forceMobile;

  this.window = game.add.group(game.world, "menuLvlOptionsWindow");
  game.add.sprite(0, 0, "menuLvlOptionsBg", 0, this.window);

  if (lvlNum == 1 || lvlNum == 2) {

    var btnOk = game.add.button(0, 0, "btnOk", okCallback, game, 1, 0, 2, 0, this.window),
        btnCancel = game.add.button(0, 0, "btnCancel", cancelCallback, game, 1, 0, 2, 0, this.window),
        btnMargin = 10;

    if (isMobile) {
      btnOk.scale.set(1.4);
      btnCancel.scale.set(1.4);
    }
    btnOk.x = this.window.width / 2 + btnMargin;
    btnOk.y = this.window.height - this.window.height / 4;
    btnCancel.x = this.window.width / 2 - btnCancel.width - btnMargin;
    btnCancel.y = this.window.height - this.window.height / 4;

  }

  if (lvlNum == 1 || lvlNum == 2) {

    if (lvlNum == 1 && typeof PowerGym.UserData.lvl1Difficulty == "undefined") {
      PowerGym.UserData.lvl1Difficulty = 0;
    }
    if (lvlNum == 2 && typeof PowerGym.UserData.lvl2Difficulty == "undefined") {
      PowerGym.UserData.lvl2Difficulty = 0;
    }

    // Weights
    this._weights = [];
    for (var i = 0; i < 3; i++) {
      this._weights[i] = game.add.sprite(0, 0, "menuLvlOptionsLvl" + lvlNum + "Weights", i, this.window);
      if (isMobile) {
        this._weights[i].scale.set(1.4);
      }
      this._weights[i].x = this.window.width / 2 - this._weights[i].width / 2;
      this._weights[i].y = isMobile ? (this.window.height / 9) * 3 : (this.window.height / 5) * 2;

      if (lvlNum == 1) {
        if (PowerGym.UserData.lvl1Difficulty != i) {
          this._weights[i].visible = false;
        }
      } else if (lvlNum == 2) {
        if (PowerGym.UserData.lvl2Difficulty != i) {
          this._weights[i].visible = false;
        }
      }
    }
  }

  if (lvlNum == 1 || lvlNum == 2) {

    var leftArrowCallback, rightArrowCallback;

    if (lvlNum == 1) {
      leftArrowCallback = this.btnLeftArrowCallback1;
      rightArrowCallback = this.btnRightArrowCallback1;
    } else if (lvlNum == 2) {
      leftArrowCallback = this.btnLeftArrowCallback2;
      rightArrowCallback = this.btnRightArrowCallback2;
    }

    var btnLeftArrow = game.add.button(0, 0, "btnMenuLvlOptionsArrow", leftArrowCallback, this, 1, 0, 1, 0, this.window),
        btnRightArrow = game.add.button(0, 0, "btnMenuLvlOptionsArrow", rightArrowCallback, this, 1, 0, 1, 0, this.window);

    if (isMobile) {
      btnLeftArrow.scale.set(1.4);
      btnRightArrow.scale.set(1.4);
    }
    btnLeftArrow.anchor.y = 0.5;
    btnLeftArrow.anchor.x = 1;
    btnLeftArrow.x = btnCancel.left - 30;
    btnLeftArrow.y = (this.window.height / 8) * 3;
    btnRightArrow.anchor.y = 0.5;
    btnRightArrow.anchor.x = 0.9; // turetų būt 1 bet turbūt nelygios rodyklės
    btnRightArrow.x = btnOk.right + 30;
    btnRightArrow.y = (this.window.height / 8) * 3;
    btnRightArrow.rotation = Math.PI;

  }

};

PowerGym.Prefabs.MenuLvlOptions.prototype = {

  update: function() {

  },

  destroy: function() {

    this.window.destroy();

  },

  btnLeftArrowCallback1: function() {

    var nextIndex = PowerGym.UserData.lvl1Difficulty - 1;
    if (nextIndex >= 0) {
      this._weights[PowerGym.UserData.lvl1Difficulty].visible = false;
      this._weights[nextIndex].visible = true;
      PowerGym.UserData.lvl1Difficulty = nextIndex;
    }

  },

  btnRightArrowCallback1: function() {

    var nextIndex = PowerGym.UserData.lvl1Difficulty + 1;
    if (nextIndex < this._weights.length) {
      this._weights[PowerGym.UserData.lvl1Difficulty].visible = false;
      this._weights[nextIndex].visible = true;
      PowerGym.UserData.lvl1Difficulty = nextIndex;
    }

  },

  btnLeftArrowCallback2: function() {

    var nextIndex = PowerGym.UserData.lvl2Difficulty - 1;
    if (nextIndex >= 0) {
      this._weights[PowerGym.UserData.lvl2Difficulty].visible = false;
      this._weights[nextIndex].visible = true;
      PowerGym.UserData.lvl2Difficulty = nextIndex;
    }

  },

  btnRightArrowCallback2: function() {

    var nextIndex = PowerGym.UserData.lvl2Difficulty + 1;
    if (nextIndex < this._weights.length) {
      this._weights[PowerGym.UserData.lvl2Difficulty].visible = false;
      this._weights[nextIndex].visible = true;
      PowerGym.UserData.lvl2Difficulty = nextIndex;
    }

  }
}
