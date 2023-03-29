var player;
var platforms;
var cursors;
var canDoubleJump = true;
var jumps = 0;
var keyA, keyD;
var mountains;
var camera;
var triggerPlatform;

class Scene2 extends Phaser.Scene {

    constructor() {
      super({ key: 'Scene2' });
    }

    preload() {
        this.load.image('wall', 'assets/wall.png');
        this.load.spritesheet('beecon', 'assets/beecon.png', { frameWidth: 250, frameHeight: 210 });
        this.load.spritesheet('beecon_idle', 'assets/beecon_idle.png', { frameWidth: 250, frameHeight: 210 });
        this.load.image('mountains', 'assets/background2.png');
        this.load.image('mountains2', 'assets/background.png');
    }

    create() {
        console.log(this.image);
    mountains = this.physics.add.staticGroup();
    for (var i = 0; i <= 1; i++) {
        mountains.create(i * 320, -320, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
        mountains.create(i * 320, 0, 'mountains').setScale(2).refreshBody().setScrollFactor(0.2);
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
    platforms.create(-300, 0, 'wall').setScale(1.5).refreshBody();
    platforms.create(-300, 400, 'wall').setScale(1.5).refreshBody();
    platforms.create(-300, 800, 'wall').setScale(1.5).refreshBody();
    platforms.create(600, 0, 'wall').setScale(1.5).refreshBody();
    platforms.create(600, 400, 'wall').setScale(1.5).refreshBody();
    platforms.create(600, 800, 'wall').setScale(1.5).refreshBody();
    platforms.create(900, 0, 'wall').setScale(1.5).refreshBody();
    platforms.create(900, 400, 'wall').setScale(1.5).refreshBody();
    platforms.create(900, 800, 'wall').setScale(1.5).refreshBody();
    platforms.create(1200, 0, 'wall').setScale(1.5).refreshBody();
    platforms.create(1200, 400, 'wall').setScale(1.5).refreshBody();
    platforms.create(1200, 800, 'wall').setScale(1.5).refreshBody();
    platforms.create(1500, 0, 'wall').setScale(1.5).refreshBody();
    platforms.create(1500, 400, 'wall').setScale(1.5).refreshBody();
    platforms.create(1500, 800, 'wall').setScale(1.5).refreshBody();

    triggerPlatform = this.physics.add.sprite(0, 1303, 'ground').setScale(5);

    // Enable physics for the trigger platform, but don't make it collide with the player or the other platforms
    triggerPlatform.setImmovable(true);
    triggerPlatform.body.allowGravity = false;
    //triggerPlatform.body.checkCollision.up = false;
    //triggerPlatform.body.checkCollision.left = false;
    //triggerPlatform.body.checkCollision.right = false;


    // The player and its settings
    player = this.physics.add.sprite(100, 0, 'beecon').setScale(0.3); // Set initial frame to face right
    player.body.setSize(120, 0);
    //player.body.setVelocityY(1000);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    
    // Add an overlap event between the player and the trigger platform
    this.physics.add.overlap(player, triggerPlatform, function() {
        // Start the new scene
        this.scene.start('Scene3');
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
          // Create a black rectangle to serve as the overlay
          const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width*2,
            this.cameras.main.height*2,
            0x000000, // black color
            0.25 // alpha value, where 0 is fully transparent and 1 is fully opaque
          );
          overlay.setDepth(1); // set overlay to a higher depth than other game objects
    }

    update ()
    {
    
        // Update the camera position based on the player's position
        camera.scrollX = player.x - game.config.width / 4;
    
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