class First extends Phaser.Scene {

    constructor() {
      super({ key: 'First' });
    }
  
    preload() {

      this.load.image('beeIcon', 'assets/beeIcon.png');

    }
  
    create() {

      // create the button
      beeIcon = this.add.image(
        this.game.config.width / 2,
        this.game.config.height / 2.5,
        'beeIcon'
      );
      beeIcon.setAlpha(0.8).setScale(0.5).setOrigin(0.5);
      beeIcon.setInteractive({ useHandCursor: true });
      beeIcon.on('pointerdown', () => {
          this.scene.start('Title');
      });
      beeIcon.on('pointerover', () => {
        beeIcon.setAlpha(1);
      });
      beeIcon.on('pointerout', () => {
          beeIcon.setAlpha(0.8);
      });

      // set the background color to black
      this.cameras.main.setBackgroundColor(0x000000);

      // create the 'Press me' button
      pressMeButton = this.add.text(
        this.game.config.width / 2,
        this.game.config.height / 1.5,
        //'PRESS ME',
        'Press me',
        { fontSize: '32px', fill: '#fff' }
      );
      pressMeButton.setOrigin(0.5, 0.5);
      // pressMeButton.setInteractive({ useHandCursor: true });
      // pressMeButton.on('pointerdown', () => {
      //   this.scene.start('Title');
      // });
  
      // set the background color to black
      this.cameras.main.setBackgroundColor(0x000000);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    }

    update(){

      if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};
  
    }

  }