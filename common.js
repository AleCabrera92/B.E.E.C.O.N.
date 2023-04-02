var player;
var platforms;
var cursors;
var canDoubleJump = true;
var jumps = 0;
var keyA, keyD, keyJ, keyF;
var mountains;
var camera;
var triggerPlatform;
var lasers;
var bigLasers;
var fullscreenButton = document.getElementById('fullscreenButton');
var overlay;
var didPressUp, didPressW, didPressSpace;
var chargeReady;
var jKeyDownTime = 0;

function toggleFullscreen() {
    if (game.scale.isFullscreen) {
      game.scale.stopFullscreen();
      game.scale.setGameSize(1280, 720);
    } else {
      game.scale.startFullscreen();
    }
}

function shootLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left" || player.anims.currentAnim.key === "jumpBack") {
        let laser = lasers.create(player.x - 30, player.y + 4, 'laser');
        laser.setVelocityX(-1000);
        laser.setAcceleration(0);
    } else {
        let laser = lasers.create(player.x + 30, player.y + 4, 'laser' || player.anims.currentAnim.key === "jump");
        laser.setVelocityX(1000);
        laser.setAcceleration(0);
    }
}

function shootBigLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left" || player.anims.currentAnim.key === "jumpBack") {
        let bigLaser = bigLasers.create(player.x - 30, player.y + 4, 'bigLaser');
        bigLaser.setVelocityX(-1000);
        bigLaser.setAcceleration(0);
    } else {
        let bigLaser = bigLasers.create(player.x + 30, player.y + 4, 'bigLaser' || player.anims.currentAnim.key === "jump");
        bigLaser.setVelocityX(1000);
        bigLaser.setAcceleration(0);
    }
}