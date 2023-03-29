class Opening extends Phaser.Scene {

  constructor() {
    super({ key: 'Opening' });
  }

  preload() {

  }

  create() {
    const randomText = this.add.text(
      0,
      0,
      'PRESS ENTER',
      { font: '32px Arial', fill: '#fff' }
    ).setOrigin(0.5);
    randomText.setPosition(this.game.canvas.width/2, this.game.canvas.height/2);
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('Scene1');
    });
  }

  update() {

  }
}