class Scene1 extends Phaser.Scene {

    constructor() {
        super({ key: 'Scene1' });
    }

    preload() { /*Assets to preload for the scene*/ }

    create() {

        this.scale.refresh();

        scene = 1;
        sound_thunder.setVolume(0.75);

        overlay = this.add.rectangle(-600, 0, this.game.config.width*8, this.game.config.height*2, 0x000000).setOrigin(0).setDepth(1002);

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
        sound_level2Theme.stop();

        isMusicPlaying = false;
        this.sound.sounds.forEach(function(sound) { if (sound.key === 'level1Theme' && sound.isPlaying) { isMusicPlaying = true; } });
        if (!isMusicPlaying) { sound_level1Theme.play(); }

        sound_rain.stop();
        sound_rain2.stop();
        sound_rain.play();
        setTimeout(() => { sound_rain2.play(); }, 5000);

        platforms = this.physics.add.staticGroup();
        lasers = this.physics.add.group({allowGravity: false});
        this.physics.add.collider(lasers, platforms, function(laser) {laser.setVelocityX(0), laser.setAcceleration(0)});
        bigLasers = this.physics.add.group({immovable: true, allowGravity: false});
        this.physics.add.collider(bigLasers, platforms, function(bigLaser) {bigLaser.setVelocityX(0), bigLaser.setAcceleration(0)});

        let { sceneBack } = this.scene.settings.data || { sceneBack: false };

        if (sceneBack) {
            player = this.physics.add.sprite(3800, 598, 'beecon_full').setScale(0.3).setDepth(0.19);
        } else {
            player = this.physics.add.sprite(0, 598, 'beecon_full').setScale(0.3).setDepth(0.19);
            honeyBeam = false;
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

        enemyGroup = this.add.group();
        for (let i = 1; i < 7; i++) {
          if (i < 2) {
            enemy = this.physics.add.sprite(1360, 250, 'enemy').setScale(0.25).setDepth(0.19);
          } else {
            enemy = this.physics.add.sprite(1800 + i * 150, 250, 'enemy').setScale(0.25).setDepth(0.19);
          }
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
                if (language) {
                    randomText = this.add.text(0, 0, 'PRESS ENTER TO RESTART, E TO EXIT', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                } else {
                    randomText = this.add.text(0, 0, 'PULSA INTRO PARA REINTENTAR, E PARA SALIR', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
                }   
                randomText.setShadow(2, 2, '#000000', 2).setDepth(3).setPosition(player.x+320, game.config.height / 2);
                this.timer = this.time.addEvent({delay: 500, loop: true, callback: () => {randomText.visible = !randomText.visible}});
                this.input.keyboard.removeKey(keyJ); this.input.keyboard.removeKey(keyK);
                this.input.keyboard.on('keydown-ENTER', () => {this.sound.stopAll(); lives = 99; this.scene.start('Scene'+scene, { sceneBack: false })});
                this.input.keyboard.on('keydown-E', () => {this.sound.stopAll(); lives = 99; this.scene.start('Title', { sceneBack: false })}); }
            }, null, this);

            self = this;
            energyOrbs = this.physics.add.group();
            enemyFs = this.physics.add.group();
            beeconFs = this.physics.add.group();

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
                        if (lives < 99) { 
                            let energyOrb = energyOrbs.create(enemy.x, enemy.y, 'energyOrb');
                            energyOrb.setOrigin(0.5, 0.5).setScale(0.5).setDepth(2.5);
                            energyOrb.body.setSize(50, 50);
                            energyOrb.setVelocityY(-500);
                            self.physics.add.collider(energyOrb, platforms);
                            self.physics.add.overlap(player, energyOrb, function() { increaseLives(); sound_energyPick.play(); energyOrb.destroy(); });
                        }
                        let enemyF = enemyFs.create(enemy.x, enemy.y, 'enemyF');
                        enemyF.setOrigin(0.5, 0.5).setScale(0.25).setDepth(0.189);
                        enemyF.body.setSize(50, 125);
                        self.physics.add.collider(enemyF, platforms);
                        enemyF.setBounce(0.2);
                    }
                }
                laser.setVelocity(0, 0);
            });
            
            this.physics.add.collider(bigLasers, enemy, function(enemy, bigLaser) {
                enemy.enemyLives = enemy.enemyLives - 5;
                sound_enemyF.play();
                enemy.setTint(0xff0000);
                setTimeout(function() { enemy.setTint(0xffffff); }, 200);
                if (enemy.enemyLives <= 0) {
                    enemy.alpha = 0;
                    enemy.anims.stop();
                    enemy.disableBody(true, true);
                    if (lives < 99) { 
                        let energyOrb = energyOrbs.create(enemy.x, enemy.y, 'energyOrb');
                        energyOrb.setOrigin(0.5, 0.5).setScale(0.5).setDepth(2.5);
                        energyOrb.body.setSize(50, 50);
                        energyOrb.setVelocityY(-500);
                        selfs.physics.add.collider(energyOrb, platforms);
                        selfs.physics.add.overlap(player, energyOrb, function() { increaseLives(); sound_energyPick.play(); energyOrb.destroy(); });
                    }
                    let enemyF = enemyFs.create(enemy.x, enemy.y, 'enemyF');
                    enemyF.setOrigin(0.5, 0.5).setScale(0.25).setDepth(0.189);
                    enemyF.body.setSize(50, 125);
                    self.physics.add.collider(enemyF, platforms);
                    enemyF.setBounce(0.2);
                }
                bigLaser.destroy();
            });
        });
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

        platforms.create(-400, 400, 'wall').setScale(1).refreshBody().setDepth(0.2).setTint(Phaser.Display.Color.GetColor(200, 200, 200));
        platforms.create(500, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(800, 570, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(800, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(880, 650, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2010, 390, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1950, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1950, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(1880, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2070, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2070, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        platforms.create(2140, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);

        stuck = platforms.create(2920, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        stuck.body.checkCollision.down = false;
        platforms.create(2920, 590, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        if (sceneBack) {  } else { platforms.create(3040, 490, 'breakableGround').setScale(0.8).refreshBody().setDepth(0.3); }      
        stuck = platforms.create(3160, -10, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        stuck.body.checkCollision.down = false;
        stuck = platforms.create(3160, 90, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        stuck.body.checkCollision.down = false;
        stuck = platforms.create(3160, 190, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        stuck.body.checkCollision.down = false;
        stuck = platforms.create(3160, 290, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        stuck.body.checkCollision.down = false;
        stuck = platforms.create(3160, 390, 'platform').setScale(0.8).refreshBody().setDepth(0.2);
        stuck.body.checkCollision.down = false;
        platforms.create(3160, 490, 'platform').setScale(0.8).refreshBody().setDepth(0.2);

        if (sceneBack) {  } else { platforms.create(3900, 690, 'breakableGround').setScale(0.8).refreshBody().setDepth(0.3); }     
        platforms.create(4550, 300, 'wall').setScale(2.4).refreshBody().setDepth(0.2).setFlipX(true).setTint(Phaser.Display.Color.GetColor(200, 200, 200));

        for (let i = -2; i < 8; i++) {platforms.create(i * 512, 755, 'ground').setScale(1).refreshBody().setDepth(0.2);}
        for (let i = 8.236; i < 11; i++) {platforms.create(i * 512, 755, 'ground').setScale(1).refreshBody().setDepth(0.2);}

        this.add.image(-270, 185, 'tree').setScale(0.55).setDepth(-0.2).setScrollFactor(1).setAlpha(1).setTint(Phaser.Display.Color.GetColor(200, 200, 200));
        this.add.image(340, 463, 'tree').setScale(0.8).setDepth(0.21).setTint(Phaser.Display.Color.GetColor(230, 230, 230));
        this.add.image(1250, 470, 'tree').setScale(0.65).setDepth(-0.2).setScrollFactor(0.8).setTint(Phaser.Display.Color.GetColor(180, 180, 180));

        for (let i = -2; i < 19; i++) {this.add.image(i * 233.4, 610, 'grass').setScale(0.3).setDepth(-0.2).setScrollFactor(0.9).setTint(Phaser.Display.Color.GetColor(230, 230, 230));}
        for (let i = -2; i < 19; i++) {this.add.image(i * 233.4, 710, 'grass').setScale(0.3).setDepth(-0.2).setScrollFactor(0.9).setTint(Phaser.Display.Color.GetColor(230, 230, 230));}

        for (let i = -2; i < 19; i++) {this.add.image(i * 311.2, 690, 'grass').setScale(0.4).setDepth(0.3).setScrollFactor(1.1).setTint(Phaser.Display.Color.GetColor(50, 50, 50)).setAlpha(0.9);}

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

        if (language) {
            chargeReady = this.add.sprite(player.x, player.y, 'chargeReady').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);
        } else {
            chargeReady = this.add.sprite(player.x, player.y, 'chargeReadySpanish').setScale(0.5).setVisible(false).setDepth(1).setAlpha(0.5);
        }
        
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
            camera = this.cameras.main;
            screenWidth = camera.width;
            screenHeight = camera.height;
            screenCenterX = camera.scrollX + screenWidth / 2;
            screenCenterY = camera.scrollY + screenHeight / 2;
            pauseOverlay = this.add.rectangle(screenCenterX, screenCenterY, screenWidth, screenHeight, 0x000000, 0.25).setDepth(1);
            if (language) {
                pauseText = this.add.text(screenCenterX, screenCenterY, 'PAUSE', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);
            } else {
                pauseText = this.add.text(screenCenterX, screenCenterY, 'PAUSA', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);
            }
            pauseText.setShadow(2, 2, '#000000', 2).setDepth(3);
            this.sound.pauseAll();
            this.sound.mute = true;
            game.scene.pause('Scene' + scene);
            game.scene.stop('Pause');
            game.scene.start('Pause');
        }, this);

        /*
        this.input.keyboard.on('keydown-M', function () {
            camera = this.cameras.main;
            screenWidth = camera.width;
            screenHeight = camera.height;
            screenCenterX = camera.scrollX + screenWidth / 2;
            screenCenterY = camera.scrollY + screenHeight / 2;
            const soundText = this.add.text( screenCenterX, screenCenterY, 'Volume ON', { font: '32px Arial', fill: '#ff0' } ).setOrigin(0.5).setDepth(3);
            const tutorialText = this.add.text( screenCenterX, screenCenterY + 50, 'Tutorials ON', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
            const exitText = this.add.text( screenCenterX, screenCenterY + 100, 'Exit Game', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
            const qText = this.add.text( screenCenterX - 155, screenCenterY - 20, 'Q (back)', { font: '16px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
            const menu2Items = [soundText, tutorialText, exitText];
            menu2Items.forEach((item) => item.setVisible(true));
        
            const boxWidth = 400; const boxHeight = 180; const boxX = screenCenterX - boxWidth / 2; const boxY = screenCenterY - boxHeight / 4.05;
            const graphics = this.add.graphics(); graphics.fillStyle(0x000000, 0.75); graphics.fillRect(boxX, boxY, boxWidth, boxHeight); graphics.setDepth(2); graphics.setAlpha(1);

            let menu2Visible = true;
            let current2Item = 0;

            this.input.keyboard.on('keydown', (event) => {
                if (menu2Visible) {
                  switch (event.code) {
                    case 'KeyW':
                    case 'ArrowUp':
                      menu2Items[current2Item].setFill('#fff');
                      current2Item = (current2Item - 1 + menu2Items.length) % menu2Items.length;
                      menu2Items[current2Item].setFill('#ff0');
                      break;
                    case 'KeyS':
                    case 'ArrowDown':
                      menu2Items[current2Item].setFill('#fff');
                      current2Item = (current2Item + 1) % menu2Items.length;
                      menu2Items[current2Item].setFill('#ff0');
                      break;
                    case 'KeyE':
                    case 'Enter':
                      switch (current2Item) {
                        case 0:
                            volume = !volume;
                            soundText.setText(volume ? 'Volume ON' : 'Volume OFF');
                          break;
                        case 1:
                            tutorial = !tutorial;
                            tutorialText.setText(tutorial ? 'Tutorials ON' : 'Tutorials OFF');
                          break;
                        case 2:
                            this.scene.start('Title', { sceneBack: false });
                          break;
                      }
                      break;
                    case 'KeyQ':
                      menu2Items.forEach((item) => item.setVisible(false));
                      menu2Visible = false;
                      graphics.setAlpha(0);
                      qText.setAlpha(0);
                      break;
                  }
                }
            });
        }, this);
        */

        /******************************************************************* OPTIONS *******************************************************************/
        tutorialBoxF = this.add.container(0, 125);
        boxBackgroundF = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxF.add(boxBackgroundF);
        if (language) {
            tutorialTextF = this.add.text(0, 0, "Press ''F'' to enter Fullscreen Mode and ''P'' to pause the game.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        } else {
            tutorialTextF = this.add.text(0, 0, "Pulsa ''F'' para entrar en pantalla completa y ''P'' para pausar el juego.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        }
        tutorialTextF.setOrigin(0.5, 0.5);
        tutorialBoxF.add(tutorialTextF);
        this.add.existing(tutorialBoxF);
        /******************************************************************** JUMP ********************************************************************/
        tutorialBoxMove = this.add.container(350, 125);
        boxBackgroundMove = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxMove.add(boxBackgroundMove);
        if (language) {
            tutorialTextMove = this.add.text(0, 0, "Use ''WASD'' or the ''ARROW KEYS'' to move.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        } else {
            tutorialTextMove = this.add.text(0, 0, "Usa ''WASD'' o ''FLECHAS'' para desplazarte.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        }
        tutorialTextMove.setOrigin(0.5, 0.5);
        tutorialBoxMove.add(tutorialTextMove);
        this.add.existing(tutorialBoxMove);
        /******************************************************************** JUMP ********************************************************************/
        tutorialBoxJump = this.add.container(700, 125);
        boxBackgroundJump = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxJump.add(boxBackgroundJump);
        if (language) {
            tutorialTextJump = this.add.text(0, 0, "Press ''SPACEBAR'' to jump and press it again while on the air for a double jump.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        } else {
            tutorialTextJump = this.add.text(0, 0, "Pulsa ''ESPACIO'' para saltar y púlsala otra vez en el aire para un doble salto.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        }
        tutorialTextJump.setOrigin(0.5, 0.5);
        tutorialBoxJump.add(tutorialTextJump);
        this.add.existing(tutorialBoxJump);
        /******************************************************************** SHOOT ********************************************************************/
        tutorialBoxShoot = this.add.container(1050, 125);
        boxBackgroundShoot = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxShoot.add(boxBackgroundShoot);
        if (language) {
            tutorialTextShoot = this.add.text(0, 0, "Press ''J'' to shoot your laser", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        } else {
            tutorialTextShoot = this.add.text(0, 0, "Pulsa ''J'' para disparar tu láser", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        }
        tutorialTextShoot.setOrigin(0.5, 0.5);
        tutorialBoxShoot.add(tutorialTextShoot);
        this.add.existing(tutorialBoxShoot);
        /******************************************************************** DRILL ********************************************************************/
        tutorialBoxGlide = this.add.container(2500, 125);
        boxBackgroundGlide = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxGlide.add(boxBackgroundGlide);
        if (language) {
            tutorialTextGlide = this.add.text(0, 0, "Keep ''L'' pressed while on the air and moving to <- or -> to glide.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        } else {
            tutorialTextGlide = this.add.text(0, 0, "Mantén ''L'' pulsado en el aire moviéndote hacia <- o -> para planear.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        }
        tutorialTextGlide.setOrigin(0.5, 0.5);
        tutorialBoxGlide.add(tutorialTextGlide);
        this.add.existing(tutorialBoxGlide);
        /******************************************************************** DRILL ********************************************************************/
        tutorialBoxDrill = this.add.container(3400, 125);
        boxBackgroundDrill = this.add.rectangle(0, 0, 200, 100, 0x000000, 0.85);
        tutorialBoxDrill.add(boxBackgroundDrill);
        if (language) {
            tutorialTextDrill = this.add.text(0, 0, "Press ''K'' to drill.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        } else {
            tutorialTextDrill = this.add.text(0, 0, "Pulsa ''K'' para taladrar.", { fontSize: '18px', fontFamily: 'Arial', color: '#ffffff', align: 'center', wordWrap: { width: 175 } });
        }
        tutorialTextDrill.setOrigin(0.5, 0.5);
        tutorialBoxDrill.add(tutorialTextDrill);
        this.add.existing(tutorialBoxDrill);

        fadeOutTriggered = false;

    }

    update() {

        if (!tutorial) {
            boxBackgroundF.setAlpha(0); tutorialBoxF.setAlpha(0); tutorialTextF.setAlpha(0); tutorialBoxMove.setAlpha(0); boxBackgroundMove.setAlpha(0); tutorialTextMove.setAlpha(0);
            tutorialBoxJump.setAlpha(0); boxBackgroundJump.setAlpha(0); tutorialTextJump.setAlpha(0); tutorialBoxShoot.setAlpha(0); boxBackgroundShoot.setAlpha(0); tutorialTextShoot.setAlpha(0);
            tutorialBoxGlide.setAlpha(0); boxBackgroundGlide.setAlpha(0); tutorialTextGlide.setAlpha(0); tutorialBoxDrill.setAlpha(0); boxBackgroundDrill.setAlpha(0); tutorialTextDrill.setAlpha(0);
          } else {
            boxBackgroundF.setAlpha(1); tutorialBoxF.setAlpha(1); tutorialTextF.setAlpha(1); tutorialBoxMove.setAlpha(1); boxBackgroundMove.setAlpha(1); tutorialTextMove.setAlpha(1);
            tutorialBoxJump.setAlpha(1); boxBackgroundJump.setAlpha(1); tutorialTextJump.setAlpha(1); tutorialBoxShoot.setAlpha(1); boxBackgroundShoot.setAlpha(1); tutorialTextShoot.setAlpha(1);
            tutorialBoxGlide.setAlpha(1); boxBackgroundGlide.setAlpha(1); tutorialTextGlide.setAlpha(1); tutorialBoxDrill.setAlpha(1); boxBackgroundDrill.setAlpha(1); tutorialTextDrill.setAlpha(1);
        }

        if (player.body.velocity.y > 1000) {
            player.body.setBounce(0.2);
          } else {
            player.body.setBounce(0);
        }

        if (player.x > 3000 && player.y > 790 && !fadeOutTriggered) {
            this.cameras.main.fadeOut(500);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('Scene2', { sceneBack: false });
            });
            fadeOutTriggered = true;
        }

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

        if (clouds) {this.physics.world.wrap(clouds.body, clouds.width+50, true);}
        if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width+50, true);}
        if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width+50, true);}

        keyA.on('down', enableKeys);
        keyD.on('down', enableKeys);
        cursors.left.on('down', enableKeys);
        cursors.right.on('down', enableKeys);
        cursors.up.on('down', enableKeys);
        keyW.on('down', enableKeys);
        keySpace.on('down', enableKeys);
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