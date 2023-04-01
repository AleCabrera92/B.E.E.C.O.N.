var player;
var platforms;
var cursors;
var canDoubleJump = true;
var jumps = 0;
var keyA, keyD, keyJ;
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

function shootLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left") {
        let laser = lasers.create(player.x - 30, player.y + 4, 'laser');
        laser.setVelocityX(-1000);
        laser.setAcceleration(0);
    } else {
        let laser = lasers.create(player.x + 30, player.y + 4, 'laser');
        laser.setVelocityX(1000);
        laser.setAcceleration(0);
    }
}

function shootBigLaser() {
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left") {
        let bigLaser = bigLasers.create(player.x - 30, player.y + 4, 'bigLaser');
        bigLaser.setVelocityX(-1000);
        bigLaser.setAcceleration(0);
    } else {
        let bigLaser = bigLasers.create(player.x + 30, player.y + 4, 'bigLaser');
        bigLaser.setVelocityX(1000);
        bigLaser.setAcceleration(0);
    }
}