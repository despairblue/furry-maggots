(function() {
  'use strict';

  var skeil = {
    createWall: function(self, x1, y1, direction, length, color, alpha, group) {
      x1 = x1 * 32;
      y1 = y1 * 32

      for (var i = 0; i < length; i++) {
        var block = self.game.add.sprite(x1, y1, 'block');
        block.tint = color
        block.alpha = alpha

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

      // set up Keyboard
      self.game.input.keyboard.addCallbacks(
        self,
        self.onDown,
        self.onUp
      )
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
    },

    Player: function(self, sprite) {
      // Define movement constants
      var MAX_SPEED = 200; // pixels/second
      var ACCELERATION = 1500; // pixels/second/second
      var DRAG = 600; // pixels/second
      var GRAVITY = 2600; // pixels/second/second
      var JUMP_SPEED = -500; // pixels/second (negative y is up)

      // Create a player sprite
      var player = self.add.sprite(0, 0, sprite, 0)
      player.animations.add('walk')

      // Enable physics on the player
      self.game.physics.enable(player, Phaser.Physics.ARCADE);

      // Make player collide with world boundaries so he doesn't leave the stage
      player.body.collideWorldBounds = true;

      // Set player minimum and maximum movement speed
      player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED * 10); // x, y

      // Add drag to the player that slows them down when they are not accelerating
      player.body.drag.setTo(DRAG, 0); // x, y

      // Since we're jumping we need gravity
      self.game.physics.arcade.gravity.y = GRAVITY;

      player.anchor.setTo(0.5, 0.5);
      self.input.onDown.add(self.onInputDown, self);

      player.left = function(state) {
        if (state) {
          player.body.acceleration.x = -ACCELERATION
          player.scale.x = -1
          player.animations.play('walk', 12, true)
        } else {
          player.body.acceleration.x = 0
          player.animations.stop('walk', true)
        }
      }

      player.right = function(state) {
        if (state) {
          player.body.acceleration.x = ACCELERATION
          player.scale.x = 1
          player.animations.play('walk', 12, true)
        } else {
          player.body.acceleration.x = 0
          player.animations.stop('walk', true)
        }
      }

      player.jump = function() {
        player.body.velocity.y = JUMP_SPEED
      }

      return player
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
