
PowerGym.Prefabs.PlayerHome = function(game, x, y, scaleParams) {

  if (!scaleParams || typeof scaleParams.torso == "undefined") {
    var scaleParams = {
      torso: 1,
      arms: 1,
      legs: 1,
      head: 1
    };
  }

  this.head = new Phaser.Sprite(game, 76, 35, "playerHomeHead");
  this.head.anchor.set(0.5);
  this.head.scale.x = scaleParams.head;

  this.torso = new Phaser.Sprite(game, 75, 155, "playerHomeTorso");
  this.torso.anchor.set(0.5);
  this.torso.scale.x = scaleParams.torso;

  this.rightArm = new Phaser.Sprite(game, 43, 84, "playerHomeRightArm");
  this.rightArm.anchor.set(0.8, 0);
  this.rightArm.scale.x = scaleParams.arms;

  this.leftArm = new Phaser.Sprite(game, 103, 83, "playerHomeLeftArm");
  this.leftArm.anchor.set(0.2, 0);
  this.leftArm.scale.x = scaleParams.arms;

  this.rightLeg = new Phaser.Sprite(game, 62, 232, "playerHomeRightLeg");
  this.rightLeg.anchor.set(0.5, 0);
  this.rightLeg.scale.x = scaleParams.legs;

  this.leftLeg = new Phaser.Sprite(game, 100, 232, "playerHomeLefgLeg");
  this.leftLeg.anchor.set(0.5, 0);
  this.leftLeg.scale.x = scaleParams.legs;

  this.shorts = new Phaser.Sprite(game, 80, 239, "playerHomeShorts");
  this.shorts.anchor.set(0.5);

  this.grBody = game.add.group(null, "player");
  this.grBody.add(this.torso);
  this.grBody.add(this.head);
  this.grBody.add(this.rightArm);
  this.grBody.add(this.leftArm);
  this.grBody.add(this.rightLeg);
  this.grBody.add(this.leftLeg);
  this.grBody.add(this.shorts);

  this.grBody.x = x;
  this.grBody.y = y;

  game.world.add(this.grBody);

  // withFloatAnim.call(this);
  // this.startFloat();

};

PowerGym.Prefabs.PlayerHome.prototype.update = function() {

  // this.rightArm.rotation += 0.01;

};

PowerGym.Prefabs.PlayerHome.prototype.scaleEverythingUp = function() {

  var notToScale = ["playerHomeHead", "playerHomeShorts"];

  this.grBody.forEach(function(item) {
    if (notToScale.indexOf(item.key) === -1) {
      item.scale.x += 0.1;
    }
  });

}

PowerGym.Prefabs.PlayerHome.prototype.scaleEverythingDown = function() {

  var notToScale = ["playerHomeHead", "playerHomeShorts"];

  this.grBody.forEach(function(item) {
    if (notToScale.indexOf(item.key) === -1) {
      item.scale.x -= 0.1;
    }
  });

}
