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

function shootLaser() {
    
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left") {
        // idle animation is playing, shoot laser to the left
        let laser = lasers.create(player.x - 30, player.y + 4, 'laser');
        laser.setVelocityX(-1000);
        laser.setAcceleration(0);
    } else {
        // other animation is playing, shoot laser to the right
        let laser = lasers.create(player.x + 30, player.y + 4, 'laser');
        laser.setVelocityX(1000);
        laser.setAcceleration(0);
    }
}

function shootBigLaser() {
    // Check if the "J" key has been held down for more than 2 seconds
    if (player.anims.currentAnim.key === "idleBack" || player.anims.currentAnim.key === "left") {
        // idle animation is playing, shoot laser to the left
        let bigLaser = bigLasers.create(player.x - 30, player.y + 4, 'bigLaser');
        bigLaser.setVelocityX(-1000);
        bigLaser.setAcceleration(0);
    } else {
        // other animation is playing, shoot laser to the right
        let bigLaser = bigLasers.create(player.x + 30, player.y + 4, 'bigLaser');
        bigLaser.setVelocityX(1000);
        bigLaser.setAcceleration(0);
    }
}

class Scene1 extends Phaser.Scene {

    constructor() {
      super({ key: 'Scene1' });
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('wall', 'assets/wall.png');
        this.load.spritesheet('beecon', 'assets/beecon.png', { frameWidth: 250, frameHeight: 210 });
        this.load.spritesheet('beecon_idle', 'assets/beecon_idle.png', { frameWidth: 250, frameHeight: 210 });
        this.load.image('mountains', 'assets/background2.png');
        this.load.image('mountains2', 'assets/background.png');
        this.load.image('laser', 'assets/laser.png');
        this.load.image('bigLaser', 'assets/bigLaser.png');
    }

    create() {
        console.log(this.image);
    //  A simple background for our game
    for (var i = 0; i < 3; i++) {
        this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1);
    }
    mountains = this.physics.add.staticGroup();
    for (var i = 0; i <= 1; i++) {
        mountains.create(i * 320, 330, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
        mountains.create(i * 320, 600, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
    }

            // Set up fullscreen button
            const fullscreenButton = document.getElementById('fullscreenButton');
            fullscreenButton.addEventListener('click', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });





    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Now let's create some ledges
    platforms.create(-300, 400, 'wall').setScale(1.5).refreshBody();
    platforms.create(500, 650, 'ground').setScale(0.8).refreshBody();
    platforms.create(800, 570, 'ground').setScale(0.8).refreshBody();
    platforms.create(800, 650, 'ground').setScale(0.8).refreshBody();
    platforms.create(880, 650, 'ground').setScale(0.8).refreshBody();

    lasers = this.physics.add.group({
        allowGravity: false
    });
    this.physics.add.collider(lasers, platforms);

    bigLasers = this.physics.add.group({
        immovable: true,
        allowGravity: false
    });
    this.physics.add.collider(bigLasers, platforms, function(bigLaser) {
        bigLaser.setVelocityX(0);
        bigLaser.setAcceleration(0);
    });

    this.physics.add.collider(bigLasers, platforms);

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    for (var i = -1; i < 6; i++) {
        platforms.create(i * 240, 930, 'ground').setScale(2).refreshBody(); //300
        platforms.create(i * 240, 780, 'ground').setScale(2).refreshBody(); //300
    }


    triggerPlatform = this.physics.add.sprite(1700, 1303, 'ground').setScale(5);

    // Enable physics for the trigger platform, but don't make it collide with the player or the other platforms
    triggerPlatform.setImmovable(true);
    triggerPlatform.body.allowGravity = false;
    //triggerPlatform.body.checkCollision.up = false;
    //triggerPlatform.body.checkCollision.left = false;
    //triggerPlatform.body.checkCollision.right = false;


    // The player and its settings
    player = this.physics.add.sprite(100, 0, 'beecon').setScale(0.3); // Set initial frame to face right
    player.body.setSize(120, 0);

    this.physics.add.collider(bigLasers, player, function() {
        // Do something when the bigLaser collides with the beecon
    });
    
    
    // this.physics.add.collider(player, bigLasers, function(player, bigLaser) {
    //     if (player.body.touching.down && bigLaser.body.touching.up) {
    //         // make the big laser behave as a platform
    //         player.body.touching.down = false;
    //         player.body.blocked.down = false;
    //         player.body.velocity.y = -600;
    //     }
    // });

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    
    // Add an overlap event between the player and the trigger platform
    this.physics.add.overlap(player, triggerPlatform, function() {
        // Start the new scene
        this.scene.start('Scene2');
    }, null, this);

    //  Our player animation, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('beecon', { start: 0, end: 1 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('beecon', { start: 3, end: 4 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('beecon_idle', { start: 2, end: 3 }),
        frameRate: 10,
        repeat: -1       
      });

    this.anims.create({
        key: 'idleBack',
        frames: this.anims.generateFrameNumbers('beecon_idle', { start: 1, end: 0 }),
        frameRate: 10,
        repeat: -1       
    });

    //keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    //keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);

    // Add the camera
    camera = this.cameras.main;
    // Set the initial camera position to the center of the world
    camera.scrollX = game.config.width * 2;
    camera.scrollY = 0;
    /*
    mountains2 = this.physics.add.staticGroup();
    for (var i = 0; i <= 1; i++) {
        mountains2.create(i * 320, 730, 'mountains').setScale(1.2).refreshBody().setScrollFactor(0.7);
    }
    */
    
    }

    update ()
    {
    
        // Update the camera position based on the player's position
        camera.scrollX = player.x - game.config.width / 4;

        lasers.getChildren().forEach(laser => {
            if (laser.body.velocity.x === 0) {
                laser.destroy();
            }
        });
    
        if (cursors.left.isDown || keyA.isDown)
        {
            player.setVelocityX(-250);
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown || keyD.isDown)
        {
            player.setVelocityX(250);
            player.anims.play('right', true);
        }
        else
        {
            // set the player's horizontal velocity to 0 to stop movement
            player.setVelocityX(0);
    
            // check the current animation to determine which frame to display
            if (player.anims.currentAnim === null || player.anims.currentAnim.key === 'right') {
                player.anims.play('idle', true);
            } else if (player.anims.currentAnim.key === 'left') {
                player.anims.play('idleBack', true);
            }
        }

        //const didPressJ = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J));

        if (Phaser.Input.Keyboard.JustUp(keyJ)) {
            if (keyJ.duration > 1500) {
                // Check if the "J" key has been held down for more than 2 seconds
                shootBigLaser();
            } else {
                shootLaser();
            }
        }
   
        const didPressUp = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP));
        const didPressW = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W));
        const didPressSpace = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE));
    
        // player can only double jump if the player just jumped
        if (didPressUp || didPressW || didPressSpace) {
            if (player.body.onFloor()) {
                // player can only double jump if it is on the floor
                canDoubleJump = true;
                player.setVelocityY(-380);
            } else if (canDoubleJump) {
                // player can only jump 2x (double jump)
                canDoubleJump = false;
                player.setVelocityY(-350);
            }
        }
    }
}