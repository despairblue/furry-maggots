(function () {
  'use strict';

  function Boot() {}

  Boot.prototype = {

    preload: function () {
      this.load.image('preloader', 'assets/preloader.gif');
    },

    create: function () {
      this.game.input.maxPointers = 1;

      if (this.game.device.desktop) {
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.width = 1024
        this.game.scale.height = 768
      } else {
        this.game.scaleMode                   = Phaser.ScaleManager.SHOW_ALL;
        // this.game.scale.minWidth              = 480;
        // this.game.scale.minHeight             = 260;
        this.game.scale.maxWidth              = 1024;
        this.game.scale.maxHeight             = 768;
        this.game.scale.forceLandscape        = true;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.setScreenSize(true);
      }
      this.game.state.start('preloader');
    }
  };

  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Boot = Boot;

}());
