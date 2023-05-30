class Credits extends Phaser.Scene {
    constructor() {
      super({ key: 'Credits' });
    }

    preload() { /*Assets to preload for the scene*/ }

    create() {

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        var centerX = this.cameras.main.width / 2;
        var centerY = this.cameras.main.height / 2;

        var logo = this.add.image(centerX, centerY, 'title').setScale(0.518);
        logo.alpha = 0;
        this.tweens.add({ targets: logo, alpha: 1, ease: 'Linear', duration: 1000, delay: 1000 });
        this.tweens.add({ targets: logo, y: centerY - 800, ease: 'Linear', duration: 13000, delay: 4000, onComplete: function() { logo.destroy(); } });
        
        if (language) {
            var backText = this.add.text(10, 693.5, 'Press ENTER to exit', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
        } else {
            var backText = this.add.text(10, 693.5, 'Pulsa INTRO para salir', { fontFamily: 'Arial', fontSize: '16px', color: '#ffffff' });
        }
        backText.setOrigin(0, 0).setAlpha(0);

        this.tweens.add({ targets: backText, alpha: 1, ease: 'Linear', duration: 1000, delay: 1000 });

        if (language) {
            var credits = this.add.image(centerX, 2500, 'credits');
            this.tweens.add({ targets: credits, y: - 725, ease: 'Linear', duration: 47000, delay: 4000 });
        } else {
            var creditsEsp = this.add.image(centerX, 2500, 'creditsEsp');
            this.tweens.add({ targets: creditsEsp, y: - 725, ease: 'Linear', duration: 47000, delay: 4000 });
        }

        this.input.keyboard.on('keydown-ENTER', function() {
            this.scene.start('Title');
        }, this);

        this.time.delayedCall(58000, function() {
            this.scene.start('Title');
        }, [], this);

    };

    update() {

        if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};

    }

}