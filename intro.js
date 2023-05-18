class Intro extends Phaser.Scene {

    constructor() {
        super({ key: 'Intro' });
    }

    preload() { 
        // Assets to preload for the scene
    }

    create() {

        this.scale.refresh();

        scene = 'Intro';

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

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        text = this.add.text(config.width / 2, 45, "", { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', wordWrap: { width: 800 } });
        text.setOrigin(0.5).setDepth(33);
        text.setAlign('center'); // Set text alignment to center

        // Start the text animation
        //timerEvent = this.time.addEvent({ delay: 100, callback: addNextLetter, loop: true });

        ship = this.add.image(config.width / 2, config.height / 2, 'ship');
        ship.setDepth(3).setFlip(true);
        shipEngine = this.add.image(config.width / 2, config.height / 2, 'shipEngine');
        shipEngine.setDepth(2.99).setFlip(true);

        skyIntro1 = this.add.image(360, 0, 'skyIntro'); skyIntro2 = this.add.image(1080, 0, 'skyIntro');  skyIntro3 = this.add.image(1800, 0, 'skyIntro');
        skyIntro4 = this.add.image(360, 512, 'skyIntro'); skyIntro5 = this.add.image(1080, 512, 'skyIntro'); skyIntro6 = this.add.image(1800, 512, 'skyIntro');

        // Create a tween for ship movement
        this.tweens.add({
            targets: ship,
            y: 380,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        // Create a tween for ship movement
        this.tweens.add({
            targets: shipEngine,
            y: 380,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: shipEngine,
            alpha: 0.75,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.tweens.add({
            targets: shipEngine,
            scaleX: 0.99,  // Desired scale on the x-axis
            scaleY: 0.99,  // Desired scale on the y-axis
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        if (language) {

            keyEnter.on('down', function () {

                if (index >= 0 && index < message.length) {
                    // Skip to the end of the current message
                    text.setText(message);
                    index = message.length;
                    return; // Exit the function to prevent further execution
                }

                text.setText("");
        
                if (currentSentenceIndex >= sentences.length) {
                    player = this.physics.add.sprite(575, 355, 'beecon_full').setScale(0.3).setDepth(2.99);
                    player.setFlipY(true);
                    player.anims.play('drill', true);
                    this.cameras.main.fadeOut(2000);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('Scene1', { sceneBack: false });
                    });
                    return; // Exit the function to prevent further execution
                }
        
                message = sentences[currentSentenceIndex];
                currentSentenceIndex++;
    
                index = 0;
    
                timerEvent = this.time.addEvent({ delay: 100, callback: addNextLetter, loop: true });
            }, this);

        } else {

            keyEnter.on('down', function () {

                if (index >= 0 && index < message.length) {
                    // Skip to the end of the current message
                    text.setText(message);
                    index = message.length;
                    return; // Exit the function to prevent further execution
                }

                text.setText("");
        
                if (currentSentenceSpanishIndex >= sentencesSpanish.length) {
                    player = this.physics.add.sprite(575, 355, 'beecon_full').setScale(0.3).setDepth(2.99);
                    player.setFlipY(true);
                    player.anims.play('drill', true);
                    this.cameras.main.fadeOut(2000);
                    this.cameras.main.once('camerafadeoutcomplete', () => {
                        this.scene.start('Scene1', { sceneBack: false });
                    });
                    return; // Exit the function to prevent further execution
                }
        
                message = sentencesSpanish[currentSentenceSpanishIndex];
                currentSentenceSpanishIndex++;
    
                index = 0;
    
                timerEvent = this.time.addEvent({ delay: 100, callback: addNextLetter, loop: true });
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
            delay: 1000 // Two-second delay
        });

        emitter = this.add.particles(0, 0, 'spaceRain',{
            x: 0,
            y: 800,
            quantity: 1,
            lifespan: 1600,
            speedY: { min: -700, max: -900 },
            speedX: { min: -1500, max: -1750 },
            scale: { start: 1.75, end: 1.75 },
            rotate: { start: 115, end: 115 },
            frequency: 5,
            emitZone: { source: new Phaser.Geom.Rectangle(-this.game.config.width, 0, this.game.config.width*88, 1) },
            on: true
        });
      
        emitter.setScrollFactor(0.5).setDepth(3.1).setAlpha(0.75);
        //emitter.setTint(0xffffff);

        emitter2 = this.add.particles(0, 0, 'spaceRain',{
            x: 0,
            y: 800,
            quantity: 1,
            lifespan: 1600,
            speedY: { min: -700, max: -900 },
            speedX: { min: -1500, max: -1750 },
            scale: { start: 1.75, end: 1.75 },
            rotate: { start: 115, end: 115 },
            frequency: 5,
            emitZone: { source: new Phaser.Geom.Rectangle(-this.game.config.width, 0, this.game.config.width*88, 1) },
            on: true
        });
      
        emitter2.setScrollFactor(0.5).setDepth(2).setAlpha(0.25);
        //emitter.setTint(0xffffff);

        topBar = this.add.graphics();
        topBar.fillStyle(0x000000); // Set the color to black
        topBar.fillRect(0, 0, 1280, (1280) / 15);
        topBar.setDepth(3.5);
    
        bottomBar = this.add.graphics();
        bottomBar.fillStyle(0x000000); // Set the color to black
        bottomBar.fillRect(0, 720, 1280, -(1280) / 15);
        bottomBar.setDepth(3.5);

    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyF)) { toggleFullscreen(); }

        skyIntro1.x -= skyIntroSpeed; skyIntro2.x -= skyIntroSpeed; skyIntro3.x -= skyIntroSpeed;
        skyIntro4.x -= skyIntroSpeed; skyIntro5.x -= skyIntroSpeed; skyIntro6.x -= skyIntroSpeed;

        if (skyIntro1.x <= -360) { skyIntro1.x = 1800; } if (skyIntro2.x <= -360) { skyIntro2.x = 1800; } if (skyIntro3.x <= -360) { skyIntro3.x = 1800; }
        if (skyIntro4.x <= -360) { skyIntro4.x = 1800; } if (skyIntro5.x <= -360) { skyIntro5.x = 1800; } if (skyIntro6.x <= -360) { skyIntro6.x = 1800; }

    }

    shutdown() {this.timer.remove();}

    resume() {
        this.overlay.setVisible(false);
    }

}