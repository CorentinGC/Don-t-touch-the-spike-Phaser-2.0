
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

      // Collision entre le player et le spikeTop et spikeBottom, lance this.die à la collision
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