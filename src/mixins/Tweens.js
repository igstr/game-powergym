
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

