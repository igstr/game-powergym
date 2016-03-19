
PowerGym.Prefabs.Metronome = function(game, x, y, angleAmplitude, startJourneyFrac) {

  this.game = game;

  this._pivotY = 150;
  this._speed = 1;

  this.metronome = game.add.group(game.world);
  this._arrow = game.add.sprite(0, 0, "whiteArrow", 0, this.metronome);
  this._arrow.rotation = Math.PI;
  this._arrow.pivot.y = this._pivotY;
  this._arrow.pivot.x = this._arrow.width / 2;

  // ARC
  if (typeof angleAmplitude == "undefined") {
    this._amplitude = Math.PI / 3;
    this.drawArc();
  } else {
    this.angleAmplitude = angleAmplitude;
  }

  this.metronome.x = x;
  this.metronome.y = y;

  // YOYO
  // this.yoyo = { value: startJourneyFrac };
  this.yoyo = { value: 0 };
  this.yoyoTween = game.add.tween(this.yoyo);
  this.yoyoTween.to({value: 1}, 1000, null, true, 0, -1, true);

};

PowerGym.Prefabs.Metronome.prototype = {

  update: function() {

    var newRotation = this._amplitude * this.yoyo.value - this._amplitude / 2;
    this._arrow.rotation = newRotation;

  },

  drawArc: function() {

    if (typeof this._arc == "undefined") {
      this._arc = this.game.add.graphics(0, 0, this.metronome);
    } else {
      this._arc.clear();
    }

    var arcStartAngle = -this._amplitude / 2 - Math.PI / 2,
        arcEndAngle = this._amplitude / 2 - Math.PI / 2;
    this._arc.lineStyle(3, 0xFFFFFF, 1);
    this._arc.arc(0, 0, this._arrow.pivot.y, arcStartAngle, arcEndAngle);

  }

}

Object.defineProperty(PowerGym.Prefabs.Metronome.prototype, 'speed', {

  set: function(value) {
    value = value < 0 ? 0 : value;

    this.yoyoTween.timeScale = value;
  },

  get: function() {
    return this.yoyoTween.timeScale;
  }

});

Object.defineProperty(PowerGym.Prefabs.Metronome.prototype, 'angleAmplitude', {

  set: function(value) {

    if (value < 0) {
      value = 0;
    } else if (value > 360) {
      value = 360;
    }
    this._amplitude = Math.PI * 2 * value / 360;
    this.drawArc();

  },

  get: function() {

    return this._amplitude * 360 / (Math.PI * 2);

  }

});

Object.defineProperty(PowerGym.Prefabs.Metronome.prototype, 'journeyFrac', {

  get: function() {

    return (this._arrow.rotation + this._amplitude / 2) / this._amplitude;

  }

});
