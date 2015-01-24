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
        onDown: self.onDown,
        onUp: self.onUp,
        onFloat: self.onFloat,
        onAxis: self.onAxis,
      });
    }
  }

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].skeil = skeil;

}());
