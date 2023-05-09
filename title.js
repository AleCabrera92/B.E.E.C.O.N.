class Title extends Phaser.Scene {

  constructor() {
    super({ key: 'Title' });
  }

    preload() { //Assets to preload for the scene
    }

  create() {

    this.scale.refresh();

    overlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000).setOrigin(0).setDepth(1002);

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

    overlay2 = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000).setOrigin(0).setDepth(1000);

    this.time.delayedCall(3000, function() {
      this.tweens.add({
        targets: overlay2,
        alpha: 0,
        duration: 1000,
        onComplete: function() {
          overlay2.destroy();
        }
      });
    }, [], this);
  
    // this.sound.pauseOnBlur = false;
    // this.sound.on('blur', function () {
    //   bgm.setMute(true);
    // });
  
    // // Unmute the audio when the tab regains focus
    // this.sound.on('focus', function () {
    //   bgm.setMute(false);
    // });
  
    // Play the audio after a delay of 3 seconds
    this.time.delayedCall(850, function() {
      sound_titleTheme.play();
    }, [], this);

    const randomText = this.add.text(0, 0, 'PRESS ENTER TO START', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
    randomText.setPosition(this.game.canvas.width/2, this.game.canvas.height/1.8);
    randomText.setShadow(2, 2, '#000000', 2).setDepth(3);
    //this.input.keyboard.on('keydown-ENTER', () => {this.cameras.main.fadeOut(1000); this.scene.start('Scene1')});
    this.input.keyboard.on('keydown-ENTER', () => {this.scene.start('Scene1')});
    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(750, 600, 'beecon_full').setScale(0.3);
    player.body.setSize(120, 120);
    player.body.setOffset(65, 110);
    player.setCollideWorldBounds(true);
    platforms.create(this.game.canvas.width/2, this.game.canvas.height/3.5, 'title').setScale(0.518).refreshBody().setDepth(1001).setAlpha(1);

    for (let i = 0; i < 3; i++) {this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1).setDepth(-0.4)};

    clouds = this.physics.add.image(576, 100, 'clouds').setScrollFactor(0.13).setDepth(-0.3).setGravity(false).setAlpha(0.75); // enable physics on the image
    clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
    clouds2 = this.physics.add.image(1500, 300, 'clouds').setScrollFactor(0.15).setDepth(-0.3).setGravity(false).setAlpha(0.75); // enable physics on the image
    clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
    clouds3 = this.physics.add.image(803, 500, 'clouds').setScrollFactor(0.17).setDepth(-0.3).setGravity(false).setAlpha(0.75); // enable physics on the image
    clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

    for (let i = 0; i < 4; i++) {platforms.create(i * 512, 760, 'ground').setScale(1).refreshBody()};

    this.physics.add.collider(player, platforms);
    this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
  
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    player.anims.play('left');
    player.setVelocityX(-250);

    // emitter = this.add.particles('rain').setDepth(-0.11).createEmitter({
    //   x: 0,
    //   y: 0,
    //   quantity: 50,
    //   lifespan: 1600,
    //   speedY: { min: 300, max: 500 },
    //   speedX: { min: -5, max: 5 },
    //   scale: { start: 0.1, end: 0.5 },
    //   rotate: { start: 0, end: 0 },
    //   frequency: 5,
    //   emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width, 1) },
    //   on: true
    // });

    // emitter.setScrollFactor(0).setScale(0.5).setAlpha(0.7);
    
  }

  update() {

    if (clouds) {this.physics.world.wrap(clouds.body, clouds.width, true)};
    if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width, true)};
    if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width, true)};

    if (player.body.blocked.right) {
      player.anims.play('left', true);
        player.setVelocityX(-250);
        let delay1 = Phaser.Math.Between(0, 4000);
        let selfu1 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay1,
            callback: function() {
              player.setVelocityY(-380);
              selfu1.physics.world.gravity.y = 600;
              selfu1.tweens.add({ targets: selfu1.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jumpBack', true);
              selfu1.time.delayedCall(333.33, function() {
                player.anims.play('fallBack', true);
              }, [], this);
              selfu1.time.delayedCall(666.66, function() {
                player.anims.play('left', true);
              }, [], this);
            },
            loop: false
          });
        }
        let delay2 = Phaser.Math.Between(0, 4000);
        let selfu2 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay2,
            callback: function() {
              player.setVelocityY(-380);
              selfu2.physics.world.gravity.y = 600;
              selfu2.tweens.add({ targets: selfu2.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jumpBack', true);
              selfu2.time.delayedCall(333.33, function() {
                player.anims.play('fallBack', true);
              }, [], this);
              selfu2.time.delayedCall(666.66, function() {
                player.anims.play('left', true);
              }, [], this);
            },
            loop: false
          });
        }
      player.setVelocityX(-250);
    } else if (player.body.blocked.left) {
        player.anims.play('right', true);
        player.setVelocityX(250);
        let delay3 = Phaser.Math.Between(0, 4000);
        let selfu3 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay3,
            callback: function() {
              player.setVelocityY(-380);
              selfu3.physics.world.gravity.y = 600;
              selfu3.tweens.add({ targets: selfu3.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jump', true);
              selfu3.time.delayedCall(333.33, function() {
                player.anims.play('fall', true);
              }, [], this);
              selfu3.time.delayedCall(666.66, function() {
                player.anims.play('right', true);
              }, [], this);
            },
            loop: false
          });
        }
        let delay4 = Phaser.Math.Between(0, 4000);
        let selfu4 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay4,
            callback: function() {
              player.setVelocityY(-380);
              selfu4.physics.world.gravity.y = 600;
              selfu4.tweens.add({ targets: selfu4.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jump', true);
              selfu4.time.delayedCall(333.33, function() {
                player.anims.play('fall', true);
              }, [], this);
              selfu4.time.delayedCall(666.66, function() {
                player.anims.play('right', true);
              }, [], this);
            },
            loop: false
          }); 
        }   
    }

    player.on('animationcomplete-jump', function() {
      player.anims.play('idle', true);
    });

    player.on('animationcomplete-jumpBack', function() {
        player.anims.play('idleBack', true);
    });
    
    if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};

  }

  shutdown() {this.timer.remove()};

}