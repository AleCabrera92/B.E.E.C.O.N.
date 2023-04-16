class Preload extends Phaser.Scene {

    constructor() {
      super({ key: 'Preload' });
    }
  
    preload() {

        this.load.spritesheet('beecon_full', 'assets/beecon_full.png', { frameWidth: 250, frameHeight: 250 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 350, frameHeight: 300 });
        this.load.spritesheet('enewee', 'assets/enewee.png', { frameWidth: 336, frameHeight: 504 });

        this.load.image('sky', 'assets/sky.png');                               this.load.image('platform', 'assets/platform.png');
        this.load.image('breakableGround', 'assets/breakablePlatform.png');     this.load.image('wall', 'assets/wall.png');
        this.load.image('mountains', 'assets/mountains.png');                   this.load.image('laser', 'assets/laser.png');
        this.load.image('bigLaser', 'assets/bigLaser.png');                     this.load.image('chargeReady', 'assets/chargeReady.png');
        this.load.image('clouds', 'assets/cloud.png');                          this.load.image('gameOver', 'assets/gameOver.png');
        this.load.image('tree', 'assets/tree.png');                             this.load.image('grass', 'assets/grass.png');
        this.load.image('rain', 'assets/rain.png');                             this.load.image('ground', 'assets/ground.png');
        this.load.image('skyOverlay', 'assets/skyOverlay.png');                 this.load.image('lifeBG', 'assets/lifeBG.png');
        this.load.audio('titleTheme', 'assets/audio/titleTheme.mp3');           this.load.audio('beeconWalk', 'assets/audio/beeconWalk.mp3');
        this.load.audio('beeconJump', 'assets/audio/beeconJump.mp3');           this.load.audio('laser', 'assets/audio/laser.mp3');
        this.load.audio('bigLaser', 'assets/audio/bigLaser.mp3');               this.load.audio('drill', 'assets/audio/drill.mp3');
        this.load.audio('enemyF', 'assets/audio/enemyF.mp3');                   this.load.audio('beeconF', 'assets/audio/beeconF.mp3');
        this.load.audio('rain', 'assets/audio/rain.mp3');                       this.load.audio('rain2', 'assets/audio/rain2.mp3');
        this.load.audio('laserHit', 'assets/audio/laserHit.mp3');               this.load.audio('beeconHit', 'assets/audio/beeconHit.mp3');
        this.load.audio('thunder', 'assets/audio/thunder.mp3');                 this.load.image('airPlatform', 'assets/platform.png');
        this.load.image('jumpshrooms', 'assets/jumpshrooms.png');               this.load.image('title', 'assets/title.png'); this.load.image('sky', 'assets/sky.png');
        this.load.image('beeIcon', 'assets/beeIcon.png');                       this.load.audio('mushroomJump', 'assets/audio/mushroomJump.mp3');
        this.load.audio('levelTheme', 'assets/audio/levelTheme.mp3');           this.load.audio('enemyEnraged', 'assets/audio/enemyEnraged.mp3');
        this.load.audio('eneweeAttack', 'assets/audio/eneweeAttack.mp3');       this.load.image('megaTree', 'assets/megaTree.png');
        this.load.image('megaTreeCover', 'assets/megaTreeCover.png');           this.load.image('treeTexture', 'assets/treeTexture.png');

    }

    create() {

        sound_titleTheme = this.sound.add('titleTheme', { loop: true }).setVolume(0.45);
        sound_levelTheme = this.sound.add('levelTheme', { loop: true }).setVolume(0.35);

        sound_beeconWalk = this.sound.add('beeconWalk').setVolume(0.25);        sound_beeconJump = this.sound.add('beeconJump'); sound_beeconJump.setVolume(0.25);
        sound_laser = this.sound.add('laser').setVolume(0.25);                  sound_bigLaser = this.sound.add('bigLaser').setVolume(0.15);
        sound_drill = this.sound.add('drill').setVolume(0.15);                  sound_enemyF = this.sound.add('enemyF').setVolume(0.25);
        sound_beeconF = this.sound.add('beeconF').setVolume(0.25);              sound_rain = this.sound.add('rain', { loop: true }).setVolume(0.10);
        sound_laserHit = this.sound.add('laserHit').setVolume(0.15);            sound_rain2 = this.sound.add('rain2', { loop: true }).setVolume(0.10);
        sound_beeconHit = this.sound.add('beeconHit').setVolume(0.25);          sound_thunder = this.sound.add('thunder').setVolume(0.75);  
        sound_mushroomJump = this.sound.add('mushroomJump').setVolume(0.25);    sound_enemyEnraged = this.sound.add('enemyEnraged').setVolume(0.25);
        sound_eneweeAttack = this.sound.add('eneweeAttack').setVolume(0.15);

        this.scene.start('First');

    }

    update() {



    }

  }