class Test extends Phaser.Scene {

    constructor() {
        super({ key: 'Test' });
    }

    preload() { //Assets to preload for the scene
        this.load.tilemapTiledJSON('map', 'assets/beecon-tileset.json');
        this.load.image('tiles', 'assets/beecon-tileset.png');
    }

    create() {

        this.scale.refresh();

        scene = 0;
        enemyLives = 3;

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('beecon-tileset', 'tiles');
        const platforms = map.createLayer('Platforms', tileset, 0, 200);
        //platforms.setCollisionByExclusion(-1, true);
        const ground = map.createLayer('Ground', tileset, 0, 200);
        //ground.setCollisionByExclusion(-1, true);
    
    }

    update() {

   
    }



}