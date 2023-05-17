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

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        message = "HUMANITY IS DESPERATELY LOOKING FOR PLANETS TO COLONIZE. YOU ARE B.E.E.C.O.N., A DRONE CAPABLE OF RECOGNIZING AND EXPLORING ALIEN WORLDS.";
        delay = 100;
        index = 0;

        // Add the text
        text = this.add.text(config.width / 2, 100, "", { fontFamily: 'Arial', fontSize: 24, color: '#ffffff', wordWrap: { width: 800 } });
        text.setOrigin(0.5).setDepth(33);
        text.setAlign('center'); // Set text alignment to center

        // Start the text animation
        timerEvent = this.time.addEvent({ delay: delay, callback: addNextLetter, loop: true });

        ship = this.add.image(config.width / 2, config.height / 2, 'ship');
        ship.setDepth(3).setFlip(true);

        skyIntro1 = this.add.image(0, 0, 'skyIntro'); skyIntro2 = this.add.image(720, 0, 'skyIntro'); skyIntro3 = this.add.image(1440, 0, 'skyIntro'); skyIntro4 = this.add.image(2160, 0, 'skyIntro');
        skyIntro5 = this.add.image(0, 512, 'skyIntro'); skyIntro6 = this.add.image(720, 512, 'skyIntro'); skyIntro7 = this.add.image(1440, 512, 'skyIntro'); skyIntro8 = this.add.image(2160, 512, 'skyIntro');

        // Create a tween for ship movement
        this.tweens.add({
            targets: ship,
            y: 350,
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1
        });

    }

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyF)) { toggleFullscreen(); }

        skyIntro1.x -= skyIntroSpeed; skyIntro2.x -= skyIntroSpeed; skyIntro3.x -= skyIntroSpeed; skyIntro4.x -= skyIntroSpeed;
        skyIntro5.x -= skyIntroSpeed; skyIntro6.x -= skyIntroSpeed; skyIntro7.x -= skyIntroSpeed; skyIntro8.x -= skyIntroSpeed;

        if (skyIntro1.x <= -720) { skyIntro1.x = 2160; } if (skyIntro2.x <= -720) { skyIntro2.x = 2160; } if (skyIntro3.x <= -2160) { skyIntro3.x = 2160; } if (skyIntro4.x <= -2160) { skyIntro4.x = 2160; }
        if (skyIntro5.x <= -720) { skyIntro5.x = 2160; } if (skyIntro6.x <= -720) { skyIntro6.x = 2160; } if (skyIntro7.x <= -2160) { skyIntro7.x = 2160; } if (skyIntro8.x <= -2160) { skyIntro8.x = 2160; }

    }

    shutdown() {this.timer.remove();}

    resume() {
        this.overlay.setVisible(false);
    }

}