class First extends Phaser.Scene {
    constructor() {
      super({ key: 'First' });
    }
  
    preload() {
      // load any assets you need for this scene
    }
  
    create() {
      // create the 'Press me' button
      const pressMeButton = this.add.text(
        this.game.config.width / 2,
        this.game.config.height / 2,
        'Press me',
        { fontSize: '32px', fill: '#fff' }
      );
      pressMeButton.setOrigin(0.5, 0.5);
      pressMeButton.setInteractive({ useHandCursor: true });
      pressMeButton.on('pointerdown', () => {
        this.scene.start('Opening');
      });
  
      // set the background color to black
      this.cameras.main.setBackgroundColor(0x000000);
      keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};
    }
  }