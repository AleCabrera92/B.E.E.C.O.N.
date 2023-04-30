let beeIcon, bigLasers, camera, chargeReady, clickBButton, clickBButton2, clouds, clouds2, clouds3, cursors, didPressUp, didPressW, didPressSpace, enemy, enewee, emitter, emitter2;
let lasers, livesText, liveBG, mountains, overlay, overlay2, platforms, player, triggerPlatform, triggerPlatformBack, triggerPlatformDeath, treeTexture;
let isMusicPlaying, sound_beeconWalk, sound_beeconJump, sound_laser, sound_bigLaser, sound_drill, sound_enemyF, sound_beeconF, sound_beeconHit, sound_rain, sound_rain2;
let sound_thunder, sound_laserHit, sound_mushroomJump, sound_titleTheme, sound_levelTheme, sound_enemyEnraged;
let canDoubleJump = true, isDrilling = false, jKeyDownTime = 0, lives = 99, timer = 0, hasJumped = true;
let scene, gameOverImage, randomText;
let damageTint, startColor, endColor,keyA, keyD, keyJ, keyF, keyK, keyW, keyUP, keySpace, keyP;
let knockbackForce = 500, knockbackDirection, megaTree, megaTreeCover;
let enemyLives, eneweeLives = 3, enemyGroup, eneweeGroup, lilWasp, lilWaspLives, lilWaspGroup, wasp, waspLives;
let lightning, delayLightningFirt, delayLightning, airPlatform, laser, jumpshrooms;
let isPaused = false, pauseText, pauseOverlay;
let throttled = false, sound_eneweeAttack;
let keyL, leaves, leavesBG, sceneBack, sound_powerUp;
let desiredCameraY = 0, interpolationFactor, honeyBeam = false, powerup;
let tutorialBoxHoneyBeam, tutorialBoxHoneyBeam2, tutorialBoxHoneyBeam3;
let energyOrb, energyOrbs, self, selfs, selfss, sound_energyPick;
let waspInterval, waspTween, healthBar;

var jumpTimer = 0;
var jumpVelocity = -380;
var jumpTime = 150; // milliseconds
var jumpCount = 0;
var maxJumps = 6;

function decreaseLives() { if (!throttled) { lives -= 10; lives <= -1 ? livesText.setText('Energy: ' + 0) : updateLivesUI(); throttled = true; setTimeout(() => { throttled = false; }, 500); } }
function increaseLives() { if (!throttled) { lives += 10; lives <= -1 ? livesText.setText('Energy: ' + 0) : updateLivesUI(); throttled = true; setTimeout(() => { throttled = false; }, 0); } }
function updateLivesUI() { livesText.setText('Energy: ' + lives); }
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
            if (scene != 2 && scene != 3 && scene != 4) {
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
  // Calculate distance between enemy and player
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
    // Enemy is close to player, move towards player
    const angleToPlayer = Phaser.Math.Angle.Between(lilWasp.x, lilWasp.y, player.x, player.y);
    const speed = 3;
  
    //lilWasp.rotation = angleToPlayer; // Point towards player
    if (distanceToPlayer <= 500 && distanceToPlayer > 100 && player.alpha != 0) {
      // If not in attack mode, move towards player
      lilWasp.x += Math.cos(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
      lilWasp.y += Math.sin(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
    } else if (distanceToPlayer <= 100 && player.alpha != 0) {
      // Enemy is in attack mode
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
  sound_levelTheme.stop();
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
}

// Function to create and animate the white overlay
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
    // Add a white overlay that covers the entire game world
    lightning = this.add.graphics();
    if (scene === 1) {
        lightning.fillStyle(0xffffff, 0.75);
    } else if (scene === 4 || scene === 5 || scene === 6 || scene === 7) {
        lightning.fillStyle(0xffffff, 0.95);
    }
    if (scene === 1 || scene === 4) {
        lightning.fillRect(-1000, 0, this.game.config.width * 4, this.game.config.height * 2);
    } else if (scene === 5 || scene === 6 || scene === 7) {
        lightning.fillRect(-1000, -10000, this.game.config.width * 4, this.game.config.height * 80);
    }
    lightning.setAlpha(0); // set initial alpha to 0
    if (scene === 1) {
        lightning.setDepth(-0.99); // set initial alpha to 0
    } else if (scene === 4 || scene === 5 || scene === 6 || scene === 7) {
        lightning.setDepth(-0.21); // set initial alpha to 0
    }
  
    this.tweens.add({
        targets: lightning,
        alpha: 1,
        duration: 150,
        ease: 'Power2',
        yoyo: true,
        onComplete: () => {
            // Wait for two seconds, then play the sound_enemyF sound
            lightning.destroy(); // remove the overlay when the animation is complete
            this.time.addEvent({
                delay: 1000, // Delay in milliseconds
                callback: () => {
                    sound_thunder.play();
                },
                callbackScope: this
            });
        }
    });
}

function updateWaspBehavior(wasp) {
    // Calculate distance between enemy and player
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
      // Enemy is close to player, move towards player
      const angleToPlayer = Phaser.Math.Angle.Between(wasp.x, wasp.y, player.x, player.y);
      const speed = 3;
    
      //wasp.rotation = angleToPlayer; // Point towards player
      if (distanceToPlayer <= 500 && distanceToPlayer > 100 && player.alpha != 0) {
        // If not in attack mode, move towards player
        wasp.x += Math.cos(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
        wasp.y += Math.sin(angleToPlayer) * speed * 7 * (game.loop.delta / 100);
      } else if (distanceToPlayer <= 100 && player.alpha != 0) {
        // Enemy is in attack mode
        wasp.x += Math.cos(angleToPlayer) * speed * 35 * (game.loop.delta / 100);
        wasp.y += Math.sin(angleToPlayer) * speed * 35 * (game.loop.delta / 100);
      }
    }
  }