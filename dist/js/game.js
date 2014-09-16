(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(320, 480, Phaser.AUTO, 'first-game');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":2,"./states/gameover":3,"./states/menu":4,"./states/play":5,"./states/preload":6}],2:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  }
};

module.exports = Boot;

},{}],3:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],4:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '50px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Don\'t touch the spikes v1.0', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {

      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],5:[function(require,module,exports){

  'use strict';
  function Play() {}
  Play.prototype = {
    create: function() {

      // ## Physique de notre jeu

      // On active le systeme de physique
      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.game.add.tileSprite(0, 0, 320, 480, 'background');
      // ### HUD ###

      // Score
      // On initialise le score, et on l'affiche.
      this.bestscore = 0;
      this.scoreTxt = this.game.add.text(this.game.world.centerX, this.game.world.centerY, '0'+this.bestscore, { font: '65px Arial', 
        fill: '#ffffff',
        align: 'center'
      });
      this.scoreTxt.anchor.setTo(0.5, 0.5);


      // ## PLAYER ##

      //On ajoute notre sprite
      this.player = this.game.add.sprite(this.game.width/2, this.game.height/2, 'yeoman');
      // On edite la taille
      var size = 48;
      this.player.width = size;
      this.player.height = size;

      // On ajoute la physique à notre player
      this.game.physics.arcade.enable(this.player);
      // On fait collide notre player avec les bords du monde
      this.player.body.collideWorldBounds = true;
      // On ajoute un rebond parfait sur l'axe horizontal (x)
      this.player.body.bounce.setTo(1,0.5);
      // On ajoute une vitesse horizontal (x)
      this.player.body.velocity.x = 250;
      // Vitesse du saut
      this.speed = 350;
      //On ajoute de la gravité
      this.player.body.gravity.y = 1200;
      // Notre player n'est pas mort
      this.isDead = false; 

      // ## SPIKES ##

      // SpikeTop
      this.spikeTop = this.game.add.sprite(0, 0, 'spikes_h');
      this.game.physics.arcade.enable(this.spikeTop); // On ajoute la physique à notre player
      this.spikeTop.body.immovable = true; // Les pikes sont immobile

      // SpikeBottom
      this.spikeBottom = this.game.add.sprite(this.game.width, this.game.height-(this.spikeTop.body.height/2), 'spikes_h');
      this.spikeBottom.anchor.setTo(1, 0.5); // On edite l'ancre pour une rotation à partir du milieu
      this.spikeBottom.scale.y = -1; // On flip notre sprite
      this.game.physics.arcade.enable(this.spikeBottom); // On ajoute la physique à notre player
      this.spikeBottom.body.immovable = true; // Les pikes sont immobile


    },
    update: function() {

      this.game.physics.arcade.collide(this.spikeTop, this.player, this.die, null, this);
      this.game.physics.arcade.collide(this.spikeBottom, this.player, this.die, null, this);

      // Si le player est en vie
      if(!this.isDead){
        // Si on touche le sol, on meurt
        if(this.player.body.onFloor() ){
            this.die();
        }

        // Si on clic/tap, on saute
        if(this.game.input.activePointer.justPressed()){
            this.jump();
         }

        // Si on touche les murs, on score
        if(this.player.body.onWall()){
            this.score();
        }
      }
    },

    // ### FONCTIONS ### 

    // ## Jump
    jump: function(){
      this.player.body.velocity.y = -this.speed;
    },
    // ## Gameover
    die : function(){
      if(!this.isDead){
          // Le player est mort
          this.isDead = true;
          console.log('mort');

          // On arrête le mouvement du player
          this.player.body.velocity.x = 0;

          // On affiche le texte de gameover
          var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
          this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
          this.titleText.anchor.setTo(0.5, 1);
        
          var buttonReplay = this.game.add.button(this.game.world.centerX, this.game.world.centerY-50 , 'buttonreplay', this.replay, this, 2, 1, 0);
          buttonReplay.anchor.setTo(0.5, 0.5);

          var buttonMenu = this.game.add.button(this.game.world.centerX, this.game.world.centerY+50, 'buttonmenu', this.menu, this, 2, 1, 0);
          buttonMenu.anchor.setTo(0.5, 0.5);
      }
      //this.game.state.start('gameover');
    },
    // ## Score
    score : function() {
      this.bestscore++;
      if(this.bestscore < 10){
        this.scoreTxt.setText('0'+this.bestscore);
      }
      else {
        this.scoreTxt.setText(this.bestscore);
      }
    },
    // ## Replay
    replay : function() {
      this.game.state.start('play');
    },
    // ## Menu
    menu : function() {
      this.game.state.start('menu');
    },

    // ### DEBUG ### 
    render: function () {
      this.game.debug.text(this.game.time.physicsElapsed, 32, 32);
      //this.game.debug.body(this.player);
      this.game.debug.body(this.spikeBottom);
      this.game.debug.body(this.spikeTop);

      this.game.debug.bodyInfo(this.player, 16, 24);
    }
  };
  
  module.exports = Play;
},{}],6:[function(require,module,exports){

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

},{}]},{},[1])