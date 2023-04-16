let beeIcon, bigLasers, camera, chargeReady, clickBButton, clickBButton2, clouds, clouds2, clouds3, cursors, didPressUp, didPressW, didPressSpace, enemy, enewee, emitter;
let lasers, livesText, liveBG, mountains, overlay, overlay2, platforms, player, triggerPlatform, triggerPlatformBack, triggerPlatformDeath, treeTexture;
let isMusicPlaying, sound_beeconWalk, sound_beeconJump, sound_laser, sound_bigLaser, sound_drill, sound_enemyF, sound_beeconF, sound_beeconHit, sound_rain, sound_rain2;
let sound_thunder, sound_laserHit, sound_mushroomJump, sound_titleTheme, sound_levelTheme, sound_enemyEnraged;
let canDoubleJump = true, isDrilling = false, jKeyDownTime = 0, lives = 99, timer = 0, hasJumped = true;
let scene, gameOverImage, randomText, emitterSpeedX;
let damageTint, startColor, endColor,keyA, keyD, keyJ, keyF, keyK, keyW, keyUP, keySpace, keyP;
let knockbackForce = 500, knockbackDirection, megaTree, megaTreeCover;
let enemyLives, eneweeLives = 3, enemyGroup, eneweeGroup;
let lightning, delayLightningFirt, delayLightning, airPlatform, laser, jumpshrooms;
let isPaused = false, pauseText, pauseOverlay, distance;
let spiky = false, throttled = false, velocitySet = false, sound_eneweeAttack;

function decreaseLives() { if (!throttled) { lives -= 10; lives <= -1 ? livesText.setText('Energy: ' + 0) : updateLivesUI(); throttled = true; setTimeout(() => { throttled = false; }, 500); } }
function updateLivesUI() { livesText.setText('Energy: ' + lives); }
function enableKeys() { keyJ.enabled = true; keyW.enabled = true; keyUP.enabled = true; keySpace.enabled = true; keysDisabled = false; }
function toggleFullscreen() { if (game.scale.isFullscreen) { game.scale.stopFullscreen(); game.scale.setGameSize(1280, 720); } else { game.scale.startFullscreen(); } }

function shootLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left" || player.anims.currentAnim.key === "jumpBack") {
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
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left" || player.anims.currentAnim.key === "jumpBack") {
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
  } else {
    gameOverImage.create(player.x+320, game.config.height / 4, 'gameOver');
    gameOverImage.setOrigin(0.5).setAlpha(0.9).setDepth(3);
  }
}

// Function to create and animate the white overlay
function createOverlay() {

    if (scene === 1) {
        delayLightning = Phaser.Math.RND.integerInRange(5000, 45000);
    } else if (scene === 4 || scene === 5) {
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
    } else if (scene === 4 || scene === 5) {
        lightning.fillStyle(0xffffff, 0.95);
    }
    if (scene === 1 || scene === 4) {
        lightning.fillRect(-1000, 0, this.game.config.width * 4, this.game.config.height * 2);
    } else if (scene === 5) {
        lightning.fillRect(-1000, -10000, this.game.config.width * 4, this.game.config.height * 80);
    }
    lightning.setAlpha(0); // set initial alpha to 0
    if (scene === 1) {
        lightning.setDepth(-0.99); // set initial alpha to 0
    } else if (scene === 4) {
        lightning.setDepth(-0.21); // set initial alpha to 0
    }
  
    // Animate the overlay
    this.tweens.add({
        targets: lightning,
        alpha: 1,
        duration: 150,
        ease: 'Power2',
        yoyo: true,
        onComplete: function() {
            // Wait for two seconds, then play the sound_enemyF sound
            lightning.destroy(); // remove the overlay when the animation is complete
            this.time.addEvent({
                delay: 1000, // Delay in milliseconds
                callback: function() {
                    sound_thunder.play();
                },
                callbackScope: this
            });
        },
        onCompleteScope: this
    });
}