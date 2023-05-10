class Pause extends Phaser.Scene {
    constructor() {
      super({ key: 'Pause' });
    }
  
    preload() { /*Assets to preload for the scene*/ }
  
    create() {

        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyF)) { toggleFullscreen(); }

        this.input.keyboard.on('keydown-P', function () {
            if (scene === 0) {
                game.scene.resume('Test');
            } else {
                game.scene.resume('Scene'+scene);
            }
        }, this);
    }

}
