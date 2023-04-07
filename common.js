let player;
let platforms;
let cursors;
let canDoubleJump = true;
let keyA, keyD, keyJ, keyF, keyK, keyW, keyUP, keySpace;
let mountains;
let camera;
let triggerPlatform;
let triggerPlatformBack;
let lasers;
let bigLasers;
let overlay, overlay2;
let didPressUp, didPressW, didPressSpace;
let chargeReady;
let jKeyDownTime = 0;
let isDrilling = false;
let timer = 0;
let clouds, clouds2, clouds3;
let enemy;
let emitter;
let lives = 99; // start with 3 lives
let bgm;
let isMusicPlaying;
let sound_beeconWalk, sound_beeconJump, sound_laser, sound_bigLaser, sound_drill, sound_enemyF, sound_beeconF, sound_rain, sound_laserHit;
let beeIcon, pressMeButton,pressMeButton2;

// create a text object to display the lives count
let livesText, liveBG;

function decreaseLives() {
    lives--;
    if (lives <= -1) {
      // game over
      //gameOver();
    } else {
      // update lives UI
      updateLivesUI();
    }
  }
  
  function updateLivesUI() {
    livesText.setText('Energy: ' + lives);
  }

function enableKeys() {
    keyJ.enabled = true;
    keyW.enabled = true;
    keyUP.enabled = true;
    keySpace.enabled = true;
    keysDisabled = false;
}

function toggleFullscreen() {
    if (game.scale.isFullscreen) {
      game.scale.stopFullscreen();
      game.scale.setGameSize(1280, 720);
      //game.canvas.style.cursor = 'default';
    } else {
      game.scale.startFullscreen();
      //game.canvas.style.cursor = 'none';
    }
}

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