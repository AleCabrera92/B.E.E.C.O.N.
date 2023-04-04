class Opening extends Phaser.Scene {

  constructor() {
    super({ key: 'Opening' });
  }

  preload() {
    
    this.load.spritesheet('beecon_full', 'assets/beecon_full.png', { frameWidth: 250, frameHeight: 250 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('title', 'assets/title.png');

  }

  create() {

    const randomText = this.add.text(0, 0, 'PRESS ENTER', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
    randomText.setPosition(this.game.canvas.width/2, this.game.canvas.height/1.8);
    this.input.keyboard.on('keydown-ENTER', () => {this.scene.start('Scene1')});
    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(0, 600, 'beecon_full').setScale(0.3);
    player.body.setSize(120, 120);
    player.body.setOffset(65, 110);
    player.setCollideWorldBounds(true);
    platforms.create(this.game.canvas.width/2, this.game.canvas.height/3.5, 'title').setScale(1).refreshBody();

    for (let i = -1; i < 9; i++) {
      platforms.create(i * 240, 930, 'ground').setScale(2).refreshBody();
      platforms.create(i * 240, 780, 'ground').setScale(2).refreshBody();
    }

    this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('beecon_full', { start: 8, end: 9 }), frameRate: 10, repeat: -1});
    this.anims.create({key: 'left', frames: this.anims.generateFrameNumbers('beecon_full', { start: 1, end: 0 }), frameRate: 10, repeat: -1});
    this.anims.create({key: 'right', frames: this.anims.generateFrameNumbers('beecon_full', { start: 4, end: 5 }), frameRate: 10, repeat: -1});
    this.anims.create({key: 'jump', frames: this.anims.generateFrameNumbers('beecon_full', { start: 14, end: 15 }), frameRate: 10, repeat: 0});
    this.anims.create({key: 'jumpBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 13, end: 12 }), frameRate: 10, repeat: 0});
    this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('beecon_full', { start: 8, end: 9 }), frameRate: 10, repeat: -1});
    this.anims.create({key: 'idleBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 7, end: 6 }), frameRate: 10, repeat: -1});

    this.physics.add.collider(player, platforms);
    this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
  
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    player.anims.play('right');
    player.setVelocityX(250);
    
  }

  update() {

    if (player.body.blocked.right) {
      player.anims.play('left', true);
        player.setVelocityX(-250);
        let delay1 = Phaser.Math.Between(0, 4000);
        let self1 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay1,
            callback: function() {
              player.setVelocityY(-380);
              player.anims.play('jumpBack', true);
              self1.time.delayedCall(333.33, function() {
                player.anims.play('left', true);
              }, [], this);
            },
            loop: false
          });
        }
        let delay2 = Phaser.Math.Between(0, 4000);
        let self2 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay2,
            callback: function() {
              player.setVelocityY(-380);
              player.anims.play('jumpBack', true);
              self2.time.delayedCall(333.33, function() {
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
        let self3 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay3,
            callback: function() {
              player.setVelocityY(-380);
              player.anims.play('jump', true);
              self3.time.delayedCall(333.33, function() {
                player.anims.play('right', true);
              }, [], this);
            },
            loop: false
          });
        }
        let delay4 = Phaser.Math.Between(0, 4000);
        let self4 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay4,
            callback: function() {
              player.setVelocityY(-380);
              player.anims.play('jump', true);
              self4.time.delayedCall(333.33, function() {
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