class Scene7 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene7' });
    }

    preload() { /*Assets to preload for the scene*/ }

    create() {

        this.scale.refresh(); this.cameras.main.fadeIn(500);

        scene = 7;

        sound_thunder.setVolume(0.95);

        if (sound_drill.isPlaying) {
            sound_drill.stop();
        }

        let { sceneBack } = this.scene.settings.data || { sceneBack: false };

        isMusicPlaying = false;
        this.sound.sounds.forEach(function(sound) { if (sound.key === 'level4Theme' && sound.isPlaying) { isMusicPlaying = true; } });
        if (!isMusicPlaying && !sceneBack) { sound_level4Theme.play(); }

        sound_rain.stop();
        sound_rain2.stop();
        if (sceneBack) {
            sound_rain.play();
            sound_rain.setVolume(0.15);
            setTimeout(() => { sound_rain2.play(); sound_rain2.setVolume(0.15)}, 5000);
        } else {
            sound_rain.play();
            sound_rain.setVolume(0.35);
            setTimeout(() => { sound_rain2.play(); sound_rain2.setVolume(0.35)}, 5000);
        }

        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        lasersWasp = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms);
        this.physics.add.collider(lasersWasp, platforms);
        this.physics.add.collider(lasers, platforms, function(laser) {laser.setVelocityX(0), laser.setAcceleration(0)});
        this.physics.add.collider(lasersWasp, platforms, function(laserWasp) {laserWasp.setVelocityX(0), laserWasp.setVelocityY(0), laserWasp.setAcceleration(0)});
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});
        this.physics.add.collider(bigLasers, platforms);

        if (sceneBack === true) {
            player = this.physics.add.sprite(900, 703, 'beecon_full').setScale(0.3).setDepth(0.19);
        } else {
            player = this.physics.add.sprite(110, -111, 'beecon_full').setScale(0.3).setDepth(0.19);
        }

        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        liveBG = this.add.image(player.x, 100, 'lifeBG').setScale(0.65).setDepth(10).setAlpha(0.9);
        liveWaspBG = this.add.image(player.x, 100, 'lifeWaspBG').setScale(0.65).setDepth(200).setAlpha(1);
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

        if (sceneBack === true) {
            wasp = this.physics.add.sprite(8000, 4000, 'wasp').setScale(0.75).setDepth(0.21);
            wasp.setAlpha(0);
        } else {
            wasp = this.physics.add.sprite(1400, 400, 'wasp').setScale(0.75).setDepth(0.21);
        }

        wasp.body.setSize(170, 250);
        wasp.body.setOffset(170, 290);
        wasp.setCollideWorldBounds(false);
        this.physics.add.collider(wasp, platforms);

        waspLives = 100;

        wasp.anims.play('waspChill');
        wasp.body.allowGravity = false;
        wasp.setImmovable(true);
        wasp.setVelocityX(0);
        wasp.setVelocityY(0);

        healthBar = this.add.graphics();
        healthBar.setDepth(99);

        selfs = this;
        waspFs = this.physics.add.group();
        beeconFs = this.physics.add.group();

        this.physics.add.overlap(player, lasersWasp, function(player) {
            if (!sound_beeconHit.isPlaying) { sound_beeconHit.play(); }
            damageTint = "0xff0000"; player.setTint(damageTint); startColor = Phaser.Display.Color.HexStringToColor(damageTint); endColor = Phaser.Display.Color.HexStringToColor("#ffffff");
            this.tweens.add({ targets: player, duration: 150, tint: startColor.color, 
                onUpdate: () => { player.setTint(startColor.color); }, onUpdateParams: [startColor], 
                onComplete: () => { player.setTint(endColor.color); } });
            decreaseLives();

            laserWasp.destroy();
            if (lives <= 0) { gameOver();
                if (language) {
                    randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                } else {
                    randomText = this.add.text(0, 0, 'PULSA INTRO PARA REINTENTAR, E PARA SALIR', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                }  
                randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(game.config.width / 2.35, player.y-150,);
                this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
                this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK);
                this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
                this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })}); }
        }, null, this);

        this.physics.add.collider(player, wasp, function(player) {
            if (!sound_beeconHit.isPlaying) { sound_beeconHit.play(); }
            damageTint = "0xff0000"; player.setTint(damageTint); startColor = Phaser.Display.Color.HexStringToColor(damageTint); endColor = Phaser.Display.Color.HexStringToColor("#ffffff");
            this.tweens.add({ targets: player, duration: 150, tint: startColor.color, 
                onUpdate: () => { player.setTint(startColor.color); }, onUpdateParams: [startColor], 
                onComplete: () => { player.setTint(endColor.color); } });
            decreaseLivesWasp();

            knockbackDirection = new Phaser.Math.Vector2(player.x - wasp.x, player.y - wasp.y).normalize().scale(knockbackForce);
            player.setVelocityY(knockbackDirection.y);
            player.setVelocityX(knockbackDirection.x);
            if (wasp.x > player.x) {
                this.tweens.add({
                  targets: wasp,
                  x: wasp.x + 300,
                  y: wasp.y - 200,
                  duration: 250,
                  ease: 'Linear'
                });
            } else {
                this.tweens.add({
                  targets: wasp,
                  x: wasp.x - 300,
                  y: wasp.y - 200,
                  duration: 250,
                  ease: 'Linear'
                });
            }
            
            if (lives <= 0) { gameOver();
                if (language) {
                    randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                } else {
                    randomText = this.add.text(0, 0, 'PULSA INTRO PARA REINTENTAR, E PARA SALIR', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                }  
                randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(game.config.width / 2.35, player.y-150,);
                this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
                this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK);
                this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
                this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })}); }
        }, null, this);
        this.physics.add.collider(lasers, wasp, function(wasp, laser) {
            waspLives--;
            sound_enemyF.play();
            wasp.setTint(0xff0000);
            setTimeout(function() { wasp.setTint(0xffffff); }, 200);
            if (waspLives <= 0) {
                wasp.alpha = 0;
                wasp.anims.stop();
                wasp.disableBody(true, true);
                let waspF = waspFs.create(wasp.x, wasp.y, 'waspF');
                if (player.x <= wasp.x) {
                    waspF.setOrigin(0.5, 0.5).setScale(0.75).setDepth(0.189);
                } else {
                    waspF.setOrigin(0.5, 0.5).setScale(0.75).setDepth(0.189).setFlipX(true);
                }
                waspF.body.setSize(50, 305);
                selfs.physics.add.collider(waspF, platforms);
                waspF.setBounce(0.2);
            }
            laser.setVelocity(0, 0);
        });
        this.physics.add.collider(bigLasers, wasp, function(wasp, bigLaser) {
            waspLives = waspLives - 5;
            sound_enemyF.play();
            wasp.setTint(0xff0000);
            setTimeout(function() { wasp.setTint(0xffffff); }, 200);
            if (waspLives <= 0) {
                wasp.alpha = 0;
                wasp.anims.stop();
                wasp.disableBody(true, true);
                let waspF = waspFs.create(wasp.x, wasp.y, 'waspF');
                if (player.x <= wasp.x) {
                    waspF.setOrigin(0.5, 0.5).setScale(0.75).setDepth(0.189);
                } else {
                    waspF.setOrigin(0.5, 0.5).setScale(0.75).setDepth(0.189).setFlipX(true);
                }
                waspF.body.setSize(50, 305);
                selfs.physics.add.collider(waspF, platforms);
                waspF.setBounce(0.2);
            }
            bigLaser.destroy();
        });

        gameOverImage = this.physics.add.staticGroup();

        self = this;
        this.physics.add.collider(player, platforms, function(player, platform) {
            if (player.anims.currentAnim.key === 'drill' && platform.texture.key === 'breakableBranch') {
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

        for (let i = 0; i <= 1; i++) {
            this.add.image(0, 1200 - (i*799), 'treeTexture').setScale(1).setScrollFactor(0.2).setDepth(0.1).setTint(Phaser.Display.Color.GetColor(100, 125, 150));
            this.add.image(799, 1200 - (i*799), 'treeTexture').setScale(1).setScrollFactor(0.2).setDepth(0.1).setTint(Phaser.Display.Color.GetColor(100, 125, 150));
            this.add.image(1598, 1200 - (i*799), 'treeTexture').setScale(1).setScrollFactor(0.2).setDepth(0.1).setTint(Phaser.Display.Color.GetColor(100, 125, 150));
        }

        clouds = this.physics.add.image(576, 94, 'clouds').setScrollFactor(0.13).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
        clouds2 = this.physics.add.image(1500, 271, 'clouds').setScrollFactor(0.15).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
        clouds3 = this.physics.add.image(803, 433, 'clouds').setScrollFactor(0.17).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

        for (let i = -1; i < 2; i++) {
            stuck = platforms.create(-170, 286 - (i*300), 'trunk').setScale(2).refreshBody().setDepth(0.5).setFlip(true);
            stuck.body.checkCollision.down = false; stuck.body.checkCollision.up = false;
            stuck = platforms.create(1104, 218 - (i*300), 'trunk').setScale(2).refreshBody().setDepth(0.189);
            stuck.body.checkCollision.down = true; stuck.body.checkCollision.up = true;
        }

        destroyed = platforms.create(1101, 800, 'trunk').setScale(2).refreshBody().setDepth(0.189).setAlpha(0);
        destroyed.body.checkCollision.down = false; destroyed.body.checkCollision.up = false;

        this.add.image(1069, 500, 'waspNest').setScale(1.5).setScrollFactor(1).setDepth(0.2);
        waspNestDoor = this.add.image(1069, 500, 'waspNestDoor').setScale(1.5).setScrollFactor(1).setDepth(0.2);
        this.add.image(1069, 500, 'waspNestUnder').setScale(1.5).setScrollFactor(1).setDepth(0.189);

        for (let i = -1; i < 10; i++) {leavesBG = this.add.image(i * 150, -800, 'leavesBG').setScrollFactor(1).setDepth(0.99).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            this.tweens.add({targets: leavesBG, angle: { getStart: () => 166, getEnd: () => 164, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
            this.tweens.add({targets: leavesBG, y: { getStart: () => -801, getEnd: () => -799, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
        for (let i = -1; i < 10; i++) {leavesBG = this.add.image(i * 150, -500, 'leavesBG').setScrollFactor(1).setDepth(0.99).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            this.tweens.add({targets: leavesBG, angle: { getStart: () => 166, getEnd: () => 164, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
            this.tweens.add({targets: leavesBG, y: { getStart: () => -501, getEnd: () => -499, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
        for (let i = -1; i < 10; i++) {leavesBG = this.add.image(i * 150, -200, 'leavesBG').setScrollFactor(1).setDepth(0.99).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            this.tweens.add({targets: leavesBG, angle: { getStart: () => 166, getEnd: () => 164, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
            this.tweens.add({targets: leavesBG, y: { getStart: () => -201, getEnd: () => -199, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}

        for (let i = 0.2; i < 3; i++) {
            platforms.create(i * 512, 860, 'treeFloor').setScale(1).refreshBody().setDepth(0.2);
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

        overlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.widt*2, this.cameras.main.height*10, 0x000000, 0.25).setDepth(1);

        this.lastWalkSoundTime = 0;

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

        if (sceneBack) {

            emitter = this.add.particles(0, 0, 'rain',{
                x: 0,
                y: -100,
                quantity: 10,
                lifespan: 1600,
                speedY: { min: 700, max: 900 },
                speedX: { min: -5, max: 5 },
                scale: { start: 0.1, end: 0.5 },
                rotate: { start: 0, end: 0 },
                frequency: 5,
                emitZone: { source: new Phaser.Geom.Rectangle(0, 0, this.game.config.width*2, 1) },
                on: true
            });

            emitter.setScrollFactor(0).setDepth(-0.11);

        } else {

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

        fadeOutTriggered = false;

        platforms.create(-55, 430, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(-30, 500, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(-5, 570, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(25, 640, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(975, 430, 'waspNestBranch').setScale(0.8).refreshBody().setDepth(0.18);
        platforms.create(950, 500, 'waspNestBranch').setScale(0.8).refreshBody().setDepth(0.18);
        platforms.create(925, 570, 'waspNestBranch').setScale(0.8).refreshBody().setDepth(0.18);
        platforms.create(900, 640, 'waspNestBranch').setScale(0.8).refreshBody().setDepth(0.18);

        healthBar.visible = false;
        liveWaspBG.setAlpha(0);

        this.time.addEvent({
            delay: 2750,
            callback: shootLaserWasp,
            callbackScope: this,
            loop: true
        });

    }

    update() {

        if (waspLives <= 0) {
            sound_level4Theme.stop();
        }

        if (player.body.velocity.y > 1000) {
            player.body.setBounce(0.2);
          } else {
            player.body.setBounce(0);
        }

        if (player.x > 1250 && !fadeOutTriggered) {
            player.setAlpha(0);
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene8', { sceneBack: false });
            });
            fadeOutTriggered = true;
        }

        if (!game.scene.isPaused() && pauseOverlay && pauseText) {
            this.sound.resumeAll();
            this.sound.mute = false;
            pauseOverlay.destroy();
            pauseText.destroy();
        }

        camera.scrollX = -100;

        if (player.y <= 703) {
            camera.scrollY = player.y - 505;

            liveBG.x = 3;
            liveBG.y = player.y-472;
    
            livesText.x = -78;
            livesText.y = player.y-483;

            liveWaspBG.x = 890;
            liveWaspBG.y = player.y-472;

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

        lasersWasp.getChildren().forEach(laserWasp => {
            if (this.physics.overlap(laserWasp, airPlatform) || laserWasp.body.velocity.x === 0 || laserWasp.body.velocity.y === 0) {
                sound_laserHit.play();
                laserWasp.destroy();
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

        updateWaspBehavior(wasp);

        if (player.y <= 703) {
            healthBar.clear();
            healthBar.fillStyle(0x333333, 1);
            healthBar.fillRect(game.config.width / 1.93, -18, 490, 30);
            var remainingHealth = waspLives / 100;
            healthBar.fillStyle(0xffff00, 1);
            healthBar.fillRect(game.config.width / 1.93, -18, remainingHealth * 490, 30);
            healthBar.x = 3;
            healthBar.y = player.y - 472;
        }

        if (wasp.alpha === 0) {
            healthBar.visible = false;
            waspNestDoor.visible = false;
            liveWaspBG.setAlpha(0);
            destroyed.destroy();
            return;
        }

        if (player.x <= wasp.x) {
            wasp.body.setOffset(170, 290);
        } else {
            wasp.body.setOffset(260, 290);
        }

    }

    shutdown() {this.timer.remove();}

}