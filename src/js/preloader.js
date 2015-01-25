(function() {
  'use strict';

  function Preloader() {
    this.asset = null;
    this.ready = false;
  }

  Preloader.prototype = {

    preload: function () {
      this.asset = this.add.sprite(400, 300, 'preloader');
      this.asset.anchor.setTo(0.5, 0.5);

      this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
      this.load.setPreloadSprite(this.asset);
      this.load.spritesheet('player1', 'assets/spriteplayer1clean.png', 64, 64, 3);
      this.load.spritesheet('player2', 'assets/spriteplayer2clean.png', 64, 64, 3);
      this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.xml');
      this.load.image('background', 'assets/test_background_grey.jpg');
      this.load.image('block', 'assets/greyblock.png');

      // menu flashlight colors
      this.load.image('flashlight-white', 'assets/flashlight-white.png');
      this.load.image('flashlight-red', 'assets/flashlight-red.png');
      this.load.image('flashlight-blue', 'assets/flashlight-blue.png');
      this.load.image('flashlight-green', 'assets/flashlight-green.png');

      // invisible sprite
      this.load.image('invisible-sprite', 'assets/invisible-sprite.png');

      // audio
      this.load.audio('soundtrack', 'assets/sound/go.mp3');
      this.load.audio('redAudio', 'assets/sound/red.mp3');
      this.load.audio('greenAudio', 'assets/sound/green.mp3');
      this.load.audio('blueAudio', 'assets/sound/blue.mp3');
      this.load.audio('whiteAudio', 'assets/sound/white.mp3');


    },

    create: function () {
      this.asset.cropEnabled = false;
    },

    update: function () {
      if (!!this.ready) {
        this.game.state.start('menu');
      }
    },

    onLoadComplete: function () {
      this.ready = true;
    }
  };

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Preloader = Preloader;

}());
