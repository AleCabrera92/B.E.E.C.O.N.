class Opening extends Phaser.Scene {

  constructor() {
    super({ key: 'Opening' });
  }

  preload() {

    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('beecon', 'assets/beecon.png', { frameWidth: 250, frameHeight: 210 });
    this.load.spritesheet('beecon_idle', 'assets/beecon_idle.png', { frameWidth: 250, frameHeight: 210 });
    this.load.image('title', 'assets/title.png');
  }

  create() {

    const randomText = this.add.text(
      0,
      0,
      'PRESS ENTER',
      { font: '32px Arial', fill: '#fff' }
    ).setOrigin(0.5);
    randomText.setPosition(this.game.canvas.width/2, this.game.canvas.height/1.8);
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('Scene1');
    });

    // Set up fullscreen button
    const fullscreenButton = document.getElementById('fullscreenButton');
    fullscreenButton.addEventListener('click', () => {
        if (this.scale.isFullscreen) {
            this.scale.stopFullscreen();
        } else {
            this.scale.startFullscreen();
        }
    });

    platforms = this.physics.add.staticGroup();

    platforms.create(this.game.canvas.width/2, this.game.canvas.height/4, 'title').setScale(1.5).refreshBody(); //300

    for (var i = -1; i < 9; i++) {
      platforms.create(i * 240, 930, 'ground').setScale(2).refreshBody(); //300
      platforms.create(i * 240, 780, 'ground').setScale(2).refreshBody(); //300
    }

    player = this.physics.add.sprite(100, 600, 'beecon').setScale(0.3); // Set initial frame to face right
    player.body.setSize(120, 0);
    player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('beecon_idle', { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1       
    });

    this.physics.add.collider(player, platforms);

  }

  update() {

    if (player.anims.currentAnim === null || player.anims.currentAnim.key === 'right') {
      player.anims.play('idle', true);
    }

  }
}