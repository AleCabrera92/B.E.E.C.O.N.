class Title extends Phaser.Scene {
  constructor() {
    super({ key: 'Title' });
  }

  preload() {
    // Assets to preload for the scene
  }

  create() {

    this.scale.refresh();

    scene = 'title';

    overlay = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000).setOrigin(0).setDepth(1002);
    this.time.delayedCall(1000, function() { this.tweens.add({ targets: overlay, alpha: 0, duration: 1000, onComplete: function() { overlay.destroy(); } }); }, [], this);
    overlay2 = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000).setOrigin(0).setDepth(1000);
    this.time.delayedCall(3000, function() { this.tweens.add({ targets: overlay2, alpha: 0, duration: 1000, onComplete: function() { overlay2.destroy(); } }); }, [], this);
    this.time.delayedCall(850, function() { if (!sound_titleTheme.isPlaying) { sound_titleTheme.play(); } }, [], this);

    platforms = this.physics.add.staticGroup();
    player = this.physics.add.sprite(750, 600, 'beecon_full').setScale(0.3);
    player.body.setSize(120, 120);
    player.body.setOffset(65, 110);
    player.setCollideWorldBounds(true);
    platforms.create(this.game.canvas.width/2, this.game.canvas.height/3.5, 'title').setScale(0.518).refreshBody().setDepth(1001).setAlpha(1);

    for (let i = 0; i < 3; i++) {this.add.image(i * 1024, 300, 'sky').setScrollFactor(0.1).setDepth(-0.4)};

    clouds = this.physics.add.image(576, 100, 'clouds').setScrollFactor(0.13).setDepth(-0.3).setGravity(false).setAlpha(0.75);
    clouds.body.setVelocityX(-51); clouds.body.setCollideWorldBounds(false); clouds.body.allowGravity = false;
    clouds2 = this.physics.add.image(1500, 300, 'clouds').setScrollFactor(0.15).setDepth(-0.3).setGravity(false).setAlpha(0.75);
    clouds2.body.setVelocityX(-33); clouds2.body.setCollideWorldBounds(false); clouds2.body.allowGravity = false;
    clouds3 = this.physics.add.image(803, 500, 'clouds').setScrollFactor(0.17).setDepth(-0.3).setGravity(false).setAlpha(0.75);
    clouds3.body.setVelocityX(-22); clouds3.body.setCollideWorldBounds(false); clouds3.body.allowGravity = false;

    for (let i = 0; i < 4; i++) {platforms.create(i * 512, 760, 'ground').setScale(1).refreshBody()};

    this.physics.add.collider(player, platforms);
  
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    player.anims.play('left');
    player.setVelocityX(-250);

    if (language) {
      pressStartText = this.add.text(0, 0, 'PRESS ENTER TO START', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
      pressStartText.setPosition(this.game.canvas.width/2, this.game.canvas.height/1.8).setShadow(2, 2, '#000000', 2).setDepth(3);
    } else {
      pressStartText = this.add.text(0, 0, 'PULSA INTRO PARA EMPEZAR', {font: '32px Arial', fill: '#fff'}).setOrigin(0.5);
      pressStartText.setPosition(this.game.canvas.width/2, this.game.canvas.height/1.8).setShadow(2, 2, '#000000', 2).setDepth(3);
    }


    if (language) {
      startText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76, 'Start', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      optionsText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 50, 'Options', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      creditsText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 100, 'Credits', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      qText = this.add.text( this.game.canvas.width / 2.65, this.game.canvas.height / 1.76 - 20, 'Q (back)', { font: '16px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      //const eText = this.add.text( this.game.canvas.width / 1.6, this.game.canvas.height / 1.76 - 20, 'E (next)', { font: '16px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
    } else {
      startText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76, 'Jugar', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      optionsText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 50, 'Opciones', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      creditsText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 100, 'Créditos', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      qText = this.add.text( this.game.canvas.width / 2.65, this.game.canvas.height / 1.76 - 20, 'Q (volver)', { font: '16px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      //const eText = this.add.text( this.game.canvas.width / 1.6, this.game.canvas.height / 1.76 - 20, 'E (next)', { font: '16px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
    }
    menuItems = [startText, optionsText, creditsText];
    menuItems.forEach((item) => item.setVisible(false)); qText.setAlpha(0); //eText.setAlpha(0);

    if (language) {
      if (volume) {
        soundText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76, 'Sound ON', { font: '32px Arial', fill: '#ff0' } ).setOrigin(0.5).setDepth(3);
      } else {
        soundText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76, 'Sound OFF', { font: '32px Arial', fill: '#ff0' } ).setOrigin(0.5).setDepth(3);
      }
      if (tutorial) {
        tutorialText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 50, 'Tutorials ON', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      } else {
        tutorialText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 50, 'Tutorials OFF', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      }
      languageText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 100, 'Language ENGLISH', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
    } else {
      if (volume) {
        soundText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76, 'Sonido SÍ', { font: '32px Arial', fill: '#ff0' } ).setOrigin(0.5).setDepth(3);
      } else {
        soundText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76, 'Sonido NO', { font: '32px Arial', fill: '#ff0' } ).setOrigin(0.5).setDepth(3);
      }
      if (tutorial) {
        tutorialText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 50, 'Tutoriales SÍ', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      } else {
        tutorialText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 50, 'Tutoriales NO', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
      }
      languageText = this.add.text( this.game.canvas.width / 2, this.game.canvas.height / 1.76 + 100, 'Idioma ESPAÑOL', { font: '32px Arial', fill: '#fff' } ).setOrigin(0.5).setDepth(3);
    }
    menu2Items = [soundText, tutorialText, languageText];
    menu2Items.forEach((item) => item.setVisible(false));

    const boxWidth = 400; const boxHeight = 180; const boxX = this.game.canvas.width / 2 - boxWidth / 2; const boxY = this.game.canvas.height / 1.57 - boxHeight / 2;
    const graphics = this.add.graphics(); graphics.fillStyle(0x000000, 0.75); graphics.fillRect(boxX, boxY, boxWidth, boxHeight); graphics.setDepth(2); graphics.setAlpha(0);

    let menuVisible = false;
    let menu2Visible = false;
    let currentItem = 0;
    let current2Item = 0;

    this.timer = this.time.addEvent({ delay: 500, loop: true, callback: () => { if (!menuVisible && !menu2Visible) { pressStartText.visible = !pressStartText.visible; } } });

    this.input.keyboard.on('keydown', (event) => {
      if (!menuVisible && !menu2Visible) {
          if (event.code === 'Enter') {
            pressStartText.setVisible(false);
            menuItems.forEach((item) => item.setVisible(true));
            menuItems[currentItem].setFill('#ff0');
            menuVisible = true;
            graphics.setAlpha(1);
            qText.setAlpha(1);
            //eText.setAlpha(1);
          }
      } else if (menuVisible && !menu2Visible) {
          switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
              menuItems[currentItem].setFill('#fff');
              currentItem = (currentItem - 1 + menuItems.length) % menuItems.length;
              menuItems[currentItem].setFill('#ff0');
              break;
            case 'KeyS':
            case 'ArrowDown':
              menuItems[currentItem].setFill('#fff');
              currentItem = (currentItem + 1) % menuItems.length;
              menuItems[currentItem].setFill('#ff0');
              break;
            case 'KeyE':
            case 'Enter':
              switch (currentItem) {
                case 0:
                  this.scene.start('Scene1');
                  break;
                case 1:
                  menuItems.forEach((item) => item.setVisible(false));
                  menuVisible = false;
                  menu2Items.forEach((item) => item.setVisible(true));
                  menu2Visible = true;
                  break;
                case 2:
                  this.scene.start('Credits');
                  break;
              }
              break;
            case 'KeyQ':
              pressStartText.setVisible(true);
              menuItems.forEach((item) => item.setVisible(false));
              menuVisible = false;
              graphics.setAlpha(0);
              qText.setAlpha(0);
              //eText.setAlpha(0);
              break;
        }
      }  else if (menu2Visible && !menuVisible) {
          switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
              menu2Items[current2Item].setFill('#fff');
              current2Item = (current2Item - 1 + menu2Items.length) % menu2Items.length;
              menu2Items[current2Item].setFill('#ff0');
              break;
            case 'KeyS':
            case 'ArrowDown':
              menu2Items[current2Item].setFill('#fff');
              current2Item = (current2Item + 1) % menu2Items.length;
              menu2Items[current2Item].setFill('#ff0');
              break;
            case 'KeyE':
            case 'Enter':
              switch (current2Item) {
                case 0:
                    volume = !volume;
                    if (language) {soundText.setText(volume ? 'Sound ON' : 'Sound OFF');}
                    else {soundText.setText(volume ? 'Sonido SÍ' : 'Sonido NO');}   
                  break;
                case 1:
                    tutorial = !tutorial;
                    if (language) {tutorialText.setText(tutorial ? 'Tutorials ON' : 'Tutorials OFF');}
                    else {tutorialText.setText(tutorial ? 'Tutoriales SÍ' : 'Tutoriales NO');}    
                  break;
                case 2:
                    language = !language;
                    languageText.setText(language ? 'Language ENGLISH' : 'Idioma ESPAÑOL');
                    if (tutorial) {tutorialText.setText(language ? 'Tutorials ON' : 'Tutoriales SÍ');}
                    else {tutorialText.setText(language ? 'Tutorials OFF' : 'Tutoriales NO');}
                    if (volume) {soundText.setText(language ? 'Sound ON' : 'Sonido SÍ');}
                    else {soundText.setText(language ? 'Sound OFF' : 'Sonido NO');}
                    startText.setText(language ? 'Start' : 'Jugar');
                    optionsText.setText(language ? 'Options' : 'Opciones');
                    creditsText.setText(language ? 'Credits' : 'Créditos');
                    qText.setText(language ? 'Q (Back)' : 'Q (Volver)');
                    pressStartText.setText(language ? 'PRESS ENTER TO START' : 'PULSA INTRO PARA EMPEZAR');
                  break;
              }
              break;
            case 'KeyQ':
              menu2Items.forEach((item) => item.setVisible(false));
              menu2Visible = false;
              menuItems.forEach((item) => item.setVisible(true));
              menuVisible = true;
              break;
          }
        }
    });

  }

  update() {

    if (!volume) {
      game.sound.mute = true;
    } else {
      game.sound.mute = false;
    }

    if (clouds) {this.physics.world.wrap(clouds.body, clouds.width, true)};
    if (clouds2) {this.physics.world.wrap(clouds2.body, clouds2.width, true)};
    if (clouds3) {this.physics.world.wrap(clouds3.body, clouds3.width, true)};

    if (player.body.blocked.right) {
      player.anims.play('left', true);
        player.setVelocityX(-250);
        let delay1 = Phaser.Math.Between(0, 4000);
        let selfu1 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay1,
            callback: function() {
              player.setVelocityY(-380);
              selfu1.physics.world.gravity.y = 600;
              selfu1.tweens.add({ targets: selfu1.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jumpBack', true);
              selfu1.time.delayedCall(333.33, function() {
                player.anims.play('fallBack', true);
              }, [], this);
              selfu1.time.delayedCall(666.66, function() {
                player.anims.play('left', true);
              }, [], this);
            },
            loop: false
          });
        }
        let delay2 = Phaser.Math.Between(0, 4000);
        let selfu2 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay2,
            callback: function() {
              player.setVelocityY(-380);
              selfu2.physics.world.gravity.y = 600;
              selfu2.tweens.add({ targets: selfu2.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jumpBack', true);
              selfu2.time.delayedCall(333.33, function() {
                player.anims.play('fallBack', true);
              }, [], this);
              selfu2.time.delayedCall(666.66, function() {
                player.anims.play('left', true);
              }, [], this);
            },
            loop: false
          });
        }
      player.setVelocityX(-250);
    } else if (player.body.blocked.left) {
        player.anims.play('right', true);
        player.setVelocityX(250);
        let delay3 = Phaser.Math.Between(0, 4000);
        let selfu3 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay3,
            callback: function() {
              player.setVelocityY(-380);
              selfu3.physics.world.gravity.y = 600;
              selfu3.tweens.add({ targets: selfu3.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jump', true);
              selfu3.time.delayedCall(333.33, function() {
                player.anims.play('fall', true);
              }, [], this);
              selfu3.time.delayedCall(666.66, function() {
                player.anims.play('right', true);
              }, [], this);
            },
            loop: false
          });
        }
        let delay4 = Phaser.Math.Between(0, 4000);
        let selfu4 = this;
        if (Math.random() < 0.5) {
          this.time.addEvent({
            delay: delay4,
            callback: function() {
              player.setVelocityY(-380);
              selfu4.physics.world.gravity.y = 600;
              selfu4.tweens.add({ targets: selfu4.physics.world.gravity, y: 1200, duration: 250, ease: 'Linear' });
              player.anims.play('jump', true);
              selfu4.time.delayedCall(333.33, function() {
                player.anims.play('fall', true);
              }, [], this);
              selfu4.time.delayedCall(666.66, function() {
                player.anims.play('right', true);
              }, [], this);
            },
            loop: false
          }); 
        }   
    }

    player.on('animationcomplete-jump', function() {
      player.anims.play('idle', true);
    });

    player.on('animationcomplete-jumpBack', function() {
        player.anims.play('idleBack', true);
    });
    
    if (Phaser.Input.Keyboard.JustDown(keyF)) {toggleFullscreen()};

  }

  handleOptions() {
    const volumeText = this.add.text(
      this.game.canvas.width / 2,
      this.game.canvas.height / 2 + 150,
      'Volume: ON',
      { font: '32px Arial', fill: '#fff' }
    ).setOrigin(0.5);
  
    let isSoundOn = true;
    let menuVisible = false;
  
    const toggleSound = () => {
      isSoundOn = !isSoundOn;
      if (isSoundOn) {
        volumeText.setText('Volume: ON');
        this.sound.resumeAll();
      } else {
        volumeText.setText('Volume: OFF');
        this.sound.pauseAll();
      }
    };

    this.input.keyboard.on('keydown', (event) => {
      if (menuVisible) {
        switch (event.code) {
          case 'KeyD':
            toggleSound();
            break;
          case 'KeyQ':
            volumeText.setVisible(false);
            menuVisible = false;
            break;
        }
      }
    });
  }

  shutdown() {this.timer.remove()};

}  