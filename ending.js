class Ending extends Phaser.Scene {

    constructor() {
      super({ key: 'Ending' });
    }
  
  preload() { /*Assets to preload for the scene*/ }

  create() {

      this.scale.refresh();

      scene = 'Ending';

      currentSentenceEndIndex = 0;
      currentSentenceEndSpanishIndex = 0;

      isMusicPlaying = false;
      this.sound.sounds.forEach(function(sound) { if (sound.key === 'titleTheme' && sound.isPlaying) { isMusicPlaying = true; } });
      if (!isMusicPlaying) { sound_titleTheme.play(); sound_titleTheme.setVolume(0.45); }

      overlay = this.add.rectangle(-600, 0, this.game.config.width*8, this.game.config.height*2, 0x000000).setOrigin(0).setDepth(1002);

      this.time.delayedCall(1000, function() {
        this.tweens.add({
          targets: overlay,
          alpha: 0,
          duration: 1000,
          onComplete: function() {
            overlay.destroy();
          }
        });
      }, [], this);

      player = this.physics.add.sprite(950, 400, 'beecon_full').setScale(0.3).setDepth(3);
      player.body.setSize(120, 120);
      player.body.setOffset(65, 110);
      player.setCollideWorldBounds(false);
      player.anims.play('glideBack');
      player.body.allowGravity = false;
      player.setImmovable(true);
      player.setVelocityX(0);
      player.setVelocityY(0);

      this.tweens.add({
        targets: player,
        y: 380,
        duration: 2000,
        ease: 'Linear',
        yoyo: true,
        repeat: -1
      });

      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

      text = this.add.text(config.width / 2, 45, "", { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', wordWrap: { width: 800 } });
      text.setOrigin(0.5).setDepth(33);
      text.setAlign('center');

      skyEnding1 = this.add.image(0, 150, 'skyEnding'); skyEnding2 = this.add.image(720, 150, 'skyEnding'); skyEnding3 = this.add.image(1440, 150, 'skyEnding');

      keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

      this.input.keyboard.enabled = true;

      if (language) {

          keyEnter.on('down', function () {

              if (indexEnd >= 0 && indexEnd < message.length) {
                  text.setText(message);
                  indexEnd = message.length;
                  return;
              }

              text.setText("");
      
              if (currentSentenceEndIndex >= sentencesEnd.length) {
                  this.input.keyboard.enabled = false;
                  player.setVelocityX(-500);
                  this.tweens.add({
                      targets: sound_titleTheme,
                      volume: 0,
                      duration: 2000,
                      onComplete: function () {
                        sound_titleTheme.stop();
                      }
                  });
                  this.cameras.main.fadeOut(2000);
                  this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.sound.stopAll();
                    lives = 99;
                    this.scene.start('Title', { sceneBack: false });
                  });
                  return;
              }
      
              message = sentencesEnd[currentSentenceEndIndex];
              currentSentenceEndIndex++;
  
              indexEnd = 0;
  
              timerEvent = this.time.addEvent({ delay: 75, callback: addNextLetterEnd, loop: true });
          }, this);

      } else {

          keyEnter.on('down', function () {

              if (indexEnd >= 0 && indexEnd < message.length) {
                  text.setText(message);
                  indexEnd = message.length;
                  return;
              }

              text.setText("");
      
              if (currentSentenceEndSpanishIndex >= sentencesEndSpanish.length) {
                  this.input.keyboard.enabled = false;
                  player.setVelocityX(-500);
                  this.tweens.add({
                      targets: sound_titleTheme,
                      volume: 0,
                      duration: 2000,
                      onComplete: function () {

                        sound_titleTheme.stop();
                      }
                  });
                  this.cameras.main.fadeOut(2000);
                  this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.sound.stopAll();
                    lives = 99;
                    this.scene.start('Title', { sceneBack: false });
                  });
                  return;
              }
      
              message = sentencesEndSpanish[currentSentenceEndSpanishIndex];
              currentSentenceEndSpanishIndex++;
  
              indexEnd = 0;
  
              timerEvent = this.time.addEvent({ delay: 75, callback: addNextLetterEnd, loop: true });
          }, this);

      }

      if (language) {
          var backText = this.add.text(10, 693.5, 'Press ENTER to continue', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
      } else {
          var backText = this.add.text(10, 693.5, 'Pulsa INTRO para continuar', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
      }
      backText.setOrigin(0, 0).setAlpha(0).setDepth(33);

      this.tweens.add({
          targets: backText,
          alpha: 1,
          ease: 'Linear',
          duration: 1000,
          delay: 1000
      });

      emitter = this.add.particles(0, 0, 'spaceRain',{
          x: 0,
          y: 0,
          quantity: 1,
          lifespan: 1600,
          speedY: { min: -70, max: 70 },
          speedX: { min: 1500, max: 1750 },
          scale: { start: 1.75, end: 1.75 },
          rotate: { start: -90, end: -90 },
          frequency: 5,
          emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width * 0.5, this.game.config.height*88) },
          on: true
      });
    
      emitter.setScrollFactor(0.5).setDepth(3.1).setAlpha(0.75);

      emitter2 = this.add.particles(0, 0, 'spaceRain',{
          x: 0,
          y: 0,
          quantity: 1,
          lifespan: 1600,
          speedY: { min: -70, max: 70 },
          speedX: { min: 1500, max: 1750 },
          scale: { start: 1.75, end: 1.75 },
          rotate: { start: -90, end: -90 },
          frequency: 5,
          emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width * 0.5, this.game.config.height*88) },
          on: true
      });
    
      emitter2.setScrollFactor(0.5).setDepth(2).setAlpha(0.25);

      topBar = this.add.graphics();
      topBar.fillStyle(0x000000);
      topBar.fillRect(0, 0, 1280, (1280) / 15);
      topBar.setDepth(3.5);
  
      bottomBar = this.add.graphics();
      bottomBar.fillStyle(0x000000);
      bottomBar.fillRect(0, 720, 1280, -(1280) / 15);
      bottomBar.setDepth(3.5);

      var centerX = this.cameras.main.width / 3;
      var centerY = this.cameras.main.height / 2;

      var logo = this.add.image(centerX, centerY, 'title').setScale(0.33);
      logo.alpha = 0;
      this.tweens.add({
          targets: logo,
          alpha: 1,
          ease: 'Linear',
          duration: 1500,
          delay: 3000
      });

      this.tweens.add({
          targets: logo,
          y: centerY - 800,
          ease: 'Linear',
          duration: 13000,
          delay: 7000,
          onComplete: function() {
          logo.destroy();
          }
      });

      if (language) {
        var credits = this.add.image(centerX, 1800, 'credits');
        credits.setScale(0.637);
        this.tweens.add({ targets: credits, y: - 325, ease: 'Linear', duration: 44000, delay: 4000 });
      } else {
        var creditsEsp = this.add.image(centerX, 1800, 'creditsEsp');
        this.tweens.add({ targets: creditsEsp, y: - 325, ease: 'Linear', duration: 44000, delay: 4000 });
        creditsEsp.setScale(0.637);
      }

  }

  update() {

      if (Phaser.Input.Keyboard.JustDown(keyF)) { toggleFullscreen(); }

      skyEnding1.x += skyEndingSpeed; skyEnding2.x += skyEndingSpeed; skyEnding3.x += skyEndingSpeed;

      if (skyEnding1.x >= 1800) { skyEnding1.x = -360; } if (skyEnding2.x >= 1800) { skyEnding2.x = -360; } if (skyEnding3.x >= 1800) { skyEnding3.x = -360; }

  }

  shutdown() {this.timer.remove();}

  resume() {
      this.overlay.setVisible(false);
  }

  }