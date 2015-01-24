(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2
        , y = this.game.height / 2;

      this.game.stage.backgroundColor = 0x000000;

      // create menu texts
      this.titleTxt = this.add.bitmapText(x, y, 'minecraftia', 'Blackout Menace' );
      this.titleTxt.x = x - this.titleTxt.textWidth / 2;
      this.titleTxt.y = y / 2;
      //this.titleTxt.blendMode = Phaser.blendModes.SCREEN;

      this.startTxt = this.add.bitmapText(x, y, 'minecraftia', 'START');
      this.startTxt.align = 'center';
      this.startTxt.x = x - this.startTxt.textWidth / 2;
      this.titleTxt.buttonMode = true;


      // create lights
      this.lights = this.game.add.group();

      this.game.input.activePointer.x = 400;
      this.game.input.activePointer.y = 300;

      this.player1_flashlight = new Torch(this.game, x, y, 'green');
      this.lights.add(this.player1_flashlight);

      this.player2_flashlight = new Torch(this.game, x, y, 'red');
      this.lights.add(this.player2_flashlight);

      this.input.onDown.add(this.onDown, this);
    },

    update: function () {
      this.player1_flashlight.x = this.game.input.activePointer.x;
      this.player1_flashlight.y = this.game.input.activePointer.y;

    },

    onDown: function () {
      this.game.state.start('game');
    }
  };

// Create torch objects
// Torch constructor
var Torch = function(game, x, y, color) {
    Phaser.Sprite.call(this, game, x, y, 'invisible-sprite');

    // Set the pivot point for this sprite to the center
    this.anchor.setTo(0.5, 0.5);

    // Add a child image that is the glow of the torchlight
    this.glow = this.game.add.image(x, y, 'flashlight-'+color);
    this.glow.anchor.setTo(0.5, 0.5);

    // Set the blendmode of the glow to ADD. This blendmode
    // has the effect of adding the color of the glow to anything
    // underneath it, brightening it.
    this.glow.blendMode = Phaser.blendModes.ADD;

    // Set the transparency to a low value so decrease the brightness
    this.glow.alpha = 0.85;
};

// Torches are a type of Phaser.Sprite
Torch.prototype = Object.create(Phaser.Sprite.prototype);
Torch.prototype.constructor = Torch;

Torch.prototype.update = function() {
    // Move the glow of this torch to wherever the torch is
    this.glow.x = this.x;
    this.glow.y = this.y;

    // Randomly change the width and height of the glow to simulate flickering
    var size = this.game.rnd.realInRange(0.95, 1.0);
    this.glow.scale.setTo(size, size); // x, y scaling
};

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Menu = Menu;

}());
