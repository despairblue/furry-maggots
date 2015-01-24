(function() {
  'use strict';

  function Menu() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Menu.prototype = {

    create: function () {
      var x = this.game.width / 2
      var y = this.game.height / 2

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

      // // Activate gamepad
      Phaser.skeil.setUpInput(this)
    },

    update: function () {
      this.player1_flashlight.x = this.game.input.activePointer.x;
      this.player1_flashlight.y = this.game.input.activePointer.y;

    },

    // Below mapping applies to XBOX 360 Wired and Wireless controller on Google Chrome (tested on Windows 7).
    // - Firefox uses different map! Separate amount of buttons and axes. DPAD = axis and not a button.
    // In other words - discrepancies when using gamepads.
    // Phaser.Gamepad.XBOX360_A = 0;
    // Phaser.Gamepad.XBOX360_B = 1;
    // Phaser.Gamepad.XBOX360_X = 2;
    // Phaser.Gamepad.XBOX360_Y = 3;
    // Phaser.Gamepad.XBOX360_LEFT_BUMPER = 4;
    // Phaser.Gamepad.XBOX360_RIGHT_BUMPER = 5;
    // Phaser.Gamepad.XBOX360_LEFT_TRIGGER = 6;
    // Phaser.Gamepad.XBOX360_RIGHT_TRIGGER = 7;
    // Phaser.Gamepad.XBOX360_BACK = 8;
    // Phaser.Gamepad.XBOX360_START = 9;
    // Phaser.Gamepad.XBOX360_STICK_LEFT_BUTTON = 10;
    // Phaser.Gamepad.XBOX360_STICK_RIGHT_BUTTON = 11;

    // Phaser.Gamepad.XBOX360_DPAD_LEFT = 14;
    // Phaser.Gamepad.XBOX360_DPAD_RIGHT = 15;
    // Phaser.Gamepad.XBOX360_DPAD_UP = 12;
    // Phaser.Gamepad.XBOX360_DPAD_DOWN = 13;
    onDown: function (button, value) {
      // this.game.state.start('game');
      if (button === Phaser.Gamepad.XBOX360_A) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_B) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_X) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_Y) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_DPAD_LEFT) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_DPAD_RIGHT) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_DPAD_UP) {
        console.log(button, value)
      } else if (button === Phaser.Gamepad.XBOX360_DPAD_DOWN) {
        console.log(button, value)
      } else {
        console.log(button, value)
      }
    },

    //  On FF 0 = Y, 1 = X, 2 = Y, 3 = X, 4 = left bumper, 5 = dpad left, 6 = dpad right
    // Phaser.Gamepad.XBOX360_STICK_LEFT_X = 0;
    // Phaser.Gamepad.XBOX360_STICK_LEFT_Y = 1;
    // Phaser.Gamepad.XBOX360_STICK_RIGHT_X = 2;
    // Phaser.Gamepad.XBOX360_STICK_RIGHT_Y = 3;
    onUp: function(button, value) {
      console.log(button, value);
    },

    // the trigger buttons
    onFloat: function(button, value) {
      console.log(button, value)
    },

    onAxis: function (button, index, value) {
      switch (index) {
        case Phaser.Gamepad.XBOX360_STICK_LEFT_X:
          console.log('left sick y', value);
          break;
        case Phaser.Gamepad.XBOX360_STICK_LEFT_Y:
          console.log('left sick y', value);
          break;
        case Phaser.Gamepad.XBOX360_STICK_RIGHT_X:
          console.log('left sick x', value);
          break;
        case Phaser.Gamepad.XBOX360_STICK_RIGHT_Y:
          console.log('left sick x', value);
          break;
        default:
          console.log('THAT SHOULDNT HAPPEN!')
          alert('WAT')
      }
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
