(function() {
  'use strict';

  function Game() {
    this.player = null;
  }

  Game.prototype = {

    create: function () {
      // this.bg = this.game.add.tileSprite(0, 0, 1024, 768, 'background');
      // this.bg.fixedToCamera = true;

      // Define movement constants
      this.MAX_SPEED = 500; // pixels/second
      this.ACCELERATION = 1500; // pixels/second/second
      this.DRAG = 600; // pixels/second
      this.GRAVITY = 2600; // pixels/second/second
      this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

      // Create a player sprites
      this.player1 = Phaser.skeil.Player(this, 'player1')
      this.player2 = Phaser.skeil.Player(this, 'player2')

      // threw it on the ground!
      this.walls = this.game.add.group();
      Phaser.skeil.createWall(this, 0, 23, 'x', 32, 0xffffff, 0, this.walls)

      // create the obstacles
      // this.obstacles = this.game.add.group();
      Phaser.skeil.createWall(this, 6, 20, 'y', 3, 0x00ff00, 0.6, this.walls)
      Phaser.skeil.createWall(this, 21, 19, 'y', 4, 0xff0000, 0.6, this.walls)

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
      this.game.physics.arcade.collide(this.player1, this.walls);
      this.game.physics.arcade.collide(this.player2, this.walls);

      if (this.leftInput1IsActive) {
        // If the LEFT key is down, set the player velocity to move left
        this.player1.left(true)
      } else if (this.rightInput1IsActive) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player1.right(true)
      } else {
        this.player1.left(false)
      }

      // Set a variable that is true when the player is touching the ground
      var onTheGround = this.player1.body.touching.down;

      if (onTheGround && this.upInput1IsActive) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player1.jump()
      }

      if (this.leftInput2IsActive) {
        // If the LEFT key is down, set the player velocity to move left
        this.player2.left(true)
      } else if (this.rightInput2IsActive) {
        // If the RIGHT key is down, set the player velocity to move right
        this.player2.right(true)
      } else {
        this.player2.left(false)
      }

      // Set a variable that is true when the player is touching the ground
      var onTheGround = this.player2.body.touching.down;

      if (onTheGround && this.upInput2IsActive) {
        // Jump when the player is touching the ground and the up arrow is pressed
        this.player2.jump()
      }
    },

    onInputDown: function () {
      this.game.state.start('menu');
    },

    onDown: function(button, value) {
      // gamepad
      switch (button) {
        case Phaser.Gamepad.XBOX360_A:
          //this.bg.tint = 0x00ff00
          break;
        case Phaser.Gamepad.XBOX360_B:
          //this.bg.tint = 0xff0000
          break;
        case Phaser.Gamepad.XBOX360_X:
          //this.bg.tint = 0x0000ff
          break;
        case Phaser.Gamepad.XBOX360_Y:
          //this.bg.tint = 0xffff00
          break;
        case Phaser.Gamepad.XBOX360_DPAD_LEFT:
          this.leftInput1IsActive = true
          break;
        case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
          this.rightInput1IsActive = true
          break;
        case Phaser.Gamepad.XBOX360_LEFT_TRIGGER:
          this.upInput1IsActive = true
          break;
      }

      // keyboard
      switch (button.keyCode) {
        case Phaser.Keyboard.LEFT:
          this.leftInput2IsActive = true;
          break;
        case Phaser.Keyboard.RIGHT:
          this.rightInput2IsActive = true
          break;
        case Phaser.Keyboard.SPACEBAR:
          this.upInput2IsActive = true
          break;
        case Phaser.Keyboard.A:
          //this.bg.tint = 0x00ff00
          break;
        case Phaser.Keyboard.S:
          //this.bg.tint = 0xff0000
          break;
        case Phaser.Keyboard.D:
          //this.bg.tint = 0x0000ff
          break;
        case Phaser.Keyboard.F:
          //this.bg.tint = 0xffff00
          break;
      }
    },

    onUp: function(button) {
      // gamepad
      switch (button) {
        case Phaser.Gamepad.XBOX360_DPAD_LEFT:
          this.leftInput1IsActive = false
          break;
        case Phaser.Gamepad.XBOX360_DPAD_RIGHT:
          this.rightInput1IsActive = false
          break;
        case Phaser.Gamepad.XBOX360_LEFT_TRIGGER:
          this.upInput1IsActive = false
          break;
      }

      // keyboard
      switch (button.keyCode) {
        case Phaser.Keyboard.LEFT:
          this.leftInput2IsActive = false;
          break;
        case Phaser.Keyboard.RIGHT:
          this.rightInput2IsActive = false
          break;
        case Phaser.Keyboard.SPACEBAR:
          this.upInput2IsActive = false
          break;
      }
    },

    onFloat: function() {

    },

    onAxis: function(button, index, value) {
      switch (index) {
        case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
          if (value > 0) {
            this.rightInput1IsActive = true
            this.leftInput1IsActive = false
          } else if (value < 0) {
            this.leftInput1IsActive = true
            this.rightInput1IsActive = false
          } else {
            this.leftInput1IsActive = false
            this.rightInput1IsActive = false
          }
          console.log('left sick x', value);
        break;
        // case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
        //   if (value !== 0) {
        //     this.upi
        //   } else {
        //
        //   }
        //   console.log('left sick y', value);
        //   break;
        // case Phaser.Gamepad.XBOX360_STICK_RIGHT_X:
        //   console.log('righ sick x', value);
        //   this.player1_flashlight.x = ( this.game.scale.width / 2 ) * ( value + 1 )
        //   break;
        // case Phaser.Gamepad.XBOX360_STICK_RIGHT_Y:
        //   console.log('righ sick x', value);
        //   this.player1_flashlight.y = ( this.game.scale.height / 2 ) * ( value + 1 )
        //   break;
        // default:
        //   console.log('THAT SHOULDNT HAPPEN!')
        //   alert('WAT')
      }
    },
  };

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Game = Game;

}());
