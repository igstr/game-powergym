
PowerGym.Prefabs.MenuLvlStats = function(game, nextCallback, params, maxPoints) {

  this.game = game;
  this.isMobile = !game.game.device.desktop || PowerGym.UserData.forceMobile;

  this.maxPoints = maxPoints;
  this.nextBtnCallbackParam = nextCallback;

  var textSize = 16,
      textScaleX = 0.9;

  if (!params) {
    this.params = [
      {
        name: "Reps",
        amount: 12,
        multiplier: 3
      },
      {
        name: "Speed bonus",
        amount: 1200,
        multiplier: 1
      },
      {
        name: "Difficulty bonus",
        amount: 500,
        multiplier: 1
      },
      {
        name: "Respect points",
        amount: 550,
        multiplier: 1
      }
    ];
  } else {
    this.params = params;
  }

  // Groups
  this.window = game.add.group(game.world, "menuLvlStatsWindow");
  this._statsMeter = game.add.group(this.window, "menuLvlStatsMeter");
  this._windowTexts = game.add.group(this.window, "menuLvlStatsTexts");

  // BG
  this._windowSprite = game.add.sprite(0, 0, "menuLvlStatsBg", 0, this.window);
  this.window.sendToBack(this._windowSprite);

  var windowPadding = 40;

  // Next Button
  this.btnNext = game.add.button(0, 0, "btnNext", this.nextBtnCallback, this, 1, 0, 2, 0, this.window);
  if (this.isMobile) {
    this.btnNext.scale.set(1.5);
  }
  this.btnNext.x = this.window.width / 2 - this.btnNext.width / 2;
  this.btnNext.y = this.window.height - this.btnNext.height - windowPadding / 2;

  // Meter
  this._meterIndicator = game.add.sprite(0, 0, "menuLvlStatsMeterIndicator", 0, this._statsMeter);
  this._meterBorder = game.add.sprite(0, 0, "menuLvlStatsMeter", 0, this._statsMeter);
  this._meterIndicator.y = this._meterBorder.height - 20;
  this._meterIndicator.x = 4;
  this._statsMeter.scale.set(1.2);
  this._statsMeter.x = this.window.width
    - this._statsMeter.width
    - windowPadding;
  // this._statsMeter.y = this.btnNext.top - this._statsMeter.height - 10;
  this._statsMeter.y = this.window.height / 2 - this._statsMeter.height / 2;

  // Vars

  this.iterationStartTime = game.time.now;
  this.currentTextLine = 0;
  this.texts = [];
  this.total = 0;

  // Texts
  this._windowTexts.scale.x = textScaleX;

  if (this.params !== undefined) {

    var paramNumX = this._statsMeter.x - windowPadding / 3;

    for (var i = 0, l = this.params.length; i < l; i++) {

      var textLineY = 0;

      // If previuos one exist
      if (this.texts[i - 1] && this.texts[i - 1].paramName) {
        textLineY = this.texts[i - 1].paramName.y + textSize * 2;
      }

      // Creating all text objects
      this.texts[i] = {};
      this.texts[i].paramName = game.add.bitmapText(0, textLineY, "carrierCommand", this.params[i].name + ": ", textSize, this._windowTexts);
      this.texts[i].paramNum = game.add.bitmapText(paramNumX, textLineY, "carrierCommand", this.params[i].amount.toString(), textSize, this._windowTexts);
      this.texts[i].paramNum.anchor.x = 1;
      this.texts[i].paramName.tint = 0;
      this.texts[i].paramNum.tint = 0;

      // Counting total points
      this.total += this.params[i].amount * this.params[i].multiplier;
    }

    var yForTotal = this.texts[this.texts.length - 1].paramName.y + textSize * 4;

    this.textTotal = {};
    this.textTotal.paramName = game.add.bitmapText(0, yForTotal, "carrierCommand", "Total score: ", textSize, this._windowTexts);
    this.textTotal.paramNum = game.add.bitmapText(paramNumX, yForTotal, "carrierCommand", this.total.toString(), textSize, this._windowTexts);
    this.textTotal.paramNum.anchor.x = 1;
    this.textTotal.paramName.tint = 0;
    this.textTotal.paramNum.tint = 0;

  }

  // Place texts
  // console.log(this.btnNext.top - this._statsMeter.y);
  this._windowTexts.x = windowPadding;
  this._windowTexts.y = this._statsMeter.y
    + (this.btnNext.top - this._statsMeter.y) / 2
    - this._windowTexts.height / 2;

  this._windowTexts.forEach(function(item) {
    item.visible = false;
  }, this);

  this.lineCountTimer = game.time.create(false);
  this.lineCountTimer.start();
  game.time.events.repeat(500, 1, this.countLines, this);

  // Skip current line if user clicked anywhere in the window
  this._windowSprite.inputEnabled = true;
  this._windowSprite.events.onInputDown.add(function() {
    this.skipCurrentLine();
  }, this);

};

PowerGym.Prefabs.MenuLvlStats.prototype = {

  update: function() {


  },

  /**
   * Plays counting animations on each of lines
   */
  countLines: function() {

    this._currentTextParamNum = 0;

    this.lineCountTimerEvent = this.lineCountTimer.loop(0, function() {

      if (this.currentTextLine >= this.texts.length) {
        this.lineCountTimer.destroy();
        this.textTotal.paramName.visible = true;
        this.textTotal.paramNum.visible = true;
        this.updateStatsMeter();
        return;
      }

      if (!this.texts[this.currentTextLine].paramName.visible) {
        this.texts[this.currentTextLine].paramName.visible = true;
        this.texts[this.currentTextLine].paramNum.visible = true;
      }

      var valueStep = Math.pow(10, this.params[this.currentTextLine].amount.toString().length - 1),
          nextValue = this._currentTextParamNum + valueStep * this.game.time.physicsElapsed,
          toValue = this.params[this.currentTextLine].amount;

      if (nextValue > toValue) {
        this.texts[this.currentTextLine].paramNum.text = toValue;
        this._currentTextParamNum = 0
        this.currentTextLine++;
      } else {
        this._currentTextParamNum = nextValue;
        this.texts[this.currentTextLine].paramNum.text = Math.round(nextValue);
      }

      this.updateStatsMeter();

    }, this);

  },

  nextBtnCallback: function() {

    // if count not done skip lines else call passed parameter callback
    if (!this.textTotal.paramName.visible) {
      this.skipCurrentLine();
    } else {
      this.nextBtnCallbackParam.call(this.game);
    }

  },

  skipCurrentLine: function() {

    // If timer is still looping
    if (this.lineCountTimer.length) {

      if (!this.texts[this.currentTextLine].paramName.visible) {
        this.texts[this.currentTextLine].paramName.visible = true;
        this.texts[this.currentTextLine].paramNum.visible = true;
      }
      this.lineCountTimer.remove(this.lineCountTimerEvent);
      this.texts[this.currentTextLine].paramNum.text = this.params[this.currentTextLine].amount;
      this.currentTextLine++;
      this.countLines();
    }
    this.updateStatsMeter();

  },

  updateStatsMeter: function() {

    var currentPoints = 0;
    if (this.currentTextLine >= this.texts.length) {
      currentPoints = this.total;
    } else {
      for (var i = 0; i <= this.currentTextLine; i++) {
        if (i == this.currentTextLine) {
          currentPoints += parseInt(this.texts[i].paramNum.text);
        } else {
          currentPoints += this.params[i].amount;
        }
      }
    }

    this._meterIndicator.y = this._meterBorder.height * (1 - (currentPoints / this.maxPoints)) - 20;

  },

  destroy: function() {

    this.window.destroy();

  },

}
