class Scene5 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene5' });
    }

    preload() { //Assets to preload for the scene
    }

    create() {

        this.scale.refresh(); this.cameras.main.fadeIn(500);

        scene = 5;

        if (sound_drill.isPlaying) {
            sound_drill.stop();
        }

        sound_titleTheme.stop();

        sound_rain.play();
        sound_rain.setVolume(0.15);
        setTimeout(() => { sound_rain2.play(); sound_rain2.setVolume(0.15)}, 5000);

        isMusicPlaying = false;
        this.sound.sounds.forEach(function(sound) { if (sound.key === 'levelTheme' && sound.isPlaying) { isMusicPlaying = true; } });
        if (!isMusicPlaying) { sound_levelTheme.play(); }

        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms);
        this.physics.add.collider(lasers, platforms, function(laser) {laser.setVelocityX(0), laser.setAcceleration(0)});
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});
        this.physics.add.collider(bigLasers, platforms);
        this.add.image(1700, 1303, 'ground').setScale(5).setDepth(0);
        triggerPlatform = this.physics.add.group({ immovable: true, allowGravity: false });
        triggerPlatformBack = this.physics.add.group({ immovable: true, allowGravity: false });
        triggerPlatformDeath = this.physics.add.group({ immovable: true, allowGravity: false });
        player = this.physics.add.sprite(100, 603, 'beecon_full').setScale(0.3).setDepth(0.19);
        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        liveBG = this.add.image(player.x, 100, 'lifeBG').setScale(0.65).setDepth(10).setAlpha(0.9);
        livesText = this.add.text(player.x, 19, 'Energy: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#000000' }).setDepth(10); //, fontStyle: 'bold'

        enemyGroup = this.add.group();
        for (let i = 1; i < 4; i++) {
          enemy = this.physics.add.sprite(300, 0 - i * 300, 'enemy').setScale(0.25).setDepth(0.19);
          enemy.body.setSize(280, 220);
          enemy.body.setOffset(30, 60);
          enemy.setCollideWorldBounds(false);
          this.physics.add.collider(enemy, platforms);
          enemyGroup.add(enemy);
        }

        enemyGroup.children.iterate((enemy) => {
            enemy.enemyLives = 3;
        });

        jumpshrooms = this.physics.add.group({ immovable: true, allowGravity: false });
        jumpshrooms.create(2000, 680, 'jumpshrooms').setScale(0.3).refreshBody().setDepth(0.2);
        jumpshrooms.create(2350, 680, 'jumpshrooms').setScale(0.3).refreshBody().setDepth(0.2);
        jumpshrooms.create(2700, 680, 'jumpshrooms').setScale(0.3).refreshBody().setDepth(0.2);

        this.physics.add.collider(player, jumpshrooms, function (player, jumpshrooms) {
            if (player.body.bottom <= jumpshrooms.body.top) {
                // Player is on top of the jumpshroom
                sound_mushroomJump.play();
                player.setVelocityY(-500); //player.setVelocityY(-800);
                //jumpshrooms.flipX = !jumpshrooms.flipX;
                jumpshrooms.setScale(0.31);
                setTimeout(() => {
                    jumpshrooms.setScale(0.3);
                }, 100);
            }
        });

        gameOverImage = this.physics.add.staticGroup();

        enemyGroup.getChildren().forEach(enemy => {
        this.physics.add.collider(player, enemy, function(player) {
            if (!sound_beeconHit.isPlaying) { sound_beeconHit.play(); }
            damageTint = "0xff0000"; player.setTint(damageTint); startColor = Phaser.Display.Color.HexStringToColor(damageTint); endColor = Phaser.Display.Color.HexStringToColor("#ffffff");
            this.tweens.add({ targets: player, duration: 150, tint: startColor.color, 
                onUpdate: () => { player.setTint(startColor.color); }, onUpdateParams: [startColor], 
                onComplete: () => { player.setTint(endColor.color); } });
            decreaseLives();

            knockbackDirection = new Phaser.Math.Vector2(player.x - enemy.x, player.y - enemy.y).normalize().scale(knockbackForce);
            player.setVelocityY(knockbackDirection.y);
            player.setVelocityX(knockbackDirection.x);

            if (lives <= 0) { gameOver();
                randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(game.config.width / 2.35, player.y-150,);
                this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
                this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
                this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene)});
                this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title')}); }
            }, null, this);
            this.physics.add.collider(lasers, enemy, function(enemy, laser) {
                if (enemy.anims.currentAnim.key !== 'enemyEnraged') {
                    enemy.enemyLives--;
                    sound_enemyF.play();
                    enemy.setTint(0xff0000);
                    setTimeout(function() { enemy.setTint(0xffffff); }, 200);
                    if (enemy.enemyLives <= 0) {
                    enemy.alpha = 0;
                    enemy.anims.stop();
                    enemy.disableBody(true, true);
                    }
                }
                laser.setVelocity(0, 0);
            });
        this.physics.add.overlap(bigLasers, enemy, function(enemy, bigLasers) {
            if (bigLasers.body.velocity.x === 0) {return;} sound_enemyF.play(); enemy.alpha = 0; enemy.anims.stop(); enemy.disableBody(true, true); });
        });
        this.physics.add.overlap(player, triggerPlatformDeath, () => {
            lives = 0;
            updateLivesUI();
            gameOver();
            randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
            randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
            this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
            this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
            this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene)});
            this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title')});
        });

        this.physics.add.overlap(player, triggerPlatformBack, () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene4');
            });
        });
        this.physics.add.overlap(player, triggerPlatform, () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Ending');
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

        this.physics.add.overlap(player, triggerPlatformBack, function(player) {player.setAlpha(0)});
        this.physics.add.collider(player, triggerPlatform, function(player) {player.setAlpha(0)});

        for (let i = 0; i < 3; i++) {this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1).setDepth(-1);}
        for (let i = 0; i < 8; i++) {this.add.image(i * 800, 500, 'skyOverlay').setScrollFactor(0.1).setScale(2).setAlpha(1).setDepth(-1).setTint(Phaser.Display.Color.GetColor(100, 125, 250));}

        for (let i = 0; i <= 40; i++) {
            this.add.image(0, 1200 - (i*799), 'treeTexture').setScale(1).setScrollFactor(0.2).setDepth(0.1).setTint(Phaser.Display.Color.GetColor(100, 125, 150));
            this.add.image(799, 1200 - (i*799), 'treeTexture').setScale(1).setScrollFactor(0.2).setDepth(0.1).setTint(Phaser.Display.Color.GetColor(100, 125, 150));
            this.add.image(-405, 50 - (i*799), 'treeTexture').setScale(1).setScrollFactor(1).setDepth(3);
            this.add.image(1500, 236 - (i*799), 'treeTexture').setScale(1).setScrollFactor(1).setDepth(3);
        }

        clouds = this.physics.add.image(576, 94, 'clouds').setScrollFactor(0.13).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
        clouds2 = this.physics.add.image(1500, 271, 'clouds').setScrollFactor(0.15).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
        clouds3 = this.physics.add.image(803, 433, 'clouds').setScrollFactor(0.17).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

        for (let i = 0; i <= 4; i++) {this.add.image(i * 1200, 450, 'mountains').setScale(1.5).setScrollFactor(0.2).setDepth(-0.8).setTint(Phaser.Display.Color.GetColor(125, 100, 150));}

        for (let i = 0; i < 10; i++) {
            platforms.create(-300, 0 - (i*300), 'wall').setScale(1.5).refreshBody().setDepth(0.2);
            platforms.create(1400, 400 - (i*300), 'wall').setScale(1.5).refreshBody().setDepth(0.2).setFlip(true);
        }

        /******************************************************************************************************************************/
        /******************************************************************************************************************************/
        /******************************************************************************************************************************/
        platforms.create(1030, 600, 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));
        platforms.create(910, 420, 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));
        for (let i = 0.48; i <= 6; i++) {platforms.create(i * 120, 300, 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        for (let i = 1.48; i <= 6; i++) {platforms.create(240, 200 - (i * 120), 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        for (let i = 2.48; i <= 9; i++) {platforms.create(i * 120, -180, 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        for (let i = 2.48; i <= 5; i++) {platforms.create(i * 120, -480, 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        for (let i = 5.48; i <= 6; i++) {platforms.create(i * 120, -480, 'breakableGround').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        for (let i = 1.48; i <= 6; i++) {platforms.create(770, -250 - (i * 120), 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        for (let i = 0.48; i <= 7; i++) {platforms.create(i * 120, -800, 'platform').setScale(0.8).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(125, 100, 250));}
        /******************************************************************************************************************************/
        /******************************************************************************************************************************/
        /******************************************************************************************************************************/

        for (let i = 0.2; i < 4; i++) {
            platforms.create(i * 512, 760, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 20; i < 30; i++) {
            triggerPlatform.create(i * 150, -150, 'platform').setScale(1).setAlpha(1).setDepth(0.3);
        }

        for (let i = -4; i < 10; i++) {
            triggerPlatformBack.create(i * 150, 750, 'platform').setScale(1).setAlpha(0).setDepth(0.3);
        }

        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        cursors = this.input.keyboard.createCursorKeys();

        camera = this.cameras.main;
        camera.scrollX = game.config.width * 2;
        camera.scrollY = 0;

        chargeReady = this.add.sprite(player.x, player.y, 'chargeReady').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);

        overlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.widt*2, this.cameras.main.height*10, 0x000000, 0.25).setDepth(1);

        this.lastWalkSoundTime = 0;

        this.input.keyboard.on('keydown-P', function () {
            pauseOverlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width*4, this.cameras.main.height*8, 0x000000, 0.25).setDepth(1);
            pauseText = this.add.text(0, 0, 'PAUSE', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
            pauseText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(game.config.width / 2.35, player.y-200);
            this.sound.pauseAll();
            this.sound.mute = true;
            game.scene.pause('Scene'+scene);
            game.scene.stop('Pause');
            game.scene.start('Pause');
        }, this);

        enemyGroup.getChildren().forEach(enemy => {
            enemy.anims.play('enemyChill');
            enemy.setVelocityX(100);
        });

        emitter = this.add.particles(0, 0, 'rain',{
            x: 0,
            y: -100,
            quantity: 40,
            lifespan: 1600,
            speedY: { min: 700, max: 900 },
            speedX: { min: -1000, max: -950 },
            scale: { start: 0.25, end: 0.5 },
            rotate: { start: 40, end: 40 },
            frequency: 5,
            //blendMode: 'ADD',
            //angle: { min: 0, max: 0 },
            emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width*2, 1) },
            on: true
        });
      
        emitter.setScrollFactor(0).setDepth(-0.11);

        delayLightningFirt = Phaser.Math.RND.integerInRange(5000, 10000);
        console.log(delayLightningFirt);
        this.time.addEvent({
            delay: delayLightningFirt,
            callback: createOverlay,
            callbackScope: this,
        });

    }

    update() {

        if (!game.scene.isPaused() && pauseOverlay && pauseText) {
            this.sound.resumeAll();
            this.sound.mute = false;
            pauseOverlay.destroy();
            pauseText.destroy();
        }

        camera.scrollX = -100;

        if (player.y <= 603) {
            camera.scrollY = player.y - 505; //605

            liveBG.x = 3;
            liveBG.y = player.y-472; //572
    
            livesText.x = -78;
            livesText.y = player.y-483; //583
        }

        if (clouds) {this.physics.world.wrap(clouds.body, clouds.width+50, true);}
        if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width+50, true);}
        if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width+50, true);}     

        enemyGroup.getChildren().forEach(enemy => {
            updateEnemyBehavior(enemy);
        });

        keyA.on('down', enableKeys);
        keyD.on('down', enableKeys);
        cursors.left.on('down', enableKeys);
        cursors.right.on('down', enableKeys);

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

        chargeReady.setPosition(player.x, player.y-50);

        lasers.getChildren().forEach(laser => {
            if (this.physics.overlap(laser, airPlatform) || laser.body.velocity.x === 0) {
                sound_laserHit.play();
                laser.destroy();
              }
        });
    
        if (cursors.left.isDown || keyA.isDown) {
            player.setVelocityX(-250);
            if (player.anims.currentAnim.key === 'jumpBack') {
                player.anims.play('jumpBack', true);
            } else {
                player.anims.play('left', true);   
            }    
        } else if (cursors.right.isDown || keyD.isDown) {
            player.setVelocityX(250);
            if (player.anims.currentAnim.key === 'jump') {
                player.anims.play('jump', true);
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

        if (player.body.onFloor()) {
            hasJumped = false;
        }

        if (didPressUp || didPressW || didPressSpace) {
            if (player.body.onFloor()) {
                //console.log("1")
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }   
                canDoubleJump = true;
                player.setVelocityY(-380);
            } else if (canDoubleJump) {
                //console.log("2")
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }
                hasJumped = true;
                canDoubleJump = false;
                player.setVelocityY(-350);
            } else if ((!player.body.onFloor()) && (hasJumped === false)) {
                //console.log("3")
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }   
                hasJumped = true;
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

    shutdown() {this.timer.remove();}

}