class Preload extends Phaser.Scene {

    constructor() {
      super({ key: 'Preload' });
    }
  
    preload() {

      this.load.spritesheet('babyWasp', 'assets/babyWasp.png', { frameWidth: 200, frameHeight: 200 });
      this.load.spritesheet('beecon_full', 'assets/beecon_full.png', { frameWidth: 250, frameHeight: 250 });
      this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 350, frameHeight: 300 });
      this.load.spritesheet('energyOrb', 'assets/energyOrb.png', { frameWidth: 100, frameHeight: 100 });
      this.load.spritesheet('enewee', 'assets/enewee.png', { frameWidth: 336, frameHeight: 504 });
      this.load.spritesheet('lilWasp', 'assets/lilWasp.png', { frameWidth: 412, frameHeight: 412 });
      this.load.spritesheet('wasp', 'assets/wasp.png', { frameWidth: 600, frameHeight: 600 });

      this.load.image('airPlatform', 'assets/platform.png');
      this.load.image('beeconF', 'assets/beeconF.png');
      this.load.image('beeIcon', 'assets/beeIcon.png');
      this.load.image('bigLaser', 'assets/bigLaser.png');
      this.load.image('branch', 'assets/branch.png');
      this.load.image('breakableBranch', 'assets/breakableBranch.png');
      this.load.image('breakableGround', 'assets/breakablePlatform.png');
      this.load.image('chargeReady', 'assets/chargeReady.png');
      this.load.image('chargeReadySpanish', 'assets/chargeReadySpanish.png');
      this.load.image('clouds', 'assets/cloud.png');
      this.load.image('enemyF', 'assets/enemyF.png');
      this.load.image('eneweeF', 'assets/eneweeF.png');
      this.load.image('gameOver', 'assets/gameOver.png');
      this.load.image('glow', 'assets/glow.png');
      this.load.image('grass', 'assets/grass.png');
      this.load.image('ground', 'assets/ground.png');
      this.load.image('jumpshrooms', 'assets/jumpshrooms.png');
      this.load.image('laser', 'assets/laser.png');
      this.load.image('leaf', 'assets/leaf.png');
      this.load.image('leavesBG', 'assets/leavesBG.png');
      this.load.image('lifeBG', 'assets/lifeBG.png');
      this.load.image('lilWaspF', 'assets/lilWaspF.png');
      this.load.image('megaTree', 'assets/megaTree.png');
      this.load.image('megaTreeCover', 'assets/megaTreeCover.png');
      this.load.image('mountains', 'assets/mountains.png');
      this.load.image('platform', 'assets/platform.png');
      this.load.image('rain', 'assets/rain.png');
      this.load.image('sky', 'assets/sky.png');
      this.load.image('ship', 'assets/ship.png');
      this.load.image('shipEngine', 'assets/shipEngine.png');
      this.load.image('skyEnding', 'assets/skyEnding.png');
      this.load.image('skyIntro', 'assets/skyIntro.png');
      this.load.image('skyOverlay', 'assets/skyOverlay.png');
      this.load.image('spaceRain', 'assets/spaceRain.png');
      this.load.image('spikes', 'assets/spikes.png');
      this.load.audio('thunder', 'assets/audio/thunder.mp3');
      this.load.image('title', 'assets/title.png');
      this.load.image('tree', 'assets/tree.png');
      this.load.image('treeFloor', 'assets/treeFloor.png');
      this.load.image('treeTexture', 'assets/treeTexture.png');
      this.load.image('trunk', 'assets/trunk.png');
      this.load.image('wall', 'assets/wall.png');
      this.load.image('waspF', 'assets/waspF.png');
      this.load.image('waspNest', 'assets/waspNest.png');
      this.load.image('waspNestBranch', 'assets/waspNestBranch.png');
      this.load.image('waspNestDoor', 'assets/waspNestDoor.png');
      this.load.image('waspNestPlatform', 'assets/waspNestPlatform.png');
      this.load.image('waspNestTexture', 'assets/waspNestTexture.png');
      this.load.image('waspNestTrunk', 'assets/waspNestTrunk.png');
      this.load.image('waspNestUnder', 'assets/waspNestUnder.png');

      this.load.audio('beeconF', 'assets/audio/beeconF.mp3');
      this.load.audio('beeconHit', 'assets/audio/beeconHit.mp3');
      this.load.audio('beeconJump', 'assets/audio/beeconJump.mp3');
      this.load.audio('beeconWalk', 'assets/audio/beeconWalk.mp3');
      this.load.audio('bigLaser', 'assets/audio/bigLaser.mp3');
      this.load.audio('drill', 'assets/audio/drill.mp3');
      this.load.audio('enemyF', 'assets/audio/enemyF.mp3');
      this.load.audio('enemyEnraged', 'assets/audio/enemyEnraged.mp3');
      this.load.audio('energyPick', 'assets/audio/energyPick.mp3');
      this.load.audio('eneweeAttack', 'assets/audio/eneweeAttack.mp3');
      this.load.audio('introTheme', 'assets/audio/introTheme.mp3');
      this.load.audio('laser', 'assets/audio/laser.mp3');
      this.load.audio('laserHit', 'assets/audio/laserHit.mp3');
      this.load.audio('level1Theme', 'assets/audio/level1Theme.mp3');
      this.load.audio('level2Theme', 'assets/audio/level2Theme.mp3');
      this.load.audio('level3Theme', 'assets/audio/level3Theme.mp3');
      this.load.audio('level4Theme', 'assets/audio/level4Theme.mp3');
      this.load.audio('mushroomJump', 'assets/audio/mushroomJump.mp3');
      this.load.audio('powerUp', 'assets/audio/powerUp.mp3');
      this.load.audio('rain', 'assets/audio/rain.mp3');
      this.load.audio('rain2', 'assets/audio/rain2.mp3');
      this.load.audio('titleTheme', 'assets/audio/titleTheme.mp3');

      // // Display loading progress
      // const progress = this.add.graphics();
      // this.load.on('progress', value => {
      //   progress.clear();
      //   progress.fillStyle(0xffffff, 1);
      //   progress.fillRect(0, this.game.config.height / 2, this.game.config.width * value, 50);
      // });

      // // Load complete
      // this.load.on('complete', () => {
      //   progress.destroy();
      //   this.scene.start('First');
      // });

    }

    create() {

      sound_introTheme = this.sound.add('introTheme', { loop: true }).setVolume(0.45);
      sound_level1Theme = this.sound.add('level1Theme', { loop: true }).setVolume(0.35);
      sound_level2Theme = this.sound.add('level2Theme', { loop: true }).setVolume(0.35);
      sound_level3Theme = this.sound.add('level3Theme', { loop: true }).setVolume(0.75);
      sound_level4Theme = this.sound.add('level4Theme', { loop: true }).setVolume(0.75);
      sound_titleTheme = this.sound.add('titleTheme', { loop: true }).setVolume(0.45);

      sound_beeconWalk = this.sound.add('beeconWalk').setVolume(0.25);        sound_beeconJump = this.sound.add('beeconJump'); sound_beeconJump.setVolume(0.25);
      sound_laser = this.sound.add('laser').setVolume(0.25);                  sound_bigLaser = this.sound.add('bigLaser').setVolume(0.15);
      sound_drill = this.sound.add('drill').setVolume(0.15);                  sound_enemyF = this.sound.add('enemyF').setVolume(0.25);
      sound_beeconF = this.sound.add('beeconF').setVolume(0.25);              sound_rain = this.sound.add('rain', { loop: true }).setVolume(0.10);
      sound_laserHit = this.sound.add('laserHit').setVolume(0.15);            sound_rain2 = this.sound.add('rain2', { loop: true }).setVolume(0.10);
      sound_beeconHit = this.sound.add('beeconHit').setVolume(0.25);          sound_thunder = this.sound.add('thunder').setVolume(0.75);  
      sound_mushroomJump = this.sound.add('mushroomJump').setVolume(0.25);    sound_enemyEnraged = this.sound.add('enemyEnraged').setVolume(0.25);
      sound_eneweeAttack = this.sound.add('eneweeAttack').setVolume(0.15);    sound_powerUp = this.sound.add('powerUp').setVolume(0.25);
      sound_energyPick = this.sound.add('energyPick').setVolume(0.25);

      this.anims.create({key: 'idle', frames: this.anims.generateFrameNumbers('beecon_full', { start: 8, end: 9 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'left', frames: this.anims.generateFrameNumbers('beecon_full', { start: 1, end: 0 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'right', frames: this.anims.generateFrameNumbers('beecon_full', { start: 4, end: 5 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'jump', frames: this.anims.generateFrameNumbers('beecon_full', { start: 14, end: 15 }), frameRate: 10, repeat: 0});
      this.anims.create({key: 'jumpBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 13, end: 12 }), frameRate: 10, repeat: 0});
      this.anims.create({key: 'idleBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 7, end: 6 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'glideBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 18, end: 19 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'glide', frames: this.anims.generateFrameNumbers('beecon_full', { start: 20, end: 21 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'fallBack', frames: this.anims.generateFrameNumbers('beecon_full', { start: 16, end: 17 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'fall', frames: this.anims.generateFrameNumbers('beecon_full', { start: 22, end: 23 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'drill', frames: this.anims.generateFrameNumbers('beecon_full', { start: 10, end: 11 }), frameRate: 30, repeat: -1});
      this.anims.create({key: 'beacon', frames: this.anims.generateFrameNumbers('beecon_full', { start: 24, end: 25 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'enemyChill', frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 1 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'enemyEnraged', frames: this.anims.generateFrameNumbers('enemy', { start: 2, end: 3 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'eneweeStill', frames: this.anims.generateFrameNumbers('enewee', { start: 0, end: 1 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'eneweeChill', frames: this.anims.generateFrameNumbers('enewee', { start: 2, end: 3 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'lilWaspChill', frames: this.anims.generateFrameNumbers('lilWasp', { start: 0, end: 2 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'waspChill', frames: this.anims.generateFrameNumbers('wasp', { start: 0, end: 2 }), frameRate: 10, repeat: -1});
      this.anims.create({key: 'waspAttack', frames: this.anims.generateFrameNumbers('wasp', { start: 3, end: 5 }), frameRate: 10, repeat: 0});
      this.anims.create({key: 'babyWaspChill', frames: this.anims.generateFrameNumbers('babyWasp', { start: 0, end: 3 }), frameRate: 10, repeat: -1});

      this.scene.start('First');

    }

    update() {
      // Update the scene here
    }

  }