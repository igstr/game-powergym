
PowerGym.Lvl1 = function(game) { };

PowerGym.Lvl1.prototype = {

  create: function() {

    // Enabling Physics
    // this.physics.startSystem(Phaser.Physics.ARCADE);

    this.add.sprite(0, 0, "bgLvl1");

    // Adding buttons
    var btnGoBack = this.add.button(0, 0, "btnGoBack", this.btnGoBackCallback, this),
        btnGoBackMargin = 20;
    btnGoBack.x = btnGoBackMargin;
    btnGoBack.y = this.scale.height - btnGoBack.height - btnGoBackMargin;

    // PLAYER
    //////////////////////

    this.player = new PowerGym.Prefabs.PlayerLvl1(this, 194, 96);
    this.player.balance = 0.5;
    this.player.pressFrac = 0;


    // BALANCE INDICATOR
    /////////////////////////////////

    // var bmd = this.add.bitmapData(32, 32);
    // bmd.ctx.beginPath();
    // bmd.ctx.rect(0, 0, 32, 32);
    // bmd.ctx.fillStyle = "#fff";
    // bmd.ctx.fill();
    // this.balanceIndicator = this.add.sprite(this.world.centerX, 100, bmd);
    // this.balanceIndicator.anchor.setTo(0.5, 0.5);
    // this.physics.enable(this.balanceIndicator, Phaser.Physics.ARCADE, true);

    // Background for balance indicator

    // var bgWidth = this.balanceIndicatorAmplitude + 32,
    //     bgHeight = 32;
    // var bmdIndicatorBg = this.add.bitmapData(bgWidth, bgHeight);
    // bmdIndicatorBg.ctx.beginPath();
    // bmdIndicatorBg.ctx.rect(0, 0, bgWidth, bgHeight);
    // bmdIndicatorBg.ctx.fillStyle = "#bfbfbf";
    // bmdIndicatorBg.ctx.fill();
    // this.balanceIndicatorBg = this.add.sprite(this.world.centerX, 100, bmdIndicatorBg);
    // this.balanceIndicatorBg.anchor.setTo(0.5, 0.5);
    // this.world.moveDown(this.balanceIndicatorBg);


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

    this.grBalanceIndicator.x = this.world.centerX - this.grBalanceIndicator.width / 2;
    this.grBalanceIndicator.y = 100;

    // YOYO
    ///////////////////

    // Tweening yoyo value from 0 to 1
    this.yoyo = { value: 0 };
    this.add.tween(this.yoyo).to({value: 1}, 2000, null, true, 0, -1, true);

    // INPUT

    PowerGym.Keys.upKey.onDown.add(function() {
      this.player.pressFrac += 0.2;
    }, this);

    PowerGym.Keys.downKey.onDown.add(function() {
      this.player.pressFrac -= 0.2;
    }, this);

    // RUNTIME VARS
    ///////////////////

    this.userForce = {x: 0, y: 0};
    this.playing = true;
    this.failCounter = 0;
    this.repsCounter = 0;
    this.reachedRepBottom = false;

  },

  update: function() {


    if (this.playing) {

      // Catching user input for force
      if (PowerGym.Keys.rightKey.isDown) {
        this.userForce.x += 0.1 + 0.01 * this.repsCounter;
      } else if (PowerGym.Keys.leftKey.isDown) {
        this.userForce.x -= 0.1 + 0.01 * this.repsCounter;
      }

      // Adding drag to user force
      this.userForce.x = this.physics.arcade.computeVelocity(0, null, this.userForce.x, 0, 2);


      // Unbalancing balance indicator
      this.unbalanceAmplifier = 35 + this.repsCounter * 10 + this.player.pressFrac * 10;
      this.toX = this.yoyo.value * this.unbalanceAmplifier + (this.balanceIndicatorAmplitude - this.unbalanceAmplifier) / 2;
      this.physics.arcade.accelerateToXY(this.balanceIndicator, this.toX, this.balanceIndicator.y);
      this.balanceIndicator.body.velocity.x += this.userForce.x;

      // Checking if indicator is in his amplitude
      if (this.balanceIndicator.x > this.balanceIndicatorAmplitude) {
        this.balanceIndicator.body.velocity.x = 0;
        this.balanceIndicator.x = this.balanceIndicatorAmplitude / 2;
        this.userForce.x = 0;
        this.failCounter++;
      } else if (this.balanceIndicator.x < 0) {
        this.balanceIndicator.body.velocity.x = 0;
        this.balanceIndicator.x = this.balanceIndicatorAmplitude / 2;
        this.userForce.x = 0;
        this.failCounter++;
      }

      // Reps counter
      if (this.player.pressFrac > 0.95 && this.reachedRepBottom) {
        this.reachedRepBottom = false;
        this.repsCounter++;
      } else if (this.player.pressFrac < 0.05) {
        this.reachedRepBottom = true;
      }

      // Adding drag to press fraction
      var newPressFrac = this.player.pressFrac;
      if (newPressFrac > 0.05 && newPressFrac < 0.95) {
        newPressFrac -= 0.01;
      }
      var newBalance = this.balanceIndicator.x / this.balanceIndicatorAmplitude;

      // Updating player
      this.player.balance = newBalance;
      this.player.pressFrac = newPressFrac;

      this.player.update();
    }


  },

  quitGame: function(pointer) {

      //  Here you should destroy anything you no longer need.
      //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

      //  Then let's go back to the main menu.
    this.state.start("MainMenu");

  },

  render: function() {

    if (PowerGym.DEBUG_MODE) {
      this.game.debug.text("player balance: " + this.player.balance, 32, 32);
      this.game.debug.text("player press fraction: " + this.player.pressFrac, 32, 64);
      this.game.debug.text("balanceIndicator velocity x: " + this.balanceIndicator.body.velocity.x, 32, 96);
      this.game.debug.text("balanceIndicator x: " + this.balanceIndicator.x, 32, 128);
      this.game.debug.text("user force: " + this.userForce.x, 32, 160);
      this.game.debug.text("Fail count: " + this.failCounter, 32, 192);
      this.game.debug.text("Reps count: " + this.repsCounter, 32, 224);
      this.game.debug.text("balanceIndicator toX: " + this.toX, 32, 256);
      this.game.debug.text("unbalance amplifier: " + this.unbalanceAmplifier, 32, 288);
    }

  },

  btnGoBackCallback: function() {
    this.state.start("Home");
  }


};
