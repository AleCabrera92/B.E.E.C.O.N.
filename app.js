var config = {
    type: Phaser.AUTO,
    //width: 1500,
    //height: 840,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        //mode: Phaser.Scale.FIT,
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        //fullscreenTarget: 'game-container'
    }
};

var player;
var platforms;
var cursors;
var scoreText;
var canDoubleJump = true;
var jumps = 0;
var keyW, keyA, keyS, keyD;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.spritesheet('beecon', 'assets/beecon.png', { frameWidth: 250, frameHeight: 210 });
    this.load.image('mountains', 'assets/background2.png');
    this.load.image('mountains2', 'assets/background.png');
}


function create ()
{
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
    platforms.create(1530, 650, 'ground').setScale(0.8).refreshBody();
    platforms.create(1930, 650, 'ground').setScale(0.8).refreshBody();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    for (var i = -1; i < 6; i++) {
        platforms.create(i * 240, 930, 'ground').setScale(2).refreshBody(); //300
        platforms.create(i * 240, 780, 'ground').setScale(2).refreshBody(); //300
    }

    // The player and its settings
    player = this.physics.add.sprite(100, 0, 'beecon').setScale(0.28); // Set initial frame to face right

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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
    

}

function update ()
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
            player.setFrame(4);
        } else if (player.anims.currentAnim.key === 'left') {
            player.setFrame(0);
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
