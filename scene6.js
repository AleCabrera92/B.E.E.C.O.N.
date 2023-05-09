class Scene6 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene6' });
    }

    preload() { //Assets to preload for the scene
    }

    create() {

        this.scale.refresh(); this.cameras.main.fadeIn(500);

        scene = 6;

        sound_thunder.setVolume(0.95);

        if (sound_drill.isPlaying) {
            sound_drill.stop();
        }

        sound_level3Theme.stop();
        sound_level4Theme.stop();

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
        // triggerPlatform = this.physics.add.group({ immovable: true, allowGravity: false });
        // triggerPlatformBack = this.physics.add.group({ immovable: true, allowGravity: false });
        // triggerPlatformDeath = this.physics.add.group({ immovable: true, allowGravity: false });

        beeconFs = this.physics.add.group();

        player = this.physics.add.sprite(1000, 603, 'beecon_full').setScale(0.3).setDepth(0.19);

        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        liveBG = this.add.image(player.x, 100, 'lifeBG').setScale(0.65).setDepth(10).setAlpha(0.9);
        livesText = this.add.text(player.x, 19, 'Energy: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#000000' }).setDepth(10); //, fontStyle: 'bold'

        gameOverImage = this.physics.add.staticGroup();

        // this.physics.add.overlap(player, triggerPlatformDeath, () => {
        //     lives = 0;
        //     updateLivesUI();
        //     gameOver();
        //     randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
        //     randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(game.config.width / 2.35, player.y-530,);
        //     this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
        //     this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
        //     this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
        //     this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })});
        // });

        // this.physics.add.overlap(player, triggerPlatformBack, () => {
        //     this.cameras.main.fadeOut(500);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('Scene5', { sceneBack: true });
        //     });
        // });
        // this.physics.add.overlap(player, triggerPlatform, () => {
        //     player.setAlpha(0);
        //     player.y = player.y + 1;
        //     this.cameras.main.fadeOut(500);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('Scene7', { sceneBack: false });
        //     });
        // });
        self = this;
        this.physics.add.collider(player, platforms, function(player, platform) {
            if (player.anims.currentAnim.key === 'drill' && platform.texture.key === 'breakableBranch') {
                timer++;
                //console.log(timer);
                if (timer >= 50) {
                    platform.destroy();
                }
            }
        });
        this.physics.add.collider(bigLasers, bigLasers);
        this.physics.add.collider(bigLasers, bigLasers, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});

        //this.physics.add.overlap(player, triggerPlatformBack, function(player) {player.setAlpha(0)});
        //this.physics.add.overlap(player, triggerPlatform, function(player) {player.setAlpha(0)});

        for (let i = 0; i < 3; i++) {this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1).setDepth(-1);}
        for (let i = 0; i < 8; i++) {this.add.image(i * 800, 500, 'skyOverlay').setScrollFactor(0.1).setScale(2).setAlpha(1).setDepth(-1).setTint(Phaser.Display.Color.GetColor(100, 125, 250));}

        clouds = this.physics.add.image(576, 94, 'clouds').setScrollFactor(0.13).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
        clouds2 = this.physics.add.image(1500, 271, 'clouds').setScrollFactor(0.15).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
        clouds3 = this.physics.add.image(803, 433, 'clouds').setScrollFactor(0.17).setDepth(-0.9).setGravity(false).setAlpha(0.75);
        clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

        for (let i = -1; i < 4; i++) {
            platforms.create(1250, -20 - (i*300), 'trunk').setScale(2).refreshBody().setDepth(0.5);
        }
        platforms.create(1250, 784, 'trunk').setScale(2).refreshBody().setDepth(0.5);

        for (let i = 1; i < 10; i++) {leavesBG = this.add.image(i * 150, i * 50 + 300, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
            this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + 301, getEnd: () => i * 50 + 299, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
        for (let i = 0; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + 0, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==0) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + 1, getEnd: () => i * 50 + -9, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 0; i < 10; i++) {leavesBG = this.add.image(i * 150, i * 50 + -300, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==0) {        
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -301, getEnd: () => i * 50 + -299, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 0; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + -300, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==0) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -301, getEnd: () => i * 50 + -299, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 0; i < 10; i++) {leavesBG = this.add.image(i * 150, i * 50 + -600, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==0) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -601, getEnd: () => i * 50 + -599, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 1; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + -900, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==1) {        
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -901, getEnd: () => i * 50 + -899, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }    
        for (let i = 2; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + -1200, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==2) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -1201, getEnd: () => i * 50 + -1199, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 3; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + -1500, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==3) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -1501, getEnd: () => i * 50 + -1499, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 4; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + -1800, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==4) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -1801, getEnd: () => i * 50 + -1799, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }
        for (let i = 5; i < 10; i++) {leavesBG = this.add.image(-50 + i * 150, i * 50 + -2100, 'leavesBG').setScrollFactor(1).setDepth(0.18).setAngle(-135).setScale(1).setTint(Phaser.Display.Color.GetColor(150, 150, 250));
            if (i==5) {    
                this.tweens.add({targets: leavesBG, angle: { getStart: () => -89, getEnd: () => -91, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });
                this.tweens.add({targets: leavesBG, y: { getStart: () => i * 50 + -2101, getEnd: () => i * 50 + -2099, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 }, duration: 150 });}
            }

        /******************************************************************************************************************************/
        /******************************************************************************************************************************/
        /******************************************************************************************************************************/
        platforms.create(770, 575, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(520, 485, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(770, 395, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1020, 305, 'branch').setScale(0.8).refreshBody().setDepth(0.2); platforms.create(1140, 305, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(770, 215, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(520, 125, 'branch').setScale(0.8).refreshBody().setDepth(0.2); 
        platforms.create(270, 35, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(520, -55, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(770, -145, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1020, -235, 'branch').setScale(0.8).refreshBody().setDepth(0.2); platforms.create(1140, -235, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(770, -325, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(520, -415, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(270, -505, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(0, -595, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(270, -685, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(520, -775, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(770, -865, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1020, -955, 'branch').setScale(0.8).refreshBody().setDepth(0.2); platforms.create(1140, -955, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        /******************************************************************************************************************************/
        /******************************************************************************************************************************/
        /******************************************************************************************************************************/

        for (let i = 8; i < 12; i++) {
            platforms.create(50 + i * 120, 665, 'branch').setScale(0.8).refreshBody().setDepth(0.2);
        }

        // for (let i = 8; i < 22; i++) {
        //     triggerPlatform.create(i * 150, -900, 'platform').setScale(1).setAlpha(0).setDepth(0.3);
        //     //platforms.create(i * 150, -890, 'platform').setScale(1).setAlpha(0).setDepth(0.3);
        // }

        // for (let i = 4; i < 22; i++) {
        //      triggerPlatformBack.create(i * 150, 1100, 'platform').setScale(1).setAlpha(0).setDepth(0.3);
        // }

        // for (let i = 0; i < 10; i++) {
        //     triggerPlatformDeath.create(i * 150, 1100, 'platform').setScale(1).setAlpha(0).setDepth(0.3);
        // }

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

        player.anims.play('idleBack', true);

        fadeOutTriggered = false;

    }

    update() {

        if (player.body.velocity.y > 1000) {
            player.body.setBounce(0.2);
          } else {
            player.body.setBounce(0);
        }

        if (player.y > 1000 && !fadeOutTriggered) {
            lives = 0;
            updateLivesUI();
            gameOver();
            randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
            randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(game.config.width / 2.35, player.y-530,);
            this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
            this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
            this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
            this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })});
            fadeOutTriggered = true;
        }

        if (player.x > 1250 && player.y > 0 && !fadeOutTriggered) {
            player.setAlpha(0);
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene5', { sceneBack: true });
            });
            fadeOutTriggered = true;
        }

        if (player.x > 1250 && player.y < 800 && !fadeOutTriggered) {
            player.setAlpha(0);
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene7', { sceneBack: false });
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

        if (player.y <= 603) {
            camera.scrollY = player.y - 505; //605

            liveBG.x = 3;
            liveBG.y = player.y-472; //572
    
            livesText.x = -78;
            livesText.y = player.y-483; //583
        }

        // if (player.x < -200 && player.y < -200) {
        //     player.setVelocityY(-300);
        // }

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
                this.physics.world.gravity.y = 600;
                this.tweens.add({ targets: this.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
            } else if (canDoubleJump) {
                //console.log("2")
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump' || player.anims.currentAnim.key === 'fall') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack' || player.anims.currentAnim.key === 'fallBack') {
                    sound_beeconJump.play();
                    player.anims.play('jumpBack', true);
                }
                hasJumped = true;
                canDoubleJump = false;
                player.setVelocityY(-350);
                this.physics.world.gravity.y = 600;
                this.tweens.add({ targets: this.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
            } else if ((!player.body.onFloor()) && (hasJumped === false)) {
                //console.log("3")
                if (player.anims.currentAnim.key === 'right' || player.anims.currentAnim.key === 'idle' || player.anims.currentAnim.key === 'jump' || player.anims.currentAnim.key === 'fall') {
                    sound_beeconJump.play();
                    player.anims.play('jump', true);
                } else if (player.anims.currentAnim.key === 'left' || player.anims.currentAnim.key === 'idleBack' || player.anims.currentAnim.key === 'jumpBack' || player.anims.currentAnim.key === 'fallBack') {
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
                    //player.anims.play('glideBack');
                    player.body.velocity.y = 30;
                    player.body.velocity.x = -400;
                } else if (cursors.right.isDown || keyD.isDown) {
                    //player.anims.play('glide');
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

}