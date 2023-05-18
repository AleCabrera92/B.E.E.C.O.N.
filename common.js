let beeIcon, bigLasers, camera, chargeReady, clickBButton, clickBButton2, clouds, clouds2, clouds3, cursors, didPressUp, didPressW, didPressSpace, enemy, enewee, emitter, emitter2, emitter3;
let lasers, livesText, liveBG, mountains, overlay, overlay2, platforms, player, triggerPlatform, triggerPlatformBack, triggerPlatformDeath, treeTexture;
let isMusicPlaying, sound_beeconWalk, sound_beeconJump, sound_laser, sound_bigLaser, sound_drill, sound_enemyF, sound_beeconF, sound_beeconHit, sound_rain, sound_rain2;
let sound_thunder, sound_laserHit, sound_mushroomJump, sound_titleTheme, sound_level1Theme, sound_level2Theme, sound_level3Theme, sound_level4Theme, sound_enemyEnraged;
let canDoubleJump = true, isDrilling = false, jKeyDownTime = 0, lives = 99, timer = 0, hasJumped = true;
let scene, gameOverImage, randomText, chargeReadySpanish;
let damageTint, startColor, endColor,keyA, keyD, keyJ, keyF, keyK, keyW, keyUP, keySpace, keyP;
let knockbackForce = 500, knockbackDirection, megaTree, megaTreeCover;
let enemyLives, eneweeLives = 3, enemyGroup, eneweeGroup, lilWasp, lilWaspLives, lilWaspGroup, wasp, waspLives;
let lightning, delayLightningFirt, delayLightning, airPlatform, laser, jumpshrooms;
let isPaused = false, pauseText, pauseOverlay, stuck, pressStartText;
let throttled = false, sound_eneweeAttack, babyWasp, babyWaspGroup;
let keyL, leaves, leavesBG, sceneBack, sound_powerUp, screenWidth, screenHeight, screenCenterX, screenCenterY;
let desiredCameraY = 0, interpolationFactor, honeyBeam = false, powerup;
let tutorialBoxHoneyBeam, boxBackgroundHoneyBeam, tutorialTextHoneyBeam, tutorialBoxHoneyBeam2, boxBackgroundHoneyBeam2, tutorialTextHoneyBeam2, tutorialBoxHoneyBeam3, boxBackgroundHoneyBeam3, tutorialTextHoneyBeam3;
let energyOrb, energyOrbs, self, selfs, selfss, sound_energyPick, enemyFs, eneweeFs, lilWaspFs, waspFs, beeconFs;
let waspInterval, waspTween, healthBar, waspNestDoor, destroyed, fadeOutTriggered = false;
let volume = true, tutorial = true, language = true;
let boxBackgroundF, tutorialBoxF, tutorialTextF, tutorialBoxMove, boxBackgroundMove, tutorialTextMove;
let tutorialBoxJump, boxBackgroundJump, tutorialTextJump, tutorialBoxShoot, boxBackgroundShoot, tutorialTextShoot;
let tutorialBoxGlide, boxBackgroundGlide, tutorialTextGlide, tutorialBoxDrill, boxBackgroundDrill, tutorialTextDrill;
let startText, optionsText, creditsText, qText, menuItems, soundText, tutorialText, languageText, menu2Items;
let ship, shipEngine, skyIntro1, skyIntro2, skyIntro3, skyIntro4, skyIntro5, skyIntro6, skyIntro7, skyIntro8, skyIntroSpeed = 0.25;
let text, message, delay, index, timerEvent, keyEnter, topBar, bottomBar;
let currentSentenceIndex = 0, currentSentenceSpanishIndex = 0;
let sentences = [
    "HUMANITY IS DESPERATELY LOOKING FOR PLANETS TO COLONIZE.",
    "YOU ARE B.E.E.C.O.N., A DRONE CAPABLE OF RECOGNIZING AND EXPLORING ALIEN WORLDS.",
    "WELCOME TO THE UNKNOWN, WHERE ADVENTURE AWAITS.",
    "EXPLORE EXOTIC NEW WORLDS AND UNCOVER HIDDEN MYSTERIES."
];
let sentencesSpanish = [
    "LA HUMANIDAD BUSCA DESESPERADAMENTE PLANETAS PARA COLONIZAR.",
    "ERES B.E.E.C.O.N., UN DRON CAPAZ DE RECONOCER Y EXPLORAR MUNDOS ALIENÍGENAS.",
    "BIENVENIDO A LO DESCONOCIDO, DONDE LA AVENTURA TE ESPERA.",
    "EXPLORA NUEVOS MUNDOS EXÓTICOS Y DESCUBRE MISTERIOS OCULTOS."
];

function decreaseLives() { if (!throttled) { if (scene === 7) { lives -= 20} else { lives -= 10 }; if (language) {lives <= -1 ? livesText.setText('Energy: ' + 0) : updateLivesUI()} else {lives <= -1 ? livesText.setText('Energía: ' + 0) : updateLivesUI()}; throttled = true; setTimeout(() => { throttled = false; }, 500); } }
function increaseLives() { if (!throttled) { lives += 10; if (language) {lives <= -1 ? livesText.setText('Energy: ' + 0) : updateLivesUI()} else {lives <= -1 ? livesText.setText('Energía: ' + 0) : updateLivesUI()}; throttled = true; setTimeout(() => { throttled = false; }, 0); } }
function updateLivesUI() { if (language) {livesText.setText('Energy: ' + lives);} else {livesText.setText('Energía: ' + lives);} }
function enableKeys() { keyJ.enabled = true; keyW.enabled = true; keyUP.enabled = true; keySpace.enabled = true; keysDisabled = false; }
function toggleFullscreen() { if (game.scale.isFullscreen) { game.scale.stopFullscreen(); game.scale.setGameSize(1280, 720); } else { game.scale.startFullscreen(); } }

function updateEnemyBehavior(enemy) {
    let distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
    if (distance <= 250 && player.alpha !== 0) {
        if (!enemy.getData('spiky') && enemy.alpha !== 0) {
            sound_enemyEnraged.play({loop: false});
        }
        enemy.setData('spiky', true);
        enemy.setData('velocitySet', true);
        setTimeout(() => {
            enemy.anims.play('enemyEnraged', true);
        }, 100);        
        if (enemy.body.onFloor()) {
            enemy.setVelocity(0);
            enemy.setImmovable(true);
            enemy.body.allowGravity = false;
        }
    } else {
        enemy.setImmovable(false);
        enemy.body.allowGravity = true;
        if (enemy.getData('velocitySet')) {
            if (player.x < enemy.x) {
                enemy.setVelocityX(100);
            } else if (player.x >= enemy.x) {
                enemy.setVelocityX(-100);
            }
        }
        if (enemy.getData('spiky') && enemy.alpha !== 0) {
            sound_enemyEnraged.play({loop: false});
        }
        enemy.setData('spiky', false);
        setTimeout(() => {
            if (scene != 'title' && scene != 2 && scene != 3 && scene != 4 && scene != 6 && scene != 7 && scene != 8 && scene != 'ending') {
                enemy.anims.play('enemyChill', true);
            } 
        }, 100);
        if (enemy.body.touching.right) {
            enemy.setVelocityX(-100);
            enemy.setData('velocitySet', false);
        } else if (enemy.body.touching.left) {
            enemy.setVelocityX(100);
            enemy.setData('velocitySet', false);
        }
    }
}

function updatelilWaspBehavior(lilWasp) {

  let distanceToPlayer = Phaser.Math.Distance.Between(lilWasp.x, lilWasp.y, player.x, player.y);

  if (lilWasp.x >= player.x) {
    lilWasp.setFlip(false);
  } else {
    lilWasp.setFlip(true);
  }

  if (distanceToPlayer <= 500 && player.alpha != 0) {
    if (!lilWasp.getData('spiky') && lilWasp.alpha !== 0) {
        sound_eneweeAttack.play({loop: false});
    }
    lilWasp.setData('spiky', true);

    const angleToPlayer = Phaser.Math.Angle.Between(lilWasp.x, lilWasp.y, player.x, player.y);
    const speed = 3;

    if (distanceToPlayer <= 500 && distanceToPlayer > 100 && player.alpha != 0) {
      lilWasp.x += Math.cos(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
      lilWasp.y += Math.sin(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
    } else if (distanceToPlayer <= 100 && player.alpha != 0) {
      lilWasp.x += Math.cos(angleToPlayer) * speed * 35 * (game.loop.delta / 100);
      lilWasp.y += Math.sin(angleToPlayer) * speed * 35 * (game.loop.delta / 100);
    }
  }
}

function shootLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left" || player.anims.currentAnim.key === "jumpBack" || player.anims.currentAnim.key === "glideBack" || player.anims.currentAnim.key === "fallBack") {
        sound_laser.play();
        let laser = lasers.create(player.x - 30, player.y + 4, 'laser').setDepth(0.2);
        laser.setVelocityX(-1000);
        laser.setAcceleration(0);
    } else {
        let laser = lasers.create(player.x + 30, player.y + 4, 'laser').setDepth(0.2);
        sound_laser.play();
        laser.setVelocityX(1000);
        laser.setAcceleration(0);
    }
}

function shootBigLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left" || player.anims.currentAnim.key === "jumpBack" || player.anims.currentAnim.key === "glideBack" || player.anims.currentAnim.key === "fallBack") {
        let bigLaser = bigLasers.create(player.x - 30, player.y + 4, 'bigLaser').setDepth(0.2);
        sound_bigLaser.play();
        bigLaser.setVelocityX(-1000);
        bigLaser.setAcceleration(0);
    } else {
        let bigLaser = bigLasers.create(player.x + 30, player.y + 4, 'bigLaser').setDepth(0.2);
        sound_bigLaser.play();
        bigLaser.setVelocityX(1000);
        bigLaser.setAcceleration(0);
    }
}

function gameOver() {
  sound_level1Theme.stop();
  sound_level2Theme.stop();
  sound_level3Theme.stop();
  sound_level4Theme.stop();
  sound_beeconF.play();
  player.alpha = 0;
  player.anims.stop();
  player.disableBody(true, true);
  if (scene === 5) {
      gameOverImage.create(game.config.width / 2.35, player.y-330, 'gameOver');
      gameOverImage.setOrigin(0.5).setAlpha(0.9).setDepth(3);
  } else if (scene === 6) {
      gameOverImage.create(game.config.width / 2.35, player.y-680, 'gameOver');
      gameOverImage.setOrigin(0.5).setAlpha(0.9).setDepth(3);
  } else {
      gameOverImage.create(player.x+320, game.config.height / 4, 'gameOver');
      gameOverImage.setOrigin(0.5).setAlpha(0.9).setDepth(3);
  }
  let beeconF = beeconFs.create(player.x, player.y, 'beeconF');
  beeconF.setOrigin(0.5, 0.5).setScale(0.3).setDepth(0.189);
  beeconF.body.setSize(50, 75);
  self.physics.add.collider(beeconF, platforms);
  beeconF.setBounce(0.2);
}

function createOverlay() {

    if (scene === 1) {
        delayLightning = Phaser.Math.RND.integerInRange(5000, 45000);
    } else if (scene === 4 || scene === 5 || scene === 6 || scene === 7) {
        delayLightning = Phaser.Math.RND.integerInRange(3333, 30000);
    }
    
    console.log(delayLightning);
    this.time.addEvent({
      delay: delayLightning,
      callback: createOverlay,
      callbackScope: this
    });

    lightning = this.add.graphics();
    if (scene === 1) {
        lightning.fillStyle(0xffffff, 0.75);
    } else if (scene === 4 || scene === 5 || scene === 6 || scene === 7) {
        lightning.fillStyle(0xffffff, 0.95);
    }
    if (scene === 1 || scene === 4) {
        lightning.fillRect(-1000, 0, this.game.config.width * 8, this.game.config.height * 2);
    } else if (scene === 5 || scene === 6 || scene === 7) {
        lightning.fillRect(-1000, -10000, this.game.config.width * 4, this.game.config.height * 20);
    }
    lightning.setAlpha(0);
    if (scene === 1) {
        lightning.setDepth(-0.99);
    } else if (scene === 4 || scene === 5 || scene === 6 || scene === 7) {
        lightning.setDepth(-0.21);
    }
  
    this.tweens.add({
        targets: lightning,
        alpha: 1,
        duration: 150,
        ease: 'Power2',
        yoyo: true,
        onComplete: () => {

            lightning.destroy();
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    sound_thunder.play();
                },
                callbackScope: this
            });
        }
    });
}

function updateWaspBehavior(wasp) {

    let distanceToPlayer = Phaser.Math.Distance.Between(wasp.x, wasp.y, player.x, player.y);
  
    if (wasp.x >= player.x) {
      wasp.setFlip(false);
    } else {
      wasp.setFlip(true);
    }
  
    if (distanceToPlayer <= 500 && player.alpha != 0) {
      if (!wasp.getData('spiky') && wasp.alpha !== 0) {
          sound_eneweeAttack.play({loop: false});
      }
      wasp.setData('spiky', true);

      const angleToPlayer = Phaser.Math.Angle.Between(wasp.x, wasp.y, player.x, player.y);
      const speed = 3;

      if (distanceToPlayer <= 500 && distanceToPlayer > 100 && player.alpha != 0) {
        wasp.x += Math.cos(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
        wasp.y += Math.sin(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
      } else if (distanceToPlayer <= 100 && player.alpha != 0) {
        wasp.x += Math.cos(angleToPlayer) * speed * 35 * (game.loop.delta / 100);
        wasp.y += Math.sin(angleToPlayer) * speed * 35 * (game.loop.delta / 100);
      }
    }
  }

function addNextLetter() {
    if (index < message.length) {
        text.text += message[index];
        index++;
    }
    else {
        // All letters have been displayed, stop the animation
        timerEvent.remove();
    }
}