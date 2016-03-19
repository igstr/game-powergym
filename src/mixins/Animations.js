
PowerGym.Mixins.withFloatAnim = function() {

  if (typeof this.floatAnimRadius == "undefined") {
    this.floatAnimRadius = 10;
  }

  var startPos = this.position.clone(),
      tweenY,
      tweenX;

  var floatY = function() {
    tweenY = this.game.tweens.create(this);
    var newPosY = startPos.y + (Math.random() - 0.5) * this.floatAnimRadius;
    tweenY.to({y: newPosY}, 2000, null, true);
    tweenY.onComplete.add(floatY, this);
  }

  var floatX = function() {
    tweenX = this.game.tweens.create(this);
    var newPosX = startPos.x + (Math.random() - 0.5) * this.floatAnimRadius;
    tweenX.to({x: newPosX}, 2000, null, true);
    tweenX.onComplete.add(floatX, this);
  };

  this.startFloat = function() {
    floatY.call(this);
    floatX.call(this);
  }

  this.stopFloat = function() {
    if (typeof tweenY != "undefined") {
      this.tweens.remove(tweenY);
    }
    if (typeof tweenX != "undefined") {
      this.tweens.remove(tweenX);
    }
  }
};

PowerGym.Mixins.withShakeAnim = function() {

  this.shakeAnimIsPlaying = false;
  this.shakeAnimAmplitude = 4;

  var startPos = this.position.clone(),
      shakeTimerEvent,
      counter = 0,
      step = Math.PI * 2 / 4;

  var shake = function() {

    var tStep = Math.sin(counter),
        newPosX = startPos.x + tStep * this.shakeAnimAmplitude / 2;

    if (this.body instanceof Phaser.Physics.P2.Body) {
      this.body.x = newPosX;
    } else {
      this.x = newPosX;
    }

    counter += step ;

  };

  var shakeOutPeriod,
      shakeOutStartTime,
      shakeOutTimerEvent;

  var shakeOut = function() {

    var shakeOutAmplitude = this.shakeAnimAmplitude - this.shakeAnimAmplitude * (this.game.time.now - shakeOutStartTime) / shakeOutPeriod;

    if (shakeOutAmplitude <= 0) {
      this.game.time.events.remove(shakeOutTimerEvent);
      this.shakeAnimIsPlaying = false;
    }

    var tStep = Math.sin(counter),
        newPosX = startPos.x + tStep * shakeOutAmplitude / 2;

    if (this.body instanceof Phaser.Physics.P2.Body) {
      this.body.x = newPosX;
    } else {
      this.x = newPosX;
    }

    counter += step ;

  }

  this.startShakeOutAnim = function(amplitude, period) {

    if (!this.shakeAnimIsPlaying) {

      if (amplitude) {
        this.shakeAnimAmplitude = amplitude;
      }

      if (period === undefined) {
        shakeOutPeriod = 4;
      } else {
        shakeOutPeriod = period;
      }

      shakeOutTimerEvent = this.game.time.events.loop(0, shakeOut, this);
      shakeOutStartTime = this.game.time.now;
      this.shakeAnimIsPlaying = true;
    }

  };

  this.startShakeAnim = function(amplitude) {

    if (!this.shakeAnimIsPlaying) {

      if (amplitude) {
        this.shakeAnimAmplitude = amplitude;
      }

      shakeTimerEvent = this.game.time.events.loop(0, shake, this);
      this.shakeAnimIsPlaying = true;
    }

  };

  this.stopShakeAnim = function() {

    if (this.shakeAnimIsPlaying) {
      this.game.time.events.remove(shakeTimerEvent);
      this.shakeAnimIsPlaying = false;
    }

  };

}
