
var btnMainMenu = function(game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame) {

  Phaser.Button.call(this, game, x, y, key, callback, callbackContext, overFrame, outFrame, downFrame, upFrame);

  this.scale.setTo(3, 3);

  // withFloatAnim.call(this);
  // this.startFloat();
};

btnMainMenu.prototype = Object.create(Phaser.Button.prototype);
btnMainMenu.prototype.constructor = btnMainMenu;

btnMainMenu.prototype.update = function() { };
