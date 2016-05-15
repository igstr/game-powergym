
PowerGym.States.Lvl1 = function(game) { };

PowerGym.States.Lvl1.prototype = {

  create: function() {

    this.gameScale = PowerGym.GameData.scale;
    this.aspectRatio = PowerGym.GameData.aspectRatio;
    this.isMobile = !this.game.device.desktop || PowerGym.UserData.forceMobile;

    this.userForce = {x: 0, y: 0};
    this.isPlaying = false;
    this.fallenDown = false;
    this.failCounter = 0;
    this.repsCounter = 0;
    this.reachedRepBottom = false;
    this.playerHealthStep = 0;

    // Just in case arcade system is not started
    this.physics.startSystem(Phaser.Physics.ARCADE);

    // BACKGROUND
    //-------------------

    this.bgImage = this.add.image(0, 0, "bgLvl1");

    // PLAYER
    //-------------------

    this.player = new PowerGym.Prefabs.PlayerLvl1(this, 0, 0);
    this.player.balance = 0.5;
    this.player.pressFrac = 1;

    // BALANCE INDICATOR
    //-------------------

    this.indicatorAmplitude = 200;
    this.indicatorWidth = 8;
    this.indicatorHeight = 8;
    var indicatorBgWidth = this.indicatorAmplitude + this.indicatorWidth;

    this.grBalanceIndicator = this.add.group(this.world, "balanceIndicator");

    this.balanceIndicator = this.add.graphics(0, 0, this.grBalanceIndicator);
    this.balanceIndicator.beginFill(0xFFFFFF);
    this.balanceIndicator.drawRect(0, 0, this.indicatorWidth, this.indicatorHeight);
    this.balanceIndicator.endFill();
    this.balanceIndicator.x = this.indicatorAmplitude / 2;
    this.balanceIndicatorBg = this.add.graphics(0, 0, this.grBalanceIndicator);
    this.balanceIndicatorBg.beginFill(0xBFBFBF, 0.5);
    this.balanceIndicatorBg.drawRect(0, 0, indicatorBgWidth, this.indicatorHeight);
    this.balanceIndicatorBg.endFill();
    this.grBalanceIndicator.moveDown(this.balanceIndicatorBg);

    // Enabling physics
    this.balanceIndicator.anchor = {x: 0.5, y: 0.5};
    this.physics.enable(this.balanceIndicator, Phaser.Physics.ARCADE, true);

    // YOYO
    //-------------------

    // This thing is needed for unbalancing balance indicator

    // Tweening yoyo value from 0 to 1
    this.yoyo = { value: 0 };
    this.add.tween(this.yoyo).to({value: 1}, 2000, null, true, 0, -1, true);

    // GUI
    //-------------------

    // Reps counter text
    this.repsCounterText = this.add.bitmapText(this.world.centerX, 80, "carrierCommand", this.repsCounter);
    this.repsCounterText.anchor.setTo(0.5, 0.5);

    // Go back button
    this.btnGoBack = this.add.button(
        0,
        0,
        "btnGoBack",
        this.btnGoBackCallback,
        this
    );

    // Info window

    // If first time playing this level show info window
    if (PowerGym.UserData.Stats.overallLvl1Score == 0) {
      this.time.events.add(1500, function() {

        this.disableBtnGoBack();
        this.menuInfo = new PowerGym.Prefabs.MenuLvlInfo(this, 1, this.menuInfoOkBtnCallback);
        this.placeGameObject("menuInfo");

      }, this);
    } else {
      this.createOnscreenBtns();
      this.addGetReadyCallback();
    }

    this.putEverythingInPlace();

  },

  enableBtnGoBack: function() {

    this.btnGoBack.onInputUp.add(this.btnGoBackCallback, this);
    this.btnGoBack.freezeFrames = false;
    this.btnGoBack.input.useHandCursor = true;

  },

  disableBtnGoBack: function() {

    this.btnGoBack.onInputUp.remove(this.btnGoBackCallback, this);
    this.btnGoBack.freezeFrames = true;
    this.btnGoBack.input.useHandCursor = false;

  },

  createOnscreenBtns: function() {

    this.grOnScreenArrows = this.add.group(this.world, "onScreenArrowButtons");
    if (!this.isMobile) {
      var onScreenArrowMargin = 5;
      this.onScreenArrowDown = this.add.button(0, 0, "btnArrow", this.getReady, this, 1, 0, 2, 1, this.grOnScreenArrows);
      this.onScreenArrowDown.anchor.setTo(0.5, 0.5);
      this.onScreenArrowDown.rotation = -Math.PI / 2;
      this.onScreenArrowRight = this.add.sprite(this.onScreenArrowDown.width + onScreenArrowMargin, 0, "btnArrow", 0, this.grOnScreenArrows);
      this.onScreenArrowRight.anchor.setTo(0.5, 0.5);
      this.onScreenArrowRight.inputEnabled = true;
      this.onScreenArrowRight.rotation = Math.PI;
      this.onScreenArrowLeft = this.add.sprite(-this.onScreenArrowDown.width - onScreenArrowMargin, 0, "btnArrow", 0, this.grOnScreenArrows);
      this.onScreenArrowLeft.anchor.setTo(0.5, 0.5);
      this.onScreenArrowLeft.inputEnabled = true;
      this.onScreenArrowUp = this.add.button(0, -this.onScreenArrowDown.width - onScreenArrowMargin, "btnArrow", this.getReady, this, 1, 0, 2, 1, this.grOnScreenArrows);
      this.onScreenArrowUp.anchor.setTo(0.5, 0.5);
      this.onScreenArrowUp.rotation = Math.PI / 2;
    } else {
      var onScreenArrowMargin = 5;
      this.grOnScreenArrowsRight = this.add.group(this.grOnScreenArrows, "onScreenArrowButtons");
      this.onScreenArrowDown = this.add.button(0, 0, "btnArrow", this.getReady, this, 1, 0, 2, 0, this.grOnScreenArrowsRight);
      this.onScreenArrowDown.anchor.setTo(0.5, 0.5);
      this.onScreenArrowDown.rotation = -Math.PI / 2;
      this.onScreenArrowUp = this.add.button(0, -this.onScreenArrowDown.width - onScreenArrowMargin, "btnArrow", this.getReady, this, 1, 0, 2, 0, this.grOnScreenArrowsRight);
      this.onScreenArrowUp.anchor.setTo(0.5, 0.5);
      this.onScreenArrowUp.rotation = Math.PI / 2;

      this.grOnScreenArrowsLeft = this.add.group(this.grOnScreenArrows, "onScreenArrowButtons");
      this.onScreenArrowLeft = this.add.sprite(0, 0, "btnArrow", 0, this.grOnScreenArrowsLeft);
      this.onScreenArrowLeft.anchor.setTo(0.5, 0.5);
      this.onScreenArrowLeft.inputEnabled = true;
      this.onScreenArrowRight = this.add.sprite(this.onScreenArrowDown.width + onScreenArrowMargin, 0, "btnArrow", 0, this.grOnScreenArrowsLeft);
      this.onScreenArrowRight.anchor.setTo(0.5, 0.5);
      this.onScreenArrowRight.inputEnabled = true;
      this.onScreenArrowRight.rotation = Math.PI;
    }

  },

  getReady: function() {

    if (!this.isPlaying) {

      this.player.getReady();

      PowerGym.Keys.Up.onDown.remove(this.getReady, this);
      PowerGym.Keys.Down.onDown.remove(this.getReady, this);
      PowerGym.Keys.Left.onDown.remove(this.getReady, this);
      PowerGym.Keys.Right.onDown.remove(this.getReady, this);

      this.onScreenArrowDown.onInputUp.remove(this.getReady, this);
      this.onScreenArrowUp.onInputUp.remove(this.getReady, this);
    }

  },

  update: function() {

    // Updating reps counter text
    this.repsCounterText.text = this.repsCounter;

    // Updating on screen arrow states
    if (this.grOnScreenArrows && !this.fallenDown) {
      this.manageOnScreenArrowsStates();
    }

    // Wait untill player is ready and add input keys
    if (!this.isPlaying && this.player.isReady == true) {

      this.stateStartTime = this.game.time.now;
      this.isPlaying = true;

      PowerGym.Keys.Up.onDown.add(this.pressUp, this);
      PowerGym.Keys.Down.onDown.add(this.pressDown, this);

      this.onScreenArrowDown.onInputDown.add(this.pressDown, this);
      this.onScreenArrowUp.onInputDown.add(this.pressUp, this);
    }

    if (this.isPlaying && !this.fallenDown) {

      // Catching user input both on screen buttons and keyboard
      if (PowerGym.Keys.Right.isDown
          || this.onScreenArrowRight.input.pointerDown(this.input.activePointer.id)
      ) {
        this.userForce.x += 0.1 + 0.01 * this.repsCounter;
      } else if (PowerGym.Keys.Left.isDown
          || this.onScreenArrowLeft.input.pointerDown(this.input.activePointer.id)
      ) {
        this.userForce.x -= 0.1 + 0.01 * this.repsCounter;
      }

      // Adding drag to user force
      this.userForce.x = this.physics.arcade.computeVelocity(0, null, this.userForce.x, 0, 2);

      // Unbalancing balance indicator
      this.unbalanceAmplifier = 10 + this.repsCounter * 20;
      if (this.repsCounter > 0) {
        this.unbalanceAmplifier += this.player.pressFrac * 10;
      }
      this.toX = this.yoyo.value * this.unbalanceAmplifier + (this.indicatorAmplitude - this.unbalanceAmplifier) / 2;
      this.physics.arcade.accelerateToXY(this.balanceIndicator, this.toX, this.balanceIndicator.y);
      this.balanceIndicator.body.velocity.x += this.userForce.x;

      // Checking if indicator is in his amplitude
      if (this.balanceIndicator.x > this.indicatorAmplitude) {
        this.player.fallDown("right");
        this.fallenDown = true;
        this.endState();
      } else if (this.balanceIndicator.x < 0) {
        this.player.fallDown("left");
        this.fallenDown = true;
        this.endState();
      }

      // Reps counter
      if (this.player.pressFrac > 0.95 && this.reachedRepBottom) {
        this.reachedRepBottom = false;
        this.repsCounter++;
      } else if (!this.reachedRepBottom && this.player.pressFrac < 0.05) {
        this.reachedRepBottom = true;
      }

      // Adding drag to press fraction
      var newPressFrac = this.player.pressFrac;
      if (newPressFrac > 0.05 && newPressFrac < 0.95) {
        newPressFrac -= 0.01;
      }
      var newBalance = this.balanceIndicator.x / this.indicatorAmplitude;

      if (PowerGym.UserData.lvl1Difficulty == 2) {
        // Reducing player health if too long in bottom position
        if (this.player.pressFrac > 0.05 && this.playerHealthStep < 0.5) {
          this.playerHealthStep += 0.5 * this.game.time.physicsElapsed;
        } else if (this.player.pressFrac < 0.05 && this.playerHealthStep > -0.3) {
          this.playerHealthStep -= 0.2 * this.game.time.physicsElapsed;
        }
        this.player.health += this.playerHealthStep;
      }

      if (!this.fallenDown && this.player.health <= 0) {
        this.player.fallDown();
        this.fallenDown = true;
        this.endState();
      }

      // Updating player
      this.player.balance = newBalance;
      this.player.pressFrac = newPressFrac;

      this.player.update();
    }
  },

  shutdown: function() {

    PowerGym.Keys.Up.onDown.remove(this.pressUp, this);
    PowerGym.Keys.Down.onDown.remove(this.pressDown, this);
    this.onScreenArrowDown.onInputDown.remove(this.pressDown, this);
    this.onScreenArrowUp.onInputDown.remove(this.pressUp, this);
    this.grOnScreenArrows.destroy();
    this.grOnScreenArrows = null;

  },

  endState: function(pointer) {

    // No need to move
    this.balanceIndicator.body.moves = false;

    // No coming back at this point
    this.btnGoBack.destroy();

    // Hide on sceen buttons
    this.grOnScreenArrows.destroy();

    var stats = [
      {
        name: "Reps",
        amount: this.repsCounter,
        multiplier: 3 * PowerGym.UserData.lvl1Difficulty
      },
      {
        name: "Speed bonus",
        amount: Math.round(500 * this.repsCounter * (3000 / (this.game.time.now - this.stateStartTime))),
        multiplier: 1
      },
      {
        name: "Difficulty bonus",
        amount: 200 * PowerGym.UserData.lvl1Difficulty,
        multiplier: 1
      },
      {
        name: "Respect points",
        amount: 10 * this.repsCounter * this.game.rnd.integerInRange(1, 4),
        multiplier: 1
      }
    ];

    var total = 0;
    for (var i = 0, l = stats.length; i < l; i++) {
      total += stats[i].amount * stats[i].multiplier;
    }

    PowerGym.UserData.Scores.lvl1 = total;

    // Show play stats
    this.game.time.events.add(2000, function() {

      // Menu for the stats
      this.menuLvlStats = new PowerGym.Prefabs.MenuLvlStats(this, function() {
        this.game.state.start("Home");
      }, stats, 4000);
      this.placeGameObject("menuLvlStats");

    }, this);

  },

  manageOnScreenArrowsStates: function() {

    // Left arrow
    if (this.onScreenArrowLeft.input.pointerDown(this.input.activePointer.id)) {
      this.game.canvas.style.cursor = "pointer";
      this.onScreenArrowLeft.frame = 2;
    } else if (PowerGym.Keys.Left.isDown) {
      this.onScreenArrowLeft.frame = 2;
    } else if (this.onScreenArrowLeft.input.pointerOver(this.input.activePointer.id)
        && !this.isMobile
    ) {
      this.game.canvas.style.cursor = "pointer";
      this.onScreenArrowLeft.frame = 1;
    } else if (this.onScreenArrowLeft.input.pointerOut(this.input.activePointer.id)
        || !PowerGym.Keys.Left.isDown
    ) {
      this.onScreenArrowLeft.frame = 0;
    }
    if (this.onScreenArrowLeft.input.justOut(this.input.activePointer.id, 50)) {
        this.game.canvas.style.cursor = "default";
    }

    // Right arrow
    if (this.onScreenArrowRight.input.pointerDown(this.input.activePointer.id)) {
      this.game.canvas.style.cursor = "pointer";
      this.onScreenArrowRight.frame = 2;
    } else if (PowerGym.Keys.Right.isDown) {
      this.onScreenArrowRight.frame = 2;
    } else if (this.onScreenArrowRight.input.pointerOver(this.input.activePointer.id)
        && !this.isMobile
    ) {
      this.game.canvas.style.cursor = "pointer";
      this.onScreenArrowRight.frame = 1;
    } else if (this.onScreenArrowRight.input.pointerOut(this.input.activePointer.id)
        || !PowerGym.Keys.Right.isDown
    ) {
      this.onScreenArrowRight.frame = 0;
    }
    if (this.onScreenArrowRight.input.justOut(this.input.activePointer.id, 50)) {
        this.game.canvas.style.cursor = "default";
    }

    // Up Arrow
    if ((PowerGym.Keys.Up.isDown && !PowerGym.Keys.Up.downDuration(100))
        || PowerGym.Keys.Up.justUp
    ) {
      this.onScreenArrowUp.changeStateFrame("Out");
    } else if (PowerGym.Keys.Up.isDown) {
      this.onScreenArrowUp.changeStateFrame("Down");
    }

    // Down Arrow
    if ((PowerGym.Keys.Down.isDown && !PowerGym.Keys.Down.downDuration(100))
        || PowerGym.Keys.Down.justUp
    ) {
      this.onScreenArrowDown.changeStateFrame("Out");
    } else if (PowerGym.Keys.Down.isDown) {
      this.onScreenArrowDown.changeStateFrame("Down");
    }
  },

  putEverythingInPlace: function() {

    var gameObjects = [
        "bg",
        "player",
        "btnGoBack",
        "balanceIndicator",
        "texts",
        "repsCounterText",
    ];
    if (this.menuLvlStats) {
      gameObjects.push("menuLvlStats");
    }
    if (this.menuInfo) {
      gameObjects.push("menuInfo");
    }
    if (this.grOnScreenArrows) {
      gameObjects.push("onScreenArrows");
    }
    for (var i = 0, l = gameObjects.length; i < l; i++) {
      this.placeGameObject(gameObjects[i]);
    }

  },

  placeGameObject: function(name) {

    switch (name) {
      case "bg":
        this.bgImage.scale.set(this.gameScale);
        this.bgImage.x = this.game.width / 2 - this.bgImage.width / 2;
        break;
      case "player":
        this.player.body.scale.set(this.gameScale);
        this.player.body.x = this.game.width * 194 / 800;
        this.player.body.x = this.game.width / 2
          - 220 * this.gameScale;
        this.player.body.y = 250 * this.gameScale;
        break;
      case "balanceIndicator":
        this.grBalanceIndicator.scale.x = this.scale.width
          / (this.indicatorAmplitude + this.indicatorWidth);
        break;
      case "btnGoBack":
        var margin = 20 * this.gameScale
            btnScale = this.isMobile ? this.gameScale * 2 : this.gameScale;
        this.btnGoBack.scale.set(btnScale);
        this.btnGoBack.x = margin;
        this.btnGoBack.y = this.game.height - this.btnGoBack.height - margin;
        break;
      case "repsCounterText":
        this.repsCounterText.scale.set(this.gameScale);
        this.repsCounterText.x = this.game.width / 2;
        this.repsCounterText.y = 80 * this.gameScale;
        break;
      case "menuLvlStats":
        this.menuLvlStats.window.scale.set(this.gameScale);
        this.menuLvlStats.window.x = this.game.width / 2
          - this.menuLvlStats.window.width / 2;
        this.menuLvlStats.window.y = this.game.height / 2
          - this.menuLvlStats.window.height / 2;
        break;
      case "menuInfo":
        this.menuInfo.window.scale.set(this.gameScale);
        this.menuInfo.window.x = this.game.width / 2
          - this.menuInfo.window.width / 2;
        this.menuInfo.window.y = this.game.height / 2
          - this.menuInfo.window.height / 2;
        break;
      case "onScreenArrows":
        if (!this.isMobile) {
          this.grOnScreenArrows.scale.set(this.gameScale);
          this.grOnScreenArrows.y = 2 * this.game.height / 7;
          this.grOnScreenArrows.x = this.game.width - this.game.width / 6;
        } else {
          var screenEdgeMargin = 20,
              btnScale = this.gameScale * this.aspectRatio * 1.8;

          this.grOnScreenArrowsLeft.scale.set(btnScale);
          this.grOnScreenArrowsRight.scale.set(btnScale);

          this.grOnScreenArrowsLeft.x = this.onScreenArrowLeft.width
            * this.gameScale
            * this.aspectRatio
            + screenEdgeMargin;
          this.grOnScreenArrowsLeft.y = this.game.height / 2
            - 50 * this.gameScale * this.aspectRatio
            + this.grOnScreenArrowsLeft.height / 2;
          this.grOnScreenArrowsRight.x = this.game.width
            - this.grOnScreenArrowsRight.width / 2
            - screenEdgeMargin;
          this.grOnScreenArrowsRight.y = this.game.height / 2
            - 50 * this.gameScale * this.aspectRatio
            + this.grOnScreenArrowsRight.height / 2;

        }
        break;
      default:
    }

  },

  resize: function(width, height) {

    this.gameScale = PowerGym.GameData.scale;
    this.aspectRatio = PowerGym.GameData.aspectRatio;
    this.putEverythingInPlace();

  },

  // switchMobileDesktop: function() { },

  render: function() {

    // if (this.forceMobile != PowerGym.UserData.forceMobile) {
    //   this.forceMobile = PowerGym.UserData.forceMobile;
    //   this.switchMobileDesktop();
    // }

    if (PowerGym.DEBUG_MODE) {
      this.game.debug.text("player balance: " + this.player.balance, 32, 16);
      this.game.debug.text("player press fraction: " + this.player.pressFrac, 32, 32);
      this.game.debug.text("balanceIndicator velocity x: " + this.balanceIndicator.body.velocity.x, 32, 48);
      this.game.debug.text("balanceIndicator x: " + this.balanceIndicator.x, 32, 64);
      this.game.debug.text("user force: " + this.userForce.x, 32, 80);
      this.game.debug.text("balanceIndicator toX: " + this.toX, 32, 96);
      this.game.debug.text("unbalance amplifier: " + this.unbalanceAmplifier, 32, 112);
      this.game.debug.text("player health: " + this.player.health, 32, 128);
      this.game.debug.text("player health step: " + this.playerHealthStep, 32, 144);
    }

  },

  btnGoBackCallback: function() {

    this.state.start("Home");

  },

  pressUp: function() {

    this.player.pressFrac += 0.2;

  },

  pressDown: function() {

    this.player.pressFrac -= 0.2;

  },

  menuInfoOkBtnCallback: function() {

    this.menuInfo.destroy();
    this.menuInfo = null;

    this.enableBtnGoBack();
    this.createOnscreenBtns();
    this.putEverythingInPlace();
    this.addGetReadyCallback();
  },

  addGetReadyCallback: function() {

    PowerGym.Keys.Up.onDown.add(this.getReady, this);
    PowerGym.Keys.Down.onDown.add(this.getReady, this);
    PowerGym.Keys.Left.onDown.add(this.getReady, this);
    PowerGym.Keys.Right.onDown.add(this.getReady, this);

  },

};
