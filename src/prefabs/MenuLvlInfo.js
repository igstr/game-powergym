
PowerGym.Prefabs.MenuLvlInfo = function(game, lvlNum, okCallback) {

  this.game = game;
  var isMobile = !game.game.device.desktop || PowerGym.UserData.forceMobile;

  this.window = game.add.group(game.world);
  game.add.image(0, 0, "menuLvlStatsBg", 0, this.window);
  var infoImageName = "lvl" + lvlNum + "Info";
  if (lvlNum == 4 && isMobile) {
    infoImageName += "Mobile";
  }
  game.add.image(0, 0, infoImageName, 0, this.window);
  var btnOk = game.add.button(0, 0, "btnOk", okCallback, game, 1, 0, 2, 0, this.window);
  if (isMobile) {
    btnOk.scale.set(1.4);
  }
  btnOk.x = this.window.width / 2 - btnOk.width / 2;
  btnOk.y = this.window.height - btnOk.height - 10;

}

PowerGym.Prefabs.MenuLvlInfo.prototype = {

  destroy: function() {

    this.window.destroy();

  }

}
