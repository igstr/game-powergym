
PowerGym.Lvl1 = function(game) { };

PowerGym.Lvl1.prototype = {

  create: function() {

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

    this.add.sprite(0, 0, "bgLvl1");

    // PLAYER
    //-------------------

    this.player = new PowerGym.Prefabs.PlayerLvl1(this, 194, 96);
    this.player.balance = 0.5;
    this.player.pressFrac = 1;

    // BALANCE INDICATOR
    //-------------------

    this.balanceIndicatorAmplitude = 200;
    var indicatorWidth = 8,
        indicatorHeight = 8,
        indicatorBgWidth = this.balanceIndicatorAmplitude + indicatorWidth;

    this.grBalanceIndicator = this.add.group(this.world, "balanceIndicator");

    this.balanceIndicator = this.add.graphics(0, 0, this.grBalanceIndicator);
    this.balanceIndicator.beginFill(0xFFFFFF);
    this.balanceIndicator.drawRect(0, 0, indicatorWidth, indicatorHeight);
    this.balanceIndicator.endFill();
    this.balanceIndicator.x = this.balanceIndicatorAmplitude / 2;
    this.balanceIndicatorBg = this.add.graphics(0, 0, this.grBalanceIndicator);
    this.balanceIndicatorBg.beginFill(0xBFBFBF, 0.5);
    this.balanceIndicatorBg.drawRect(0, 0, indicatorBgWidth, indicatorHeight);
    this.balanceIndicatorBg.endFill();
    this.grBalanceIndicator.moveDown(this.balanceIndicatorBg);

    // Enabling physics
    this.balanceIndicator.anchor = {x: 0.5, y: 0.5};
    this.physics.enable(this.balanceIndicator, Phaser.Physics.ARCADE, true);

    // Scalling to screen width
    this.grBalanceIndicator.scale.x = this.scale.width / (this.balanceIndicatorAmplitude + indicatorWidth);

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
    // var btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this),
    //     btnGoBackMargin = 20;
    // btnGoBack.x = btnGoBackMargin;
    // btnGoBack.y = this.scale.height - btnGoBack.height - btnGoBackMargin;

    // On screen arrows
    var onScreenArrowMargin = 5;
    this.grOnScreenArrows = this.add.group(this.world, "onScreenArrowButtons");
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

    this.grOnScreenArrows.y = 2 * this.scale.height / 7;
    this.grOnScreenArrows.x = this.scale.width - this.scale.width / 6;

    // INPUT KEYS
    //-------------------

    PowerGym.Keys.Up.onDown.add(this.getReady, this);
    PowerGym.Keys.Down.onDown.add(this.getReady, this);
    PowerGym.Keys.Left.onDown.add(this.getReady, this);
    PowerGym.Keys.Right.onDown.add(this.getReady, this);

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
    this.manageOnScreenArrowsStates();

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
      this.toX = this.yoyo.value * this.unbalanceAmplifier + (this.balanceIndicatorAmplitude - this.unbalanceAmplifier) / 2;
      this.physics.arcade.accelerateToXY(this.balanceIndicator, this.toX, this.balanceIndicator.y);
      this.balanceIndicator.body.velocity.x += this.userForce.x;

      // Checking if indicator is in his amplitude
      if (this.balanceIndicator.x > this.balanceIndicatorAmplitude) {
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
      var newBalance = this.balanceIndicator.x / this.balanceIndicatorAmplitude;

      if (PowerGym.GameData.lvl1Difficulty == 2) {
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

  endState: function(pointer) {

    this.balanceIndicator.body.moves = false;

    PowerGym.Keys.Up.onDown.remove(this.pressUp, this);
    PowerGym.Keys.Down.onDown.remove(this.pressDown, this);
    this.onScreenArrowDown.onInputDown.remove(this.pressDown, this);
    this.onScreenArrowUp.onInputDown.remove(this.pressUp, this);

    var stats = [
      {
        name: "Reps",
        amount: this.repsCounter,
        multiplier: 3 * PowerGym.GameData.lvl1Difficulty
      },
      {
        name: "Speed bonus",
        amount: Math.round(1000 * (4000 * this.repsCounter) / (this.game.time.now - this.stateStartTime)),
        multiplier: 1
      },
      {
        name: "Difficulty bonus",
        amount: 1000 * PowerGym.GameData.lvl1Difficulty,
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
      total += stats[i].amount;
    }

    PowerGym.GameData.playerProgress.torso += total / 4000;

    // Stats
    this.game.time.events.repeat(2000, 1, function() {

      this.menuLvlStats = new PowerGym.Prefabs.MenuLvlStats(this, function() {
        this.game.state.start("Home");
      }, stats, 4000);

      PowerGym.Keys.MouseL.onDown.add(function() {
        this.menuLvlStats.skipCurrentLine();
      }, this);
      PowerGym.Keys.Spacebar.onDown.add(function(){
        this.menuLvlStats.skipCurrentLine();
      }, this);
    }, this);

  },

  manageOnScreenArrowsStates: function() {

    // Left arrow
    if (this.onScreenArrowLeft.input.pointerDown(this.input.activePointer.id)) {
      this.game.canvas.style.cursor = "pointer";
      this.onScreenArrowLeft.frame = 2;
    } else if (PowerGym.Keys.Left.isDown) {
      this.onScreenArrowLeft.frame = 2;
    } else if (this.onScreenArrowLeft.input.pointerOver(this.input.activePointer.id)) {
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
    } else if (this.onScreenArrowRight.input.pointerOver(this.input.activePointer.id)) {
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

  render: function() {

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

  }

};
