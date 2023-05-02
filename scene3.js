class Scene3 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene3' });
    }

    preload() { //Assets to preload for the scene
    }

    create() {

        this.scale.refresh(); this.cameras.main.fadeIn(500);

        scene = 3;

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
        //triggerPlatform = this.physics.add.group({ immovable: true, allowGravity: false });
        //triggerPlatformBack = this.physics.add.group({ immovable: true, allowGravity: false });
        //triggerPlatformDeath = this.physics.add.group({ immovable: true, allowGravity: false });

        let { sceneBack } = this.scene.settings.data || { sceneBack: false };

        if (sceneBack === true) {
            player = this.physics.add.sprite(4050, 0, 'beecon_full').setScale(0.3).setDepth(0.19);
        } else {
            player = this.physics.add.sprite(100, 0, 'beecon_full').setScale(0.3).setDepth(0.19);
        }

        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        liveBG = this.add.image(player.x, 100, 'lifeBG').setScale(0.65).setDepth(10).setAlpha(0.9);
        livesText = this.add.text(player.x, 19, 'Energy: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#000000' }).setDepth(10); //, fontStyle: 'bold'

        if (sceneBack) {
            player.anims.play('idleBack');
        } else {
            player.anims.play('idle');
        }

        eneweeGroup = this.add.group();
        for (let i = 0; i < 3; i++) {
          enewee = this.physics.add.sprite(600 + i * 300, 150, 'enewee').setScale(0.25).setDepth(0.19);
          enewee.body.setSize(280, 220);
          enewee.body.setOffset(30, 60);
          enewee.setCollideWorldBounds(false);
          this.physics.add.collider(enewee, platforms);
          eneweeGroup.add(enewee);
        }

        eneweeGroup.children.iterate((enewee) => {
            enewee.eneweeLives = 3;
        });

        for (let i = 15; i <= 30; i++) {
            this.add.image(i * 117, 720, 'spikes').setScale(0.25).setDepth(0.199).setTint(Phaser.Display.Color.GetColor(130, 130, 130));
        }

        jumpshrooms = this.physics.add.group({ immovable: true, allowGravity: false });
        jumpshrooms.create(2000, 680, 'jumpshrooms').setScale(0.3).refreshBody().setDepth(0.199);
        jumpshrooms.create(2350, 680, 'jumpshrooms').setScale(0.3).refreshBody().setDepth(0.199);
        jumpshrooms.create(2700, 680, 'jumpshrooms').setScale(0.3).refreshBody().setDepth(0.199);

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

        eneweeGroup.getChildren().forEach(enewee => {
        this.physics.add.collider(player, enewee, function(player) {
            if (!sound_beeconHit.isPlaying) { sound_beeconHit.play(); }
            damageTint = "0xff0000"; player.setTint(damageTint); startColor = Phaser.Display.Color.HexStringToColor(damageTint); endColor = Phaser.Display.Color.HexStringToColor("#ffffff");
            this.tweens.add({ targets: player, duration: 150, tint: startColor.color, 
                onUpdate: () => { player.setTint(startColor.color); }, onUpdateParams: [startColor], 
                onComplete: () => { player.setTint(endColor.color); } });
            decreaseLives();

            knockbackDirection = new Phaser.Math.Vector2(player.x - enewee.x, player.y - enewee.y).normalize().scale(knockbackForce);
            player.setVelocityY(knockbackDirection.y);
            player.setVelocityX(knockbackDirection.x);

            if (lives <= 0) { gameOver();
                randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
                this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
                this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
                this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
                this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })}); }
            }, null, this);

            selfs = this;
            energyOrbs = this.physics.add.group();

            this.physics.add.collider(lasers, enewee, function(enewee, laser) {
                enewee.eneweeLives--;
                sound_enemyF.play();
                enewee.setTint(0xff0000);
                setTimeout(function() { enewee.setTint(0xffffff); }, 200);
                if (enewee.eneweeLives <= 0) {
                    enewee.alpha = 0;
                    enewee.anims.stop();
                    enewee.disableBody(true, true);
                    if (lives < 99) { 
                        let energyOrb = energyOrbs.create(enewee.x, enewee.y, 'energyOrb');
                        energyOrb.setOrigin(0.5, 0.5).setScale(0.5).setDepth(2.5);
                        energyOrb.body.setSize(50, 50);
                        energyOrb.setVelocityY(-500);
                        selfs.physics.add.collider(energyOrb, platforms);
                        selfs.physics.add.overlap(player, energyOrb, function() { increaseLives(); sound_energyPick.play(); energyOrb.destroy(); });
                    }
                }
                laser.setVelocity(0, 0);
            });
            this.physics.add.collider(bigLasers, enewee, function(enewee, bigLaser) {
                enewee.eneweeLives = enewee.eneweeLives - 5;
                sound_enemyF.play();
                enewee.setTint(0xff0000);
                setTimeout(function() { enewee.setTint(0xffffff); }, 200);
                if (enewee.eneweeLives <= 0) {
                    enewee.alpha = 0;
                    enewee.anims.stop();
                    enewee.disableBody(true, true);
                    if (lives < 99) { 
                        let energyOrb = energyOrbs.create(enewee.x, enewee.y, 'energyOrb');
                        energyOrb.setOrigin(0.5, 0.5).setScale(0.5).setDepth(2.5);
                        energyOrb.body.setSize(50, 50);
                        energyOrb.setVelocityY(-500);
                        selfs.physics.add.collider(energyOrb, platforms);
                        selfs.physics.add.overlap(player, energyOrb, function() { increaseLives(); sound_energyPick.play(); energyOrb.destroy(); });
                    }
                }
                bigLaser.destroy();
            });
        });
        // this.physics.add.overlap(player, triggerPlatformDeath, () => {
        //     lives = 0;
        //     updateLivesUI();
        //     gameOver();
        //     randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
        //     randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
        //     this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
        //     this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
        //     this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
        //     this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })});
        // });

        // this.physics.add.overlap(player, triggerPlatformBack, () => {
        //     this.cameras.main.fadeOut(500);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('Scene1', { sceneBack: true });
        //     });
        // });
        // this.physics.add.overlap(player, triggerPlatform, () => {
        //     this.cameras.main.fadeOut(500);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('Scene4', { sceneBack: false });
        //     });
        // });
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

        // this.physics.add.collider(player, triggerPlatformBack, function(player) {player.setAlpha(0)});
        // this.physics.add.collider(player, triggerPlatform, function(player) {player.setAlpha(0)});

        for (let i = 0; i <= 4; i++) {
            this.add.image(i * 1600, -300, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
            this.add.image(i * 1600, 0, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
            this.add.image(i * 1600, 300, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
            this.add.image(i * 1600, 600, 'mountains').setScale(2).setScrollFactor(0.2).setDepth(0.1);
        }

        platforms.create(-300, 0, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(-300, 400, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(600, -300, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(900, -300, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(1200, -300, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(1500, -300, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(3655, 100, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(3300, 100, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(4450, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(4850, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(5150, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(5450, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(5750, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(6050, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(6350, 190, 'wall').setScale(1.5).refreshBody().setDepth(0.2);
        platforms.create(600, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(900, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1200, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);

        for (let i = -1; i < 4; i++) {
            platforms.create(i * 512, 760, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 6.2; i < 8; i++) {
            platforms.create(i * 512, 760, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 8.605; i < 17; i++) {
            platforms.create(i * 512, 760, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 11.2; i < 17; i++) {
            platforms.create(i * 512, 1049, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 5.2; i < 8; i++) {
            platforms.create(i * 512, 1009, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 4; i < 17; i++) {
            platforms.create(i * 512, 1258, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        for (let i = 8.605; i < 17; i++) {
            platforms.create(i * 512, 926, 'ground').setScale(1).refreshBody().setDepth(0.2);
        }

        // for (let i = 20; i < 30; i++) {
        //     triggerPlatform.create(i * 150, -150, 'platform').setScale(1).setAlpha(1).setDepth(0.3);
        // }

        if (sceneBack) {  } else { platforms.create(4046, 748, 'breakableGround').setScale(1.5).refreshBody().setDepth(0.3).setTint(Phaser.Display.Color.GetColor(120, 145, 170)); }
        
        let glow = this.add.image(4000, 50, 'glow').setScale(1).setScrollFactor(1).setDepth(0.19);

        // create the tween to change the alpha
        this.tweens.add({
            targets: glow,
            alpha: 0.75, // start with alpha 0.5
            duration: 1000, // 1 second duration
            yoyo: true, // repeat the tween in reverse
            repeat: -1, // repeat indefinitely
            ease: 'Sine.easeInOut', // easing function
        });

        // for (let i = 0; i < 10; i++) {
        //     triggerPlatformBack.create(i * 150, -150, 'platform').setScale(1).setAlpha(1).setDepth(0.3);
        // }

        // for (let i = 0; i < 22; i++) {
        //     triggerPlatformDeath.create(i * 150, 900, 'platform').setScale(1).setAlpha(0).setDepth(0.3);
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

        overlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width*10, this.cameras.main.height*7, 0x000000, 0.5).setDepth(1);

        emitter = this.add.particles(0, 0, 'rain',{
            x: 0,
            y: -100,
            quantity: 20,
            lifespan: 1600,
            speedY: { min: 700, max: 900 },
            speedX: { min: -5, max: 5 },
            scale: { start: 0.25, end: 0.5 },
            rotate: { start: 0, end: 0 },
            frequency: 5,
            //blendMode: 'ADD',
            //angle: { min: 0, max: 0 },
            emitZone: { source: new Phaser.Geom.Rectangle(1795, 0, 1200, 1) },
            on: true
        });
      
        emitter.setScrollFactor(1).setDepth(0.11);

        emitter2 = this.add.particles(0, 0, 'rain',{
            x: 0,
            y: -100,
            quantity: 5,
            lifespan: 1600,
            speedY: { min: 700, max: 900 },
            speedX: { min: -5, max: 5 },
            scale: { start: 0.25, end: 0.5 },
            rotate: { start: 0, end: 0 },
            frequency: 5,
            //blendMode: 'ADD',
            //angle: { min: 0, max: 0 },
            emitZone: { source: new Phaser.Geom.Rectangle(3942, 0, 210, 1) },
            on: true
        });
      
        emitter2.setScrollFactor(1).setDepth(0.11);

        this.lastWalkSoundTime = 0;

        this.input.keyboard.on('keydown-P', function () {
            pauseOverlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width*8, this.cameras.main.height*3, 0x000000, 0.25).setDepth(1);
            pauseText = this.add.text(0, 0, 'PAUSE', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
            pauseText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
            this.sound.pauseAll();
            this.sound.mute = true;
            game.scene.pause('Scene'+scene);
            game.scene.stop('Pause');
            game.scene.start('Pause');
        }, this);

        eneweeGroup.getChildren().forEach(enewee => {
            enewee.anims.play('eneweeStill');
            enewee.body.allowGravity = false;
            enewee.setVelocityX(0);
            enewee.setVelocityY(0);
        });

        /***************************************************************** HONEY BEAM *****************************************************************/
        tutorialBoxHoneyBeam = this.add.container(4300, 703);
        let boxBackgroundHoneyBeam = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxHoneyBeam.add(boxBackgroundHoneyBeam);
        let tutorialTextHoneyBeam = this.add.text(0, 0, "Hold ''J'' to charge a Honey Beam", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextHoneyBeam.setOrigin(0.5, 0.5);
        tutorialBoxHoneyBeam.add(tutorialTextHoneyBeam);
        this.add.existing(tutorialBoxHoneyBeam);
        tutorialBoxHoneyBeam.setDepth(-99);
        /**************************************************************** HONEY BEAM 2 ****************************************************************/
        tutorialBoxHoneyBeam2 = this.add.container(4300, 828);
        let boxBackgroundHoneyBeam2 = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxHoneyBeam2.add(boxBackgroundHoneyBeam2);
        let tutorialTextHoneyBeam2 = this.add.text(0, 0, "You can jump on Honey Beams and use them as platforms.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextHoneyBeam2.setOrigin(0.5, 0.5);
        tutorialBoxHoneyBeam2.add(tutorialTextHoneyBeam2);
        this.add.existing(tutorialBoxHoneyBeam2);
        tutorialBoxHoneyBeam2.setDepth(-99);
        /**************************************************************** HONEY BEAM 3 ****************************************************************/
        tutorialBoxHoneyBeam3 = this.add.container(4300, 953);
        let boxBackgroundHoneyBeam3 = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxHoneyBeam3.add(boxBackgroundHoneyBeam3);
        let tutorialTextHoneyBeam3 = this.add.text(0, 0, "You can only have 4 Honey Beams on screen at the same time.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextHoneyBeam3.setOrigin(0.5, 0.5);
        tutorialBoxHoneyBeam3.add(tutorialTextHoneyBeam3);
        this.add.existing(tutorialBoxHoneyBeam3);
        tutorialBoxHoneyBeam3.setDepth(-99);

        powerup = this.add.image(5450, 1120, 'bigLaser').setScrollFactor(1).setDepth(99);

        fadeOutTriggered = false;

    }

    update() {

        if (player.body.velocity.y > 1000) {
            player.body.setBounce(0.2);
          } else {
            player.body.setBounce(0);
        }

        if (player.x > 1700 && player.x < 3000 && player.y > 800 && !fadeOutTriggered) {
            lives = 0;
            updateLivesUI();
            gameOver();
            randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
            randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
            this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
            this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK); //keyJ.enabled = false; keyK.enabled = false;
            this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
            this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })});
            fadeOutTriggered = true;
        }

        if (player.x > 0 && player.x < 1000 && player.y < -100 && !fadeOutTriggered) {
                player.setAlpha(0);
                this.cameras.main.fadeOut(500);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Scene1', { sceneBack: true });
                });
            fadeOutTriggered = true;
        }

        if (player.x > 3000 && player.y < -100 && !fadeOutTriggered) {
                player.setAlpha(0);
                this.cameras.main.fadeOut(500);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('Scene4', { sceneBack: false });
                });
            fadeOutTriggered = true;
        }

        if (!game.scene.isPaused() && pauseOverlay && pauseText) {
            this.sound.resumeAll();
            this.sound.mute = false;
            pauseOverlay.destroy();
            pauseText.destroy();
        }

        liveBG.x = player.x+100 - game.config.width / 4;
        liveBG.y = 30 + camera.scrollY;

        livesText.x = player.x+20 - game.config.width / 4;
        livesText.y = 19 + camera.scrollY;

        if (player.y >= 703 && player.x > 3500) {
            desiredCameraY = player.y - 505;
        } else {
            desiredCameraY = 0;
        }
        
        interpolationFactor = (player.y < 1200) ? 0.01 : 1;
        camera.scrollY += (desiredCameraY - camera.scrollY) * interpolationFactor;
        camera.scrollX = player.x - game.config.width / 4;

        if (honeyBeam) {
            tutorialBoxHoneyBeam.setDepth(99);
            tutorialBoxHoneyBeam2.setDepth(99);
            tutorialBoxHoneyBeam3.setDepth(99);
        }

        if (honeyBeam) {
            powerup.alpha = 0;
        }

        if ((Phaser.Geom.Intersects.RectangleToRectangle(player.getBounds(), powerup.getBounds())) && (powerup.alpha !== 0) && (!honeyBeam)) {
            sound_powerUp.play();
            honeyBeam = true;
            powerup.alpha = 0;
        }

        eneweeGroup.getChildren().forEach(enewee => {
            if (player.body.x + 50 > enewee.body.x && !enewee.body.onFloor()) {
                if (enewee.anims.currentAnim.key === 'eneweeStill') {
                    enewee.anims.play('eneweeChill');
                }
                enewee.setImmovable(true);
                enewee.body.allowGravity = true;
                enewee.setVelocityX(0);
                enewee.setVelocityY(600);
                if (enewee.y === 150) {
                    sound_eneweeAttack.play();
                }
            } else if (enewee.body.onFloor()) {
                enewee.setImmovable(true);
                enewee.setVelocityY(0);
                sound_laserHit.play();
            }
          });

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

        if (honeyBeam) {
            if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J), 750)) {

                let holdTime = this.time.now - jKeyDownTime;
    
                if (holdTime > 750) {
                    chargeReady.setVisible(true);
                }
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
            if (keyJ.duration > 750 && honeyBeam) {
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
                this.physics.world.gravity.y = 600;
                this.tweens.add({ targets: this.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
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