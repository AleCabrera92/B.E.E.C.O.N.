class First extends Phaser.Scene {

    constructor() {
      super({ key: 'First' });
    }
  
    preload() {

      this.load.image('beeIcon', 'assets/beeIcon.png');

    }
  
    create() {

      beeIcon = this.add.image(this.game.config.width / 2, this.game.config.height / 2.5, 'beeIcon');
      beeIcon.setAlpha(0.8).setScale(0.5).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => { this.scene.start('Title') });
      beeIcon.on('pointerover', () => { beeIcon.setAlpha(1) }); beeIcon.on('pointerout', () => { beeIcon.setAlpha(0.8) });

      clickBButton = this.add.text(this.game.config.width / 2, this.game.config.height / 1.5, 'Click on             !', { fontSize: '32px', fill: '#fff' });
      clickBButton.setOrigin(0.5, 0.5);
      clickBButton2 = this.add.text(this.game.config.width / 2, this.game.config.height / 1.5, '         B.E.E.C.O.N. ', { fontSize: '32px', fill: '#FFBF00' } ); //fontStyle: 'bold'
      clickBButton2.setOrigin(0.5, 0.5);
  
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
      keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {

      if (Phaser.Input.Keyboard.JustDown(keyF)) { toggleFullscreen(); }
      //if (Phaser.Input.Keyboard.JustDown(keySpace)) { this.scene.start('Title'); }

    }

  }