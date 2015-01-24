(function() {
  'use strict';

  var skeil = {
    createWall: function(self, x1, y1, direction, length, color, group) {
      x1 = x1 * 32;
      y1 = y1 * 32

      for (var i = 0; i < length; i++) {
        var block = self.game.add.sprite(x1, y1, color);
        self.game.physics.enable(block, Phaser.Physics.ARCADE);
        block.body.immovable = true;
        block.body.allowGravity = false;
        group.add(block);

        // draw next block
        switch (direction) {
          case 'x':
            x1 += 32
            break;
          case 'y':
            y1 += 32
            break;
        }
      }
    },

    setUpInput: function(self) {
      // Activate gamepad
      self.game.input.gamepad.start();

      self.pad = self.game.input.gamepad.pad1;

      self.pad.addCallbacks(self, {
        onDown: self.onDown.bind(self),
        onUp: self.onUp.bind(self),
        onFloat: self.onFloat.bind(self),
        onAxis: self.onAxis.bind(self),
      });
    },

    // Create torch objects
    // Torch constructor
    Torch: function(game, x, y, color) {
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
      this.glow.alpha = 0.9;
    }
  }

  // Torches are a type of Phaser.Sprite
  skeil.Torch.prototype = Object.create(Phaser.Sprite.prototype);
  skeil.Torch.prototype.constructor = skeil.Torch;

  skeil.Torch.prototype.update = function() {
    // Move the glow of this torch to wherever the torch is
    this.glow.x = this.x;
    this.glow.y = this.y;

    // Randomly change the width and height of the glow to simulate flickering
    var size = this.game.rnd.realInRange(0.95, 1.0);
    this.glow.scale.setTo(size, size); // x, y scaling
  };

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].skeil = skeil;

}());
