class Scene1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {

        this.load.spritesheet('beecon_full', 'assets/beecon_full.png', { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 350, frameHeight: 300 });
        this.load.image('sky', 'assets/sky.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('breakableGround', 'assets/breakablePlatform.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.image('mountains', 'assets/mountains.png');
        this.load.image('laser', 'assets/laser.png');
        this.load.image('bigLaser', 'assets/bigLaser.png');
        this.load.image('chargeReady', 'assets/chargeReady.png');
        this.load.image('clouds', 'assets/cloud.png');
        this.load.image('gameOver', 'assets/gameOver.png');
        this.load.image('tree', 'assets/tree.png');
        this.load.image('grass', 'assets/grass.png');
        this.load.image('rain', 'assets/rain.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('skyOverlay', 'assets/skyOverlay.png');
        this.load.audio('titleTheme', 'assets/titleTheme.mp3');

    }

    create() {

        this.scale.refresh();

        overlay = this.add.rectangle(-500, 0, this.game.config.width*2, this.game.config.height*2, 0x000000).setOrigin(0).setDepth(1002);

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

        //this.cameras.main.fadeIn(1000);

        isMusicPlaying = false;
        this.sound.sounds.forEach(function(sound) {
            if (sound.key === 'titleTheme' && sound.isPlaying) {
                isMusicPlaying = true;
            }
        });
        
        // Play background music if it's not already playing
        if (!isMusicPlaying) {
            this.sound.play('titleTheme', { loop: true });
        }

        livesText = this.add.text(player.x, 10, 'Energy: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#ffffff' }).setDepth(10);

        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms);
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});
        this.physics.add.collider(bigLasers, platforms);
        this.add.image(1700, 1303, 'ground').setScale(5).setDepth(0);
        triggerPlatform = this.physics.add.group({ immovable: true, allowGravity: false });
        player = this.physics.add.sprite(0, -500, 'beecon_full').setScale(0.3).setDepth(0.19);
        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        /**************************************************************************************************************************************************************************/
        enemy = this.physics.add.sprite(1560, 250, 'enemy').setScale(0.25).setDepth(0.19);
        enemy.body.setSize(280, 220);
        enemy.body.setOffset(30, 60);
        enemy.setCollideWorldBounds(false);
        this.physics.add.collider(enemy, platforms);
        this.physics.add.overlap(player, enemy, function(player) {
            decreaseLives();
            if (lives === 0) {
                this.sound.stopAll();
                player.alpha = 0;
                player.anims.stop();
                player.disableBody(true, true);
                let gameOverImage = this.add.image(player.x+320, game.config.height / 4, 'gameOver');
                gameOverImage.setOrigin(0.5).setAlpha(0.75).setDepth(3);
                let randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                randomText.setShadow(2, 2, '#000000', 2).setDepth(3);
                randomText.setPosition(player.x+320, game.config.height / 2);
                this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
                let j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); this.input.keyboard.removeKey(j);
                this.input.keyboard.on('keydown-ENTER', () => {lives = 99; this.scene.start('Scene1')});
                this.input.keyboard.on('keydown-E', () => {lives = 99; this.scene.start('Title')}); }
            }, null, this);
        this.physics.add.overlap(lasers, enemy, function(enemy) {enemy.alpha === 0; enemy.anims.stop(); enemy.disableBody(true, true); lasers.setVelocity(0, 0)});
        this.physics.add.overlap(bigLasers, enemy, function(enemy, bigLasers) {
            if (bigLasers.body.velocity.x === 0) {return;} enemy.alpha = 0; enemy.anims.stop(); enemy.disableBody(true, true); });
        /**************************************************************************************************************************************************************************/
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        this.physics.add.overlap(player, triggerPlatform, () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene2');
            });
        });
        const self = this;
        this.physics.add.collider(player, platforms, function(player, platform) {
            if (player.anims.currentAnim.key === 'drill' && platform.texture.key === 'breakableGround') {
                let timer = 0;
                let timerEvent = self.time.addEvent({
                    delay: 500,
                    callback: () => {
                        timer++;
                        if (timer >= 1 && player.anims.currentAnim.key === 'drill') {
                            platform.destroy();
                            timerEvent.remove();
                        }
                    },
                    loop: true,
                    callbackScope: self
                });
                player.once('animationcomplete', (animation) => {
                    if (animation.key === 'drill') {
                        timerEvent.remove();
                    }
                });
            }
        });
        this.physics.add.collider(bigLasers, bigLasers);
        this.physics.add.collider(bigLasers, bigLasers, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});

        for (let i = 9.5; i < 15; i++) {triggerPlatform.create(i * 150, 790, 'platform').setScale(1).setAlpha(0).setDepth(0.2);}
        for (let i = 0; i < 3; i++) {this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1).setDepth(-1);}
        for (let i = 0; i < 8; i++) {this.add.image(i * 800, 500, 'skyOverlay').setScrollFactor(0.1).setScale(2).setAlpha(1).setDepth(-1).setTint(Phaser.Display.Color.GetColor(100, 125, 250));}

        clouds = this.physics.add.image(576, 94, 'clouds').setScrollFactor(0.13).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
        clouds2 = this.physics.add.image(1500, 271, 'clouds').setScrollFactor(0.15).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
        clouds3 = this.physics.add.image(803, 433, 'clouds').setScrollFactor(0.17).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

        for (let i = 0; i <= 4; i++) {this.add.image(i * 1200, 450, 'mountains').setScale(1.5).setScrollFactor(0.2).setDepth(-0.8).setTint(Phaser.Display.Color.GetColor(125, 100, 150));}
        for (let i = 0; i < 4; i++) {platforms.create(1880, 390 + i * 100, 'breakableGround').setScale(0.8).refreshBody().setDepth(0.3);}

        platforms.create(1400, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1400, 690, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1520, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1520, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1520, 690, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1640, 390, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1640, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1640, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1640, 690, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1760, 390, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1760, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1760, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1760, 690, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2000, 390, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2000, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2000, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2000, 690, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2530, 300, 'wall').setScale(2.4).refreshBody().setDepth(0.2).setFlipX(true).setTint(Phaser.Display.Color.GetColor(200, 200, 200));

        platforms.create(-400, 400, 'wall').setScale(1).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(200, 200, 200));
        platforms.create(500, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(800, 570, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(800, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(880, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);

        for (let i = -2; i < 4; i++) {platforms.create(i * 512, 755, 'ground').setScale(1).refreshBody().setDepth(0.2);}

        this.add.image(-270, 185, 'tree').setScale(0.55).setDepth(-0.2).setScrollFactor(1).setAlpha(1).setTint(Phaser.Display.Color.GetColor(200, 200, 200));
        this.add.image(340, 463, 'tree').setScale(0.8).setDepth(0.21).setTint(Phaser.Display.Color.GetColor(230, 230, 230));
        this.add.image(1250, 470, 'tree').setScale(0.65).setDepth(-0.2).setScrollFactor(0.8).setTint(Phaser.Display.Color.GetColor(180, 180, 180));

        for (let i = -2; i < 16; i++) {this.add.image(i * 240, 600, 'grass').setScale(0.3).setDepth(-0.2).setScrollFactor(0.9).setTint(Phaser.Display.Color.GetColor(230, 230, 230));}

        for (let i = -2; i < 16; i++) {this.add.image(i * 240, 690, 'grass').setScale(0.4).setDepth(0.3).setScrollFactor(1.1).setTint(Phaser.Display.Color.GetColor(50, 50, 50));}

        this.anims.create({key: 'left', frames: this.anims.generateFrameNumbers('beecon_full', { start: 1, end: 0 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'right', frames: this.anims.generateFrameNumbers('beecon_full', { start: 4, end: 5 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('beecon_full', { start: 8, end: 9 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'idleBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 7, end: 6 }), frameRate: 10, repeat: -1});
        this.anims.create({key: 'jump', frames: this.anims.generateFrameNumbers('beecon_full', { start: 14, end: 15 }), frameRate: 10, repeat: 0});
        this.anims.create({key: 'jumpBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 13, end: 12 }), frameRate: 10, repeat: 0});
        this.anims.create({key: 'drill', frames: this.anims.generateFrameNumbers('beecon_full', { start: 10, end: 11 }), frameRate: 30, repeat: -1});
        this.anims.create({key: 'enemyChill', frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }), frameRate: 10, repeat: -1});

        /**************************************************************************************************************************************************************************/
        enemy.anims.play('enemyChill');
        enemy.setVelocityX(100);
        /**************************************************************************************************************************************************************************/

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        cursors = this.input.keyboard.createCursorKeys();

        camera = this.cameras.main;
        camera.scrollX = game.config.width * 2;
        camera.scrollY = 0;

        chargeReady = this.add.sprite(player.x, player.y, 'chargeReady').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);

        emitter = this.add.particles('rain').setDepth(-0.11).createEmitter({
            x: 0,
            y: 0,
            quantity: 50,
            lifespan: 1600,
            speedY: { min: 300, max: 500 },
            speedX: { min: -5, max: 5 },
            scale: { start: 0.1, end: 0.5 },
            rotate: { start: 0, end: 0 },
            frequency: 5,
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width, 1) },
            on: true
        });
      
        emitter.setScrollFactor(0).setScale(0.5).setAlpha(0.7);
    
    }

    update() {

        camera.scrollX = player.x - game.config.width / 4;

        livesText.x = player.x+10 - game.config.width / 4;
        livesText.y = 10;

        if (clouds) {this.physics.world.wrap(clouds.body, clouds.width+50, true);}
        if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width+50, true);}
        if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width+50, true);}

        /**************************************************************************************************************************************************************************/
        enemy.anims.play('enemyChill', true);

        if (enemy.body.touching.right) {
            // Reverse the enemy's velocity to make it move left
            enemy.setVelocityX(-100);
        } else if (enemy.body.touching.left) {
            // Reverse the enemy's velocity to make it move right
            enemy.setVelocityX(100);
        }
        /**************************************************************************************************************************************************************************/

        keyA.on('down', enableKeys);
        keyD.on('down', enableKeys);
        cursors.left.on('down', enableKeys);
        cursors.right.on('down', enableKeys);

        if (Phaser.Input.Keyboard.JustDown(keyK)) {
            player.anims.play('drill', true);
            keyJ.enabled = false;
            keyW.enabled = false;
            keyUP.enabled = false;
            keySpace.enabled = false;
        }

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
   
        didPressUp = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP));
        didPressW = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
        didPressSpace = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE));

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

    /**************************************************************************************************************************************************************************/
    shutdown() {this.timer.remove();}
    /**************************************************************************************************************************************************************************/

}