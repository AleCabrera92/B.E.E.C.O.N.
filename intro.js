class Intro extends Phaser.Scene {

    constructor() {
        super({ key: 'Intro' });
    }

    preload() { 

        this.load.image('ship', 'assets/ship.png');
        this.load.image('skyIntro', 'assets/skyIntro.png');

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

        text = this.add.text(config.width / 2, 75, "", { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', wordWrap: { width: 800 } });
        text.setOrigin(0.5).setDepth(33);
        text.setAlign('center'); // Set text alignment to center

        // Start the text animation
        //timerEvent = this.time.addEvent({ delay: 100, callback: addNextLetter, loop: true });

        ship = this.add.image(config.width / 2, config.height / 2, 'ship');
        ship.setDepth(3).setFlip(true);

        skyIntro1 = this.add.image(360, 0, 'skyIntro'); skyIntro2 = this.add.image(1080, 0, 'skyIntro');  skyIntro3 = this.add.image(1800, 0, 'skyIntro');
        skyIntro4 = this.add.image(360, 512, 'skyIntro'); skyIntro5 = this.add.image(1080, 512, 'skyIntro'); skyIntro6 = this.add.image(1800, 512, 'skyIntro');

        // Create a tween for ship movement
        this.tweens.add({
            targets: ship,
            y: 350,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

        keyEnter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        if (language) {

            keyEnter.on('down', function () {
                text.setText("");
        
                if (currentSentenceIndex >= sentences.length) {
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
                text.setText("");
        
                if (currentSentenceSpanishIndex >= sentencesSpanish.length) {
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