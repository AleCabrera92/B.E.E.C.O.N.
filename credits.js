class Credits extends Phaser.Scene {
    constructor() {
      super({ key: 'Credits' });
    }

    create() {

        //this.time.delayedCall(850, function() { sound_titleTheme.play(); }, [], this);

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        var centerX = this.cameras.main.width / 2;
        var centerY = this.cameras.main.height / 2;

        // Add the logo image with a delay of two seconds
        var logo = this.add.image(centerX, centerY, 'title').setScale(0.518);
        logo.alpha = 0; // Initially invisible
        this.tweens.add({
            targets: logo,
            alpha: 1,
            ease: 'Linear',
            duration: 1000,
            delay: 1000 // Two-second delay
        });

        // Animation for the logo to move up and disappear
        this.tweens.add({
            targets: logo,
            y: centerY - 800,
            ease: 'Linear',
            duration: 13000,
            delay: 4000, // Delay before moving up (2s delay + 1s fade-in + 1s delay)
            onComplete: function() {
            logo.destroy(); // Remove the logo after the animation completes
            }
        });

        
        if (language) {
            var backText = this.add.text(10, 693.5, 'Press ENTER to exit', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
        } else {
            var backText = this.add.text(10, 693.5, 'Pulsa INTRO para salir', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
        }
        backText.setOrigin(0, 0).setAlpha(0);

        this.tweens.add({
            targets: backText,
            alpha: 1,
            ease: 'Linear',
            duration: 1000,
            delay: 1000 // Two-second delay
        });

        // Add the credits text
        if (language) {
            var creditsText = this.add.text(centerX, centerY + 400, 'Game created by Alejandro Cabrera García', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });
        } else {
            var creditsText = this.add.text(centerX, centerY + 400, 'Juego creado por Alejandro Cabrera García', { fontFamily: 'Arial', fontSize: '24px', color: '#ffffff' });
        }
        creditsText.setOrigin(0.5, 0);

        // Animation for the credits text to move up
        this.tweens.add({
            targets: creditsText,
            y: - 800 + 700,
            ease: 'Linear',
            duration: 13000,
            delay: 4000 // Delay before moving up (2s delay + 1s fade-in + 3s animation + 1s delay)
        });

        // Event listener for the Enter key
        this.input.keyboard.on('keydown-ENTER', function() {
            this.scene.start('Title'); // Start the 'title' scene when Enter is pressed
        }, this);

        // Delay the scene transition after 20 seconds
        this.time.delayedCall(18000, function() {
            this.scene.start('Title'); // Start the 'Title' scene after 20 seconds
        }, [], this);

    };

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};

    }

}