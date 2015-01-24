(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      this.bg = this.game.add.tileSprite(0, 0, 1024, 768, 'background');
      this.bg.fixedToCamera = true;

      // Define movement constants
      this.MAX_SPEED = 500; // pixels/second
      this.ACCELERATION = 1500; // pixels/second/second
      this.DRAG = 600; // pixels/second
      this.GRAVITY = 2600; // pixels/second/second
      this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

      // Create a player sprite
      this.player = this.add.sprite(0, 20* 32, 'player', 0);
      this.player.animations.add('walk')
      this.player.animations.play('walk', 6, true)

      // Enable physics on the player
      this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

      // Make player collide with world boundaries so he doesn't leave the stage
      this.player.body.collideWorldBounds = true;

      // Set player minimum and maximum movement speed
      this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y

      // Add drag to the player that slows them down when they are not accelerating
      this.player.body.drag.setTo(this.DRAG, 0); // x, y

      // Since we're jumping we need gravity
      this.game.physics.arcade.gravity.y = this.GRAVITY;

      this.player.anchor.setTo(0.5, 0.5);
      this.input.onDown.add(this.onInputDown, this);

      // threw it on the ground!
      this.ground = this.game.add.group();
      Phaser.skeil.createWall(this, 0, 23, 'x', 32, 0xffffff, 0, this.ground)

      // for(x = 0; x < this.game.width; x += 32) {
      //   // Add the ground blocks, enable physics on each, make them immovable
      //   var groundBlock = this.game.add.sprite(x, this.game.height - 32, 'invisible-sprite');
      //   this.game.physics.enable(groundBlock, Phaser.Physics.ARCADE);
      //   groundBlock.body.immovable = true;
      //   groundBlock.body.allowGravity = false;
      //   this.ground.add(groundBlock);
      // }
      var x1 = 6
      var y1 = 20
      var direction = 'y'
      var length = 3
      var color = 0x00ff00
      this.obstacles = this.game.add.group();

      Phaser.skeil.createWall(this, x1, y1, direction, length, color, 0.6, this.obstacles)
      Phaser.skeil.createWall(this, x1 + 15, y1 - 1, direction, length + 1, 0xff0000, 0.6, this.obstacles)

      // Capture certain keys to prevent their default actions in the browser.
      // This is only necessary because this is an HTML5 game. Games on other
      // platforms may not need code like this.
      this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
        ]);

      Phaser.skeil.setUpInput(this)
    },

    update: function () {
      this.game.physics.arcade.collide(this.player, this.ground);

      if (this.leftInputIsActive) {
        // If the LEFT key is down, set the player velocity to move left
        this.player.body.acceleration.x = -this.ACCELERATION;
        console.log('run forest')
      } else if (this.rightInputIsActive) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player.body.acceleration.x = this.ACCELERATION;
      } else {
        this.player.body.acceleration.x = 0;
      }

      // Set a variable that is true when the player is touching the ground
      var onTheGround = this.player.body.touching.down;

      if (onTheGround && this.upInputIsActive) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player.body.velocity.y = this.JUMP_SPEED;
      }
    },

    onInputDown: function () {
      this.game.state.start('menu');
    },

    onDown: function(button, value) {
      switch (button) {
        case Phaser.Gamepad.XBOX360_A:
          this.bg.tint = 0x00ff00
          break;
        case Phaser.Gamepad.XBOX360_B:
          this.bg.tint = 0xff0000
          break;
        case Phaser.Gamepad.XBOX360_X:
          this.bg.tint = 0x0000ff
          break;
        case Phaser.Gamepad.XBOX360_Y:
          this.bg.tint = 0xffff00
          break;
        case Phaser.Gamepad.XBOX360_DPAD_LEFT:
          this.leftInputIsActive = true
          break;
        case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
          this.rightInputIsActive = true
          break;
        case Phaser.Gamepad.XBOX360_DPAD_UP:
          this.upInputIsActive = true
          break;
      }
    },

    onUp: function(button) {
      switch (button) {
        case Phaser.Gamepad.XBOX360_DPAD_LEFT:
          this.leftInputIsActive = false
          break;
        case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
          this.rightInputIsActive = false
          break;
        case Phaser.Gamepad.XBOX360_DPAD_UP:
          this.upInputIsActive = false
          break;

      }
    },

    onFloat: function() {

    },

    onAxis: function() {

    },
  };

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Game = Game;

}());
