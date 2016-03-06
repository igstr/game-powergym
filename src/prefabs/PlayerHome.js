
PowerGym.Prefabs.PlayerHome = function(game, x, y) {

  this.head = new Phaser.Sprite(game, 0, 0, "playerHomeHead");
  this.head.anchor.x = 0.5;
  this.head.anchor.y = 0.5;
  this.head.x = 76;
  this.head.y = 35;

  this.torso = new Phaser.Sprite(game, 0, 0, "playerHomeTorso");
  this.torso.anchor.x = 0.5;
  this.torso.anchor.y = 0.5;
  this.torso.x = 75;
  this.torso.y = 155;

  this.rightArm = new Phaser.Sprite(game, 0, 0, "playerHomeRightArm");
  this.rightArm.anchor.x = 0.8;
  this.rightArm.anchor.y = 0;
  this.rightArm.x = 43;
  this.rightArm.y = 84;

  this.leftArm = new Phaser.Sprite(game, 0, 0, "playerHomeLeftArm");
  this.leftArm.anchor.x = 0.2;
  this.leftArm.anchor.y = 0;
  this.leftArm.x = 103;
  this.leftArm.y = 83;

  this.rightLeg = new Phaser.Sprite(game, 0, 0, "playerHomeRightLeg");
  this.rightLeg.anchor.x = 0.5;
  this.rightLeg.anchor.y = 0;
  this.rightLeg.x = 62;
  this.rightLeg.y = 232;

  this.leftLeg = new Phaser.Sprite(game, 0, 0, "playerHomeLefgLeg");
  this.leftLeg.anchor.x = 0.5;
  this.leftLeg.anchor.y = 0;
  this.leftLeg.x = 100;
  this.leftLeg.y = 232;

  this.shorts = new Phaser.Sprite(game, 0, 0, "playerHomeShorts");
  this.shorts.anchor.x = 0.5;
  this.shorts.anchor.y = 0.5;
  this.shorts.x = 80;
  this.shorts.y = 239;

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
