var config = {
    type: Phaser.AUTO,
    width: 1500,
    height: 840,
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
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game-container'
    }
};

var player;
var platforms;
var cursors;
var scoreText;
var canDoubleJump = true;
var jumps = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 57.26, frameHeight: 42 });
    this.load.image('mountains', 'assets/background2.png');
}


function create ()
{
    //  A simple background for our game
    this.add.image(0, 300, 'sky');
    this.add.image(1024, 300, 'sky');
    this.add.image(2048, 300, 'sky');
    mountains = this.physics.add.staticGroup();
    mountains.create(-320, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(0, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(320, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(640, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(960, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(1280, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(1600, 320, 'mountains').setScale(2).refreshBody();
    mountains.create(1920, 320, 'mountains').setScale(2).refreshBody();

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

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 668, 'ground').setScale(2).refreshBody();
    platforms.create(1200, 668, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(-750, 500, 'ground').setScale(3.8).refreshBody();
    platforms.create(-750, 600, 'ground').setScale(3.8).refreshBody();
    platforms.create(-750, 700, 'ground').setScale(3.8).refreshBody();
    platforms.create(-750, 800, 'ground').setScale(3.8).refreshBody();
    platforms.create(-750, 900, 'ground').setScale(3.8).refreshBody();
    platforms.create(500, 610, 'ground').setScale(0.8).refreshBody();
    platforms.create(500, 630, 'ground').setScale(0.8).refreshBody();
    platforms.create(950, 530, 'ground').setScale(0.8).refreshBody();
    platforms.create(950, 550, 'ground').setScale(0.8).refreshBody();
    platforms.create(950, 570, 'ground').setScale(0.8).refreshBody();
    platforms.create(950, 590, 'ground').setScale(0.8).refreshBody();
    platforms.create(950, 610, 'ground').setScale(0.8).refreshBody();
    platforms.create(950, 630, 'ground').setScale(0.8).refreshBody();
    platforms.create(1000, 610, 'ground').setScale(0.8).refreshBody();
    platforms.create(1000, 630, 'ground').setScale(0.8).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 0, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Collide the player and the stars with the platforms
    this.physics.add.collider(player, platforms);

    // Add the camera
    camera = this.cameras.main;
    // Set the initial camera position to the center of the world
    camera.scrollX = game.config.width * 2;
    camera.scrollY = 0;


    

}

function update ()
{

    // Update the camera position based on the player's position
    camera.scrollX = player.x - game.config.width / 4;

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    const didPressJump = Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP));

    // player can only double jump if the player just jumped
    if (didPressJump) {
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
