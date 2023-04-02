class Scene2 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {

        this.load.spritesheet('beecon_walk', 'assets/beecon_walk.png', { frameWidth: 250, frameHeight: 210 });
        this.load.spritesheet('beecon_idle', 'assets/beecon_idle.png', { frameWidth: 250, frameHeight: 210 });
        this.load.spritesheet('beecon_jump', 'assets/beecon_jump.png', { frameWidth: 250, frameHeight: 210 });
        this.load.image('wall', 'assets/wall.png');
        this.load.image('mountains', 'assets/background2.png');
        this.load.image('mountains2', 'assets/background.png');
        this.load.image('laser', 'assets/laser.png');
        this.load.image('bigLaser', 'assets/bigLaser.png');
        this.load.image('chargeReady', 'assets/chargeReady.png');

    }

    create() {

        this.scale.refresh();

        this.cameras.main.fadeIn(500);

        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms);
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});
        this.physics.add.collider(bigLasers, platforms);
        this.add.image(1700, 1303, 'ground').setScale(5).setDepth(0);
        triggerPlatform = this.physics.add.group({ immovable: true, allowGravity: false });
        player = this.physics.add.sprite(100, 0, 'beecon_idle').setScale(0.3).setDepth(0.2);
        player.body.setSize(120, 0);
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        this.physics.add.overlap(player, triggerPlatform, () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene3');
            });
        });
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(bigLasers, bigLasers);
        this.physics.add.collider(bigLasers, bigLasers, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});

        for (let i = 0; i <= 1; i++) {
            this.add.image(i * 320, -300, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
            this.add.image(i * 320, 0, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
            this.add.image(i * 320, 300, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
            this.add.image(i * 320, 600, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
        }

        platforms.create(-300, 0, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(-300, 400, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(600, 0, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(600, 400, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(900, 0, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(900, 400, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(1200, 0, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(1200, 400, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(1500, 0, 'wall').setScale(1.5).refreshBody().setDepth(0.1);
        platforms.create(1500, 400, 'wall').setScale(1.5).refreshBody().setDepth(0.1);

        for (let i = 0; i < 10; i++) {triggerPlatform.create(i * 150, 790, 'ground').setScale(1).setAlpha(0).setDepth(0.3)};

        this.anims.create({key: 'left', frames: this.anims.generateFrameNumbers('beecon_walk', { start: 0, end: 1 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'right', frames: this.anims.generateFrameNumbers('beecon_walk', { start: 3, end: 4 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('beecon_idle', { start: 2, end: 3 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'idleBack', frames: this.anims.generateFrameNumbers('beecon_idle', { start: 1, end: 0 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'jump', frames: this.anims.generateFrameNumbers('beecon_jump', { start: 2, end: 3 }), frameRate: 10, repeat: 0});
        this.anims.create({key: 'jumpBack', frames: this.anims.generateFrameNumbers('beecon_jump', { start: 1, end: 0 }), frameRate: 10, repeat: 0});

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

        cursors = this.input.keyboard.createCursorKeys();

        camera = this.cameras.main;
        camera.scrollX = game.config.width * 2;
        camera.scrollY = 0;

        chargeReady = this.add.sprite(player.x, player.y, 'chargeReady').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);

        overlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width*4, this.cameras.main.height*2, 0x000000, 0.25).setDepth(1);

    }

    update() {

        camera.scrollX = player.x - game.config.width / 4;

        if (Phaser.Input.Keyboard.JustDown(keyF)) {
            toggleFullscreen();
        }

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J))) {
            jKeyDownTime = this.time.now;
        }

        if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J), 750)) {

            let holdTime = this.time.now - jKeyDownTime;

            if (holdTime > 750) {
                chargeReady.setVisible(true);
            }
        }

        chargeReady.setPosition(player.x, player.y-50);

        lasers.getChildren().forEach(laser => {
            if (laser.body.velocity.x === 0) {
                laser.destroy();
            }
        });
    
        if (cursors.left.isDown || keyA.isDown) {
            player.setVelocityX(-250);
            if (player.anims.currentAnim.key === 'jumpBack') {
                player.anims.play('jumpBack', true); //player.flipX = true;
            } else {
                player.anims.play('left', true);   
            }    
        } else if (cursors.right.isDown || keyD.isDown) {
            player.setVelocityX(250);
            if (player.anims.currentAnim.key === 'jump') {
                player.anims.play('jump', true); //player.flipX = true;
            } else {
                player.anims.play('right', true);   
            }  
        } else {
            player.setVelocityX(0);
            if (player.anims.currentAnim === null || player.anims.currentAnim.key === 'right') {
                player.anims.play('idle', true);
            } else if (player.anims.currentAnim.key === 'left') {
                player.anims.play('idleBack', true);
            }
        }

        if (Phaser.Input.Keyboard.JustUp(keyJ)) {
            if (keyJ.duration > 750) {
                chargeReady.setVisible(false);
                shootBigLaser();
            } else {
                shootLaser();
            }
        }
    
        if (didPressUp || didPressW || didPressSpace) {
            if (player.body.onFloor()) {
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle') {
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack') {
                    player.anims.play('jumpBack', true);
                }          
                canDoubleJump = true;
                player.setVelocityY(-380);
            } else if (canDoubleJump) {
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump') {
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack') {
                    player.anims.play('jumpBack', true);
                }   
                canDoubleJump = false;
                player.setVelocityY(-350);
            }
        }

        player.on('animationcomplete-jump', function() {
            player.anims.play('idle', true);
        });

        player.on('animationcomplete-jumpBack', function() {
            player.anims.play('idleBack', true);
        });

        if (bigLasers.children.size > 4) {
            const bigLaserToDelete = bigLasers.getFirstAlive();
            if (bigLaserToDelete) {
                bigLaserToDelete.destroy();
            }
        }

    }

}