window.onload = function () {
  'use strict';

  var game
    , ns = window['furry-maggots'];

  game = new Phaser.Game(1024, 768, Phaser.AUTO, 'furry-maggots-game');
  game.state.add('boot', ns.Boot);
  game.state.add('preloader', ns.Preloader);
  game.state.add('menu', ns.Menu);
  game.state.add('game', ns.Game);
  /* yo phaser:state new-state-files-put-here */

  // custom stuff
  Phaser.skeil = ns.skeil



  game.state.start('boot');
};
