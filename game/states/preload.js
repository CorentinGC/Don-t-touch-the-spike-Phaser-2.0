
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);
    this.load.image('yeoman', 'assets/yeoman-logo.png');

    this.load.image('spikes_h', 'assets/spikes_h.png');

    this.load.image('background', 'assets/grass_320-480.png');

    this.game.load.spritesheet('buttonmenu', 'assets/buttonmenu_sprite_sheet.png', 193, 71);
    this.game.load.spritesheet('buttonreplay', 'assets/buttonreplay_sprite_sheet.png', 193, 71);


  },
  create: function() {
    this.asset.cropEnabled = false;

    // On scroll pour cacher la barre d'adresse du navigateur
    window.scrollTo(0,1);

  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('menu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
