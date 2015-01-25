(function() {
  'use strict';

  function Intro() {
    this.titleTxt = null;
    this.startTxt = null;
  }

  Intro.prototype = {

    create: function() {
      var gameDiv = document.getElementById('furry-maggots-game')
      var video = document.getElementById('intro')
      var _this = this
      gameDiv.style.display = 'none'

      video.play()
      video.addEventListener('ended', function() {
        gameDiv.style.display = ''
        _this.game.state.start('menu')
      })
    },
  };


  window['furry-maggots'] = window['furry-maggots'] || {};
  window['furry-maggots'].Intro = Intro;

}());
