class Pause extends Phaser.Scene {
    constructor() {
      super({ key: 'Pause' });
    }
  
    preload() { //Assets to preload for the scene
    }
  
    create() {

        // // Add the text object and store a reference to it
        // pauseText = this.add.text(200, 200, 'PAUSED', {
        //     fontSize: '64px',
        //     color: '#ffffff',
        //     align: 'center'
        // })
        // .setOrigin(0.5).setDepth(99); // Center the text horizontally and vertically

        //overlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width*4, this.cameras.main.height*2, 0x000000, 0.25).setDepth(1);

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

    // shutdown() {
    //     overlay.destroy();
    // }

}
