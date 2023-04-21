class Scene1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene1' });
    }

    preload() { //Assets to preload for the scene
    }

    create() {

        this.scale.refresh();

        scene = 1;
        sound_thunder.setVolume(0.75);

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

        sound_titleTheme.stop();

        isMusicPlaying = false;
        this.sound.sounds.forEach(function(sound) { if (sound.key === 'levelTheme' && sound.isPlaying) { isMusicPlaying = true; } });
        if (!isMusicPlaying) { sound_levelTheme.play(); }

        sound_rain.play();
        setTimeout(() => { sound_rain2.play(); }, 5000);

        //platforms = this.physics.add.staticGroup({immovable: true});
        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms);
        this.physics.add.collider(lasers, platforms, function(laser) {laser.setVelocityX(0), laser.setAcceleration(0)});
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});
        this.physics.add.collider(bigLasers, platforms);
        this.add.image(1700, 1303, 'ground').setScale(5).setDepth(0);
        triggerPlatform = this.physics.add.group({ immovable: true, allowGravity: false });
        player = this.physics.add.sprite(0, 598, 'beecon_full').setScale(0.3).setDepth(0.19);
        player.body.setSize(120, 120);
        player.body.setOffset(65, 110);
        liveBG = this.add.image(player.x, 100, 'lifeBG').setScale(0.65).setDepth(10).setAlpha(0.9);
        livesText = this.add.text(player.x, 19, 'Energy: ' + lives, { fontFamily: 'Arial', fontSize: 20, color: '#000000' }).setDepth(10); //fontStyle: 'bold'

        enemyGroup = this.add.group();
        for (let i = 1; i < 2; i++) {
          enemy = this.physics.add.sprite(1560, 250, 'enemy').setScale(0.25).setDepth(0.19);
          enemy.body.setSize(280, 220);
          enemy.body.setOffset(30, 60);
          enemy.setCollideWorldBounds(false);
          this.physics.add.collider(enemy, platforms);
          enemyGroup.add(enemy);
        }

        enemyGroup.children.iterate((enemy) => {
            enemy.enemyLives = 3;
        });

        this.physics.add.collider(enemy, platforms);
        airPlatform = this.physics.add.sprite(1000, 390, 'airPlatform').setScale(0.8).refreshBody().setDepth(0.2);
        airPlatform.setVelocityX(100);
        airPlatform.setImmovable(true);
        airPlatform.body.allowGravity = false;
        this.physics.add.collider(player, airPlatform);
        this.physics.add.overlap(lasers, airPlatform);
        this.physics.add.overlap(bigLasers, airPlatform);

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
        this.physics.add.collider(bigLasers, player);
        player.setBounce(0.2);
        player.setCollideWorldBounds(false);
        this.physics.add.overlap(player, triggerPlatform, () => {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene2');
            });
        });
        this.physics.add.collider(player, platforms, function(player, platform) {
            if (player.anims.currentAnim.key === 'drill' && platform.texture.key === 'breakableGround') {
                timer++;
                //console.log(timer);
                if (timer >= 50) {
                    platform.destroy();
                }
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

        for (let i = -2; i < 16; i++) {this.add.image(i * 233.4, 610, 'grass').setScale(0.3).setDepth(-0.2).setScrollFactor(0.9).setTint(Phaser.Display.Color.GetColor(230, 230, 230));}

        for (let i = -2; i < 16; i++) {this.add.image(i * 311.2, 690, 'grass').setScale(0.4).setDepth(0.3).setScrollFactor(1.1).setTint(Phaser.Display.Color.GetColor(50, 50, 50)).setAlpha(0.9);}

        enemyGroup.getChildren().forEach(enemy => {
            enemy.anims.play('enemyChill');
            enemy.setVelocityX(100);
        });

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

        emitter = this.add.particles(0, 0, 'rain',{
            x: 0,
            y: -100,
            quantity: 20,
            lifespan: 1600,
            speedY: { min: 700, max: 900 },
            speedX: { min: -5, max: 5 },
            scale: { start: 0.1, end: 0.5 },
            rotate: { start: 0, end: 0 },
            frequency: 5,
            //blendMode: 'ADD',
            //angle: { min: 0, max: 0 },
            emitZone: { source: new Phaser.Geom.Rectangle(-this.game.config.width, 0, this.game.config.width*8, 1) },
            on: true
        });
      
        emitter.setScrollFactor(0.5).setDepth(-0.11);

        this.lastWalkSoundTime = 0;

        delayLightningFirt = Phaser.Math.RND.integerInRange(15000, 45000);
        console.log(delayLightningFirt);
        this.time.addEvent({
            delay: delayLightningFirt,
            callback: createOverlay,
            callbackScope: this,
        });

        this.input.keyboard.on('keydown-P', function () {
            pauseOverlay = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, this.cameras.main.width*4, this.cameras.main.height*2, 0x000000, 0.25).setDepth(1);
            pauseText = this.add.text(0, 0, 'PAUSE', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
            pauseText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
            this.sound.pauseAll();
            this.sound.mute = true;
            game.scene.pause('Scene'+scene);
            game.scene.stop('Pause');
            game.scene.start('Pause');
        }, this);

        /******************************************************************* OPTIONS *******************************************************************/
        let tutorialBoxF = this.add.container(0, 125);
        let boxBackgroundF = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxF.add(boxBackgroundF);
        let tutorialTextF = this.add.text(0, 0, "Press ''F'' to enter/exit Fullscreen Mode and ''P '' to pause the game.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextF.setOrigin(0.5, 0.5);
        tutorialBoxF.add(tutorialTextF);
        this.add.existing(tutorialBoxF);
        /******************************************************************** JUMP ********************************************************************/
        let tutorialBoxMove = this.add.container(350, 125);
        let boxBackgroundMove = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxMove.add(boxBackgroundMove);
        let tutorialTextMove = this.add.text(0, 0, "Use ''WASD'' or the ''ARROW KEYS'' to move.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextMove.setOrigin(0.5, 0.5);
        tutorialBoxMove.add(tutorialTextMove);
        this.add.existing(tutorialBoxMove);
        /******************************************************************** JUMP ********************************************************************/
        let tutorialBoxJump = this.add.container(700, 125);
        let boxBackgroundJump = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxJump.add(boxBackgroundJump);
        let tutorialTextJump = this.add.text(0, 0, "Press ''SPACEBAR'' to jump... and press it again while on the air for a double jump.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextJump.setOrigin(0.5, 0.5);
        tutorialBoxJump.add(tutorialTextJump);
        this.add.existing(tutorialBoxJump);
        /******************************************************************** SHOOT ********************************************************************/
        let tutorialBoxShoot = this.add.container(1050, 125);
        let boxBackgroundShoot = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxShoot.add(boxBackgroundShoot);
        let tutorialTextShoot = this.add.text(0, 0, "Press ''J'' to shoot your laser", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextShoot.setOrigin(0.5, 0.5);
        tutorialBoxShoot.add(tutorialTextShoot);
        this.add.existing(tutorialBoxShoot);
        /******************************************************************** DRILL ********************************************************************/
        let tutorialBoxDrill = this.add.container(1750, 125);
        let boxBackgroundDrill = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxDrill.add(boxBackgroundDrill);
        let tutorialTextDrill = this.add.text(0, 0, "Press ''K'' to drill.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        tutorialTextDrill.setOrigin(0.5, 0.5);
        tutorialBoxDrill.add(tutorialTextDrill);
        this.add.existing(tutorialBoxDrill);

    }

    update() {

        if (!game.scene.isPaused() && pauseOverlay && pauseText) {
            this.sound.resumeAll();
            this.sound.mute = false;
            pauseOverlay.destroy();
            pauseText.destroy();
        }

        camera.scrollX = player.x - game.config.width / 4;

        liveBG.x = player.x+100 - game.config.width / 4;
        liveBG.y = 30;

        livesText.x = player.x+20 - game.config.width / 4;
        livesText.y = 19;

        enemyGroup.getChildren().forEach(enemy => {
            updateEnemyBehavior(enemy);
        });

        if (airPlatform.x >= 1290) {
            airPlatform.setVelocityX(0);
            setTimeout(() => {
                airPlatform.setVelocityX(-100);
            }, 1000);
        } else if (airPlatform.x <= 1000) {
            airPlatform.setVelocityX(0);
            setTimeout(() => {
                airPlatform.setVelocityX(100);
            }, 1000);
        }

        if (clouds) {this.physics.world.wrap(clouds.body, clouds.width+50, true);}
        if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width+50, true);}
        if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width+50, true);}

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

        bigLasers.getChildren().forEach(bigLaser => {
            if (this.physics.overlap(bigLaser, airPlatform)) {
                bigLaser.destroy();
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

        if ((player.anims.currentAnim.key !== 'drill') || (!player.body.onFloor())) {
            timer = 0;
        }

        // if (player.body.velocity.x > 0) {
        //     emitterSpeedX = 5;
        // } else if (player.body.velocity.x < 0) {
        //     emitterSpeedX = -5;
        // } else {
        //     emitterSpeedX = 0;
        // }

        // //emitterSpeedX = player.body.velocity.x * -0.1;
        // //emitterSpeedX = player.body.velocity.x * 0.26;
        // //emitter.setSpeedX({ min: emitterSpeedX - 0.52, max: emitterSpeedX + 0.52 });

        // // Create the tween to update particle properties
        // this.tweens.add({
        //     targets: emitter.particles,
        //     //angle: emitterSpeedX,
        //     //ease: 'Linear',
        //     //repeat: -1
        // });

    }

    shutdown() {this.timer.remove();}

    resume() {
        this.overlay.setVisible(false);
    }

}