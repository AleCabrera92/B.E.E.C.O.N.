var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
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
        update: update
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
}

function create ()
{
    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 450, 'ground').setScale(0.5).refreshBody();
    platforms.create(400, 400, 'ground').setScale(0.5).refreshBody();
    platforms.create(50, 350, 'ground').setScale(0.5).refreshBody();
    platforms.create(200, 300, 'ground').setScale(0.5).refreshBody();
    platforms.create(600, 250, 'ground').setScale(0.5).refreshBody();
    platforms.create(50, 200, 'ground').setScale(0.5).refreshBody();
    platforms.create(750, 200, 'ground').setScale(0.5).refreshBody();
    platforms.create(350, 150, 'ground').setScale(0.5).refreshBody();
    platforms.create(200, 100, 'ground').setScale(0.5).refreshBody();
    platforms.create(600, 100, 'ground').setScale(0.5).refreshBody();

    // The player and its settings
    player = this.physics.add.sprite(100, 500, 'dude');

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

}

function update ()
{
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
