class Scene3 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene3' });
    }

    preload() {

        this.load.spritesheet('beecon', 'assets/beecon.png', { frameWidth: 250, frameHeight: 210 });
        this.load.spritesheet('beecon_idle', 'assets/beecon_idle.png', { frameWidth: 250, frameHeight: 210 });
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('mountains', 'assets/background2.png');
        this.load.image('mountains2', 'assets/background.png');
        this.load.image('laser', 'assets/laser.png');
        this.load.image('bigLaser', 'assets/bigLaser.png');

    }

    create() {

        fullscreenButton.addEventListener('click', () => {
            if (this.scale.isFullscreen) {
                this.scale.stopFullscreen();
            } else {
                this.scale.startFullscreen();
            }
        });

        for (var i = 0; i < 3; i++) {
            this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1);
        }

        mountains = this.physics.add.staticGroup();

        for (var i = 0; i <= 1; i++) {
            mountains.create(i * 320, -320, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
            mountains.create(i * 320, 0, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
            mountains.create(i * 320, 330, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
            mountains.create(i * 320, 600, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
        }

        platforms = this.physics.add.staticGroup();

        platforms.create(-300, 0, 'wall').setScale(1.5).refreshBody();
        platforms.create(-300, 400, 'wall').setScale(1.5).refreshBody();
        platforms.create(600, 0, 'wall').setScale(1.5).refreshBody();
        platforms.create(900, 0, 'wall').setScale(1.5).refreshBody();
        platforms.create(1200, 0, 'wall').setScale(1.5).refreshBody();
        platforms.create(1500, 0, 'wall').setScale(1.5).refreshBody();
        platforms.create(500, 650, 'ground').setScale(0.8).refreshBody();
        platforms.create(800, 650, 'ground').setScale(0.8).refreshBody();

        lasers = this.physics.add.group({
            allowGravity: false
        });

        this.physics.add.collider(lasers, platforms);

        bigLasers = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });

        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {
            bigLaser.setVelocityX(0);
            bigLaser.setAcceleration(0);
        });

        this.physics.add.collider(bigLasers, platforms);

        for (var i = -1; i < 6; i++) {
            platforms.create(i * 240, 930, 'ground').setScale(2).refreshBody();
            platforms.create(i * 240, 780, 'ground').setScale(2).refreshBody();
        }

        triggerPlatform = this.physics.add.sprite(1700, 1303, 'ground').setScale(5);

        triggerPlatform.setImmovable(true);
        triggerPlatform.body.allowGravity = false;

        player = this.physics.add.sprite(100, 0, 'beecon').setScale(0.3);
        player.body.setSize(120, 0);

        this.physics.add.collider(bigLasers, player);

        player.setBounce(0.2);
        player.setCollideWorldBounds(true);

        this.physics.add.overlap(player, triggerPlatform, function() {
            this.scene.start('Scene2');
        }, null, this);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('beecon', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('beecon', { start: 3, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('beecon_idle', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1       
        });

        this.anims.create({
            key: 'idleBack',
            frames: this.anims.generateFrameNumbers('beecon_idle', { start: 1, end: 0 }),
            frameRate: 10,
            repeat: -1       
        });

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

        cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(player, platforms);

        camera = this.cameras.main;
        camera.scrollX = game.config.width * 2;
        camera.scrollY = 0;

        overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width*3,
            this.cameras.main.height*2,
            0x000000,
            0.5
        );
        overlay.setDepth(1);

    }

    update() {

        camera.scrollX = player.x - game.config.width / 4;

        lasers.getChildren().forEach(laser => {
            if (laser.body.velocity.x === 0) {
                laser.destroy();
            }
        });
    
        if (cursors.left.isDown || keyA.isDown) {
            player.setVelocityX(-250);
            player.anims.play('left', true);
        } else if (cursors.right.isDown || keyD.isDown) {
            player.setVelocityX(250);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            if (player.anims.currentAnim === null || player.anims.currentAnim.key === 'right') {
                player.anims.play('idle', true);
            } else if (player.anims.currentAnim.key === 'left') {
                player.anims.play('idleBack', true);
            }
        }

        if (Phaser.Input.Keyboard.JustUp(keyJ)) {
            if (keyJ.duration > 1500) {
                shootBigLaser();
            } else {
                shootLaser();
            }
        }
    
        didPressUp = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP));
        didPressW = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
        didPressSpace = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE));

        if (didPressUp || didPressW || didPressSpace) {
            if (player.body.onFloor()) {
                canDoubleJump = true;
                player.setVelocityY(-380);
            } else if (canDoubleJump) {
                canDoubleJump = false;
                player.setVelocityY(-350);
            }
        }

    }

}