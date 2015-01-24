(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      // Set stage background to something sky colored
      this.game.stage.backgroundColor = 0x000000

      // Define movement constants
      this.MAX_SPEED = 500; // pixels/second
      this.ACCELERATION = 1500; // pixels/second/second
      this.DRAG = 600; // pixels/second
      this.GRAVITY = 2600; // pixels/second/second
      this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

      var x = this.game.width / 2
      var y = this.game.height / 2

      this.player = this.add.sprite(x, y, 'player');
      this.player.anchor.setTo(0.5, 0.5);
      this.input.onDown.add(this.onInputDown, this);

      this.ground = this.game.add.group();
      for(x = 0; x < this.game.width; x += 32) {
        // Add the ground blocks, enable physics on each, make them immovable
        var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'ground');
        this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
        groundBlock.body.immovable = true;
        groundBlock.body.allowGravity = false;
        this.ground.add(groundBlock);
      }
      var x1 = 6
      var y1 = 11
      var direction = 'y'
      var length = 3
      var color = 'green'
      this.obstacles = this.game.add.group();

      Phaser.skeil.createWall(this, x1, y1, direction, length, color, this.obstacles)
      Phaser.skeil.createWall(this, x1 + 5, y1 - 1, direction, length + 1, color, this.obstacles)

      // Capture certain keys to prevent their default actions in the browser.
      // This is only necessary because this is an HTML5 game. Games on other
      // platforms may not need code like this.
      this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
        ]);
    },

    update: function () {
      var x, y, cx, cy, dx, dy, angle, scale;

      x = this.input.position.x;
      y = this.input.position.y;
      cx = this.world.centerX;
      cy = this.world.centerY;

      angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI);
      this.player.angle = angle;

      dx = x - cx;
      dy = y - cy;
      scale = Math.sqrt(dx * dx + dy * dy) / 100;

      this.player.scale.x = scale * 0.6;
      this.player.scale.y = scale * 0.6;
    },

    onInputDown: function () {
      this.game.state.start('menu');
    }

  };

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Game = Game;

}());
