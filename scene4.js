class Scene4 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene4' });
    }

    preload() { /*Assets to preload for the scene*/ }

    create() {

        this.scale.refresh();

        scene = 4;

        honeyBeam = true;

        sound_thunder.setVolume(0.95);

        overlay = this.add.rectangle(-1000, 0, this.game.config.width*3.5, this.game.config.height*2, 0x000000).setOrigin(0).setDepth(1002);

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

        sound_level2Theme.stop();
        sound_level3Theme.stop();

        sound_rain.stop();
        sound_rain2.stop();
        sound_rain.play();
        sound_rain.setVolume(0.75);
        setTimeout(() => { sound_rain2.play(); sound_rain2.setVolume(0.75)}, 5000);

        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms);
        this.physics.add.collider(lasers, platforms, function(laser) {laser.setVelocityX(0), laser.setAcceleration(0)});
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});
        this.physics.add.collider(bigLasers, platforms);
        this.add.image(1700, 1303, 'ground').setScale(5).setDepth(0);

        self = this;
        beeconFs = this.physics.add.group();

        let { sceneBack } = this.scene.settings.data || { sceneBack: false };

        if (sceneBack === true) {
            player = this.physics.add.sprite(1700, 598, 'beecon_full').setScale(0.3).setDepth(0.19);
        } else {
            player = this.physics.add.sprite(0, 598, 'beecon_full').setScale(0.3).setDepth(0.19);
        }

        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        liveBG = this.add.image(player.x, 100, 'lifeBG').setScale(0.65).setDepth(10).setAlpha(0.9);
        if (language) {
            livesText = this.add.text(player.x, 19, 'Energy: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#000000' }).setDepth(10);
        } else {
            livesText = this.add.text(player.x, 19, 'Energía: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#000000' }).setDepth(10);
        }

        if (sceneBack) {
            player.anims.play('idleBack');
        } else {
            player.anims.play('idle');
        }

        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);

        this.physics.add.collider(player, platforms, function(player, platform) {
            if (player.anims.currentAnim.key === 'drill' && platform.texture.key === 'breakableGround') {
                timer++;
                if (timer >= 50) {
                    platform.destroy();
                }
            }
        });
        this.physics.add.collider(bigLasers, bigLasers);
        this.physics.add.collider(bigLasers, bigLasers, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});

        for (let i = 0; i < 3; i++) {this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1).setDepth(-1);}
        for (let i = 0; i < 8; i++) {this.add.image(i * 800, 500, 'skyOverlay').setScrollFactor(0.1).setScale(2).setAlpha(1).setDepth(-1).setTint(Phaser.Display.Color.GetColor(100, 125, 250));}

        clouds = this.physics.add.image(576, 94, 'clouds').setScrollFactor(0.13).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
        clouds2 = this.physics.add.image(1500, 271, 'clouds').setScrollFactor(0.15).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
        clouds3 = this.physics.add.image(803, 433, 'clouds').setScrollFactor(0.17).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

        for (let i = 0; i <= 4; i++) {this.add.image(i * 1200, 450, 'mountains').setScale(1.5).setScrollFactor(0.2).setDepth(-0.8).setTint(Phaser.Display.Color.GetColor(125, 100, 150));}

        platforms.create(-500, 400, 'wall').setScale(1).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(200, 200, 200));

        for (let i = 0.3; i < 4.3; i++) {platforms.create(i * 512, 755, 'ground').setScale(1).refreshBody().setDepth(0.2);}
        for (let i = 0; i < 6; i++) {platforms.create(2270, 670 - (i*120), 'platform').setScale(0.8).refreshBody().setDepth(2).setAlpha(0);}
        for (let i = 0; i < 6; i++) {platforms.create(1870, 470 - (i*120), 'platform').setScale(0.8).refreshBody().setDepth(2).setAlpha(0);}

        this.add.image(-370, 185, 'tree').setScale(0.55).setDepth(-0.2).setScrollFactor(1).setAlpha(1).setTint(Phaser.Display.Color.GetColor(200, 200, 200));
        this.add.image(937.5, 470, 'tree').setScale(0.65).setDepth(-0.2).setScrollFactor(0.8).setTint(Phaser.Display.Color.GetColor(180, 180, 180));
        this.add.image(2050, -188, 'megaTree').setScale(1.75).setDepth(0.189).setScrollFactor(1).setAlpha(1).setTint(Phaser.Display.Color.GetColor(180, 130, 180));
        this.add.image(2050, -188, 'megaTreeCover').setScale(1.75).setDepth(0.21).setScrollFactor(1).setAlpha(1).setTint(Phaser.Display.Color.GetColor(180, 130, 180));

        for (let i = -2; i < 16; i++) {this.add.image(i * 233.4, 650, 'grass').setScale(0.3).setDepth(-0.2).setScrollFactor(0.9).setTint(Phaser.Display.Color.GetColor(230, 230, 230));}
        for (let i = -2; i < 16; i++) {this.add.image(i * 311.2, 730, 'grass').setScale(0.4).setDepth(0.3).setScrollFactor(1.1).setTint(Phaser.Display.Color.GetColor(50, 50, 50)).setAlpha(1);}

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

        cursors = this.input.keyboard.createCursorKeys();

        camera = this.cameras.main;
        camera.scrollX = game.config.width * 2;
        camera.scrollY = 0;

        if (language) {
            chargeReady = this.add.sprite(player.x, player.y, 'chargeReady').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);
        } else {
            chargeReady = this.add.sprite(player.x, player.y, 'chargeReadySpanish').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);
        }

        emitter = this.add.particles(0, 0, 'rain',{
            x: 0,
            y: -100,
            quantity: 40,
            lifespan: 1600,
            speedY: { min: 700, max: 900 },
            speedX: { min: -1000, max: -950 },
            scale: { start: 0.1, end: 0.5 },
            rotate: { start: 40, end: 40 },
            frequency: 5,
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width*3.5, 1) },
            on: true
        });
      
        emitter.setScrollFactor(0.5).setDepth(0.29);

        this.lastWalkSoundTime = 0;

        delayLightningFirt = Phaser.Math.RND.integerInRange(5000, 10000);
        console.log(delayLightningFirt);
        this.time.addEvent({
            delay: delayLightningFirt,
            callback: createOverlay,
            callbackScope: this,
        });

        this.input.keyboard.on('keydown-P', function () {
            camera = this.cameras.main;
            screenWidth = camera.width;
            screenHeight = camera.height;
            screenCenterX = camera.scrollX + screenWidth / 2;
            screenCenterY = camera.scrollY + screenHeight / 2;
            pauseOverlay = this.add.rectangle(screenCenterX, screenCenterY, screenWidth, screenHeight, 0x000000, 0.25).setDepth(1);
            pauseText = this.add.text(screenCenterX, screenCenterY, 'PAUSE', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);
            pauseText.setShadow(2, 2, '#000000', 2).setDepth(3);
            this.sound.pauseAll();
            this.sound.mute = true;
            game.scene.pause('Scene' + scene);
            game.scene.stop('Pause');
            game.scene.start('Pause');
        }, this);

        fadeOutTriggered = false;
    
    }

    update() {

        if (player.body.velocity.y > 1000) {
            player.body.setBounce(0.2);
          } else {
            player.body.setBounce(0);
        }

        if (player.x < 1000 && player.y > 790 && !fadeOutTriggered) {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene3', { sceneBack: true });
            });
            fadeOutTriggered = true;
        }

        if (player.x >= 1000 && player.y > 790 && !fadeOutTriggered) {
                this.cameras.main.fadeOut(500);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Scene5', { sceneBack: false });
                });
            fadeOutTriggered = true;
        }

        if (!game.scene.isPaused() && pauseOverlay && pauseText) {
            this.sound.resumeAll();
            this.sound.mute = false;
            pauseOverlay.destroy();
            pauseText.destroy();
        }

        if (player.x > 1300) {
            camera.scrollX = 975;
            liveBG.x = 1075;
            liveBG.y = 30;
            livesText.x = 995;
            livesText.y = 19;
        } else {
            camera.scrollX = player.x - game.config.width / 4;
            liveBG.x = player.x+100 - game.config.width / 4;
            liveBG.y = 30;
            livesText.x = player.x+20 - game.config.width / 4;
            livesText.y = 19;
        }

        if (clouds) {this.physics.world.wrap(clouds.body, clouds.width+50, true);}
        if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width+50, true);}
        if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width+50, true);}

        keyA.on('down', enableKeys);
        keyD.on('down', enableKeys);
        cursors.left.on('down', enableKeys);
        cursors.right.on('down', enableKeys);
        keyL.on('down', enableKeys);

        if (Phaser.Input.Keyboard.JustDown(keyK) && player.body.velocity.x ===0) {
            sound_drill.play();
            sound_drill.loop = true;
            player.anims.play('drill', true);
            keyJ.enabled = false;
            keyW.enabled = false;
            keyUP.enabled = false;
            keySpace.enabled = false;
        }

        if (player.body.velocity.x !==0) {
            sound_drill.stop();
        }

        if (player.body.velocity.x !==0 && player.body.onFloor()) {
            if (this.time.now - this.lastWalkSoundTime > 100) {
                sound_beeconWalk.play();
                this.lastWalkSoundTime = this.time.now;
            }
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

        if (player.alpha === 0) {
            chargeReady.setVisible(false);
        }

        chargeReady.setPosition(player.x, player.y-50);

        lasers.getChildren().forEach(laser => {
            if (this.physics.overlap(laser, airPlatform) || laser.body.velocity.x === 0) {
                sound_laserHit.play();
                laser.destroy();
              }
        });

        bigLasers.getChildren().forEach(bigLaser => {
            if (this.physics.overlap(bigLaser, airPlatform)) {
                bigLaser.destroy();
              }
        });
    
        if (cursors.left.isDown || keyA.isDown) {
            player.setVelocityX(-250);
            if (player.anims.currentAnim.key === 'jumpBack') {
                player.anims.play('jumpBack', true);
            } else if (!player.body.onFloor() && keyL.isDown) {
                player.anims.play('glideBack', true);   
            } else if (!player.body.onFloor() && !keyL.isDown) {
                player.anims.play('fallBack', true);
            } else {
                player.anims.play('left', true);
            }
        } else if (cursors.right.isDown || keyD.isDown) {
            player.setVelocityX(250);
            if (player.anims.currentAnim.key === 'jump') {
                player.anims.play('jump', true);
            } else if (!player.body.onFloor()&& keyL.isDown) {
                player.anims.play('glide', true);   
            } else if (!player.body.onFloor() && !keyL.isDown) {
                player.anims.play('fall', true);
            } else {
                player.anims.play('right', true);
            }      
        } else {
            player.setVelocityX(0);
            if (player.anims.currentAnim === null || player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'glide' || player.anims.currentAnim.key === 'fall') {
                player.anims.play('idle', true);
            } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'glideBack' || player.anims.currentAnim.key === 'fallBack') {
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

        if (player.body.onFloor()) {
            hasJumped = false;
        }

        if (didPressUp || didPressW || didPressSpace) {
            if (player.body.onFloor()) {
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }   
                canDoubleJump = true;
                player.setVelocityY(-380);
                this.physics.world.gravity.y = 600;
                this.tweens.add({ targets: this.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
            } else if (canDoubleJump) {
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump' || player.anims.currentAnim.key === 'fall' || player.anims.currentAnim.key === 'glide') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack' || player.anims.currentAnim.key === 'fallBack' || player.anims.currentAnim.key === 'glideBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }
                hasJumped = true;
                canDoubleJump = false;
                player.setVelocityY(-350);
                this.physics.world.gravity.y = 600;
                this.tweens.add({ targets: this.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
            } else if ((!player.body.onFloor()) && (hasJumped === false)) {
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump' || player.anims.currentAnim.key === 'fall' || player.anims.currentAnim.key === 'glide') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack' || player.anims.currentAnim.key === 'fallBack' || player.anims.currentAnim.key === 'glideBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }   
                hasJumped = true;
                player.setVelocityY(-350);
                this.physics.world.gravity.y = 600;
                this.tweens.add({ targets: this.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
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

        if ((player.anims.currentAnim.key !== 'drill') || (!player.body.onFloor())) {
            timer = 0;
        }

        if (!player.body.onFloor() && keyL.isDown && ((cursors.left.isDown || keyA.isDown) || (cursors.right.isDown || keyD.isDown))) {
            if (player.body.velocity.y >= 0) {
                player.body.gravity.y = 100;
                if (cursors.left.isDown || keyA.isDown) {
                    player.body.velocity.y = 30;
                    player.body.velocity.x = -400;
                } else if (cursors.right.isDown || keyD.isDown) {
                    player.body.velocity.y = 30;
                    player.body.velocity.x = 400;
                } else {
                    player.body.velocity.y = 30;
                }
            }
        } else {
            player.body.gravity.y = 0;
        }

    }

    shutdown() {this.timer.remove();}

    resume() {
        this.overlay.setVisible(false);
    }

}