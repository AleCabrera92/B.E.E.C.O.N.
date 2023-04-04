class Opening extends Phaser.Scene {

  constructor() {
    super({ key: 'Opening' });
  }

  preload() {
    
    this.load.spritesheet('beecon_full', 'assets/beecon_full.png', { frameWidth: 250, frameHeight: 210 });
    this.load.image('ground', 'assets/platform.png');
    this.load.image('title', 'assets/title.png');

  }

  create() {

    const randomText = this.add.text(0, 0, 'PRESS ENTER', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
    randomText.setPosition(this.game.canvas.width/2, this.game.canvas.height/1.8);
    this.input.keyboard.on('keydown-ENTER', () => {this.scene.start('Scene1')});
    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(100, 600, 'beecon_full').setScale(0.3);
    player.body.setSize(120, 0);
    player.setCollideWorldBounds(true);
    platforms.create(this.game.canvas.width/2, this.game.canvas.height/3.5, 'title').setScale(1).refreshBody();

    for (let i = -1; i < 9; i++) {
      platforms.create(i * 240, 930, 'ground').setScale(2).refreshBody();
      platforms.create(i * 240, 780, 'ground').setScale(2).refreshBody();
    }

    this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('beecon_full', { start: 8, end: 9 }), frameRate: 10, repeat: -1});
    this.physics.add.collider(player, platforms);
    this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
  
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    
  }

  update() {

    if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};
    if (player.anims.currentAnim === null || player.anims.currentAnim.key === 'right') {player.anims.play('idle', true)};

  }

  shutdown() {this.timer.remove()};

}