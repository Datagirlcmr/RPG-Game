/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import 'phaser';
import config from '../Config/config';
import forest from '../assets/forest1.jpg';
import platform from '../assets/platy.jpeg';
import player from '../assets/dude.png';
import coin from '../assets/coin.png';
import fire from '../assets/fire.png';

const gameOptions = {
  platformSpeedRange: [300, 300],
  spawnRange: [80, 300],
  platformSizeRange: [90, 300],
  platformHeightRange: [-5, 2],
  platformHeighScale: 20,
  platformVerticalLimit: [0.4, 0.8],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2,
  coinPercent: 50,
  firePercent: 15,
};

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    this.load.image('forest', forest);
    this.load.image('platform', platform);
    this.load.spritesheet('player', player, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet('coin', coin, { frameWidth: 20, frameHeight: 20 });
    this.load.spritesheet('fire', fire, { frameWidth: 40, frameHeight: 70 });
  }

  create() {
    this.add.image(400, 300, 'forest');

    localStorage.setItem('scoreSaved', false);
    this.model = this.sys.game.globals.model;
    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#cb5354' });
    this.addedPlatforms = 0;
    this.platformGroup = this.add.group({
      removeCallback(platform) {
        platform.scene.platformPool.add(platform);
      },
    });

    this.platformPool = this.add.group({
      removeCallback(platform) {
        platform.scene.platformGroup.add(platform);
      },
    });

    this.coinGroup = this.add.group({
      removeCallback(coin) {
        coin.scene.coinPool.add(coin);
      },
    });

    this.coinPool = this.add.group({
      removeCallback(coin) {
        coin.scene.coinGroup.add(coin);
      },
    });

    this.fireGroup = this.add.group({
      removeCallback(fire) {
        fire.scene.firePool.add(fire);
      },
    });

    this.firePool = this.add.group({
      removeCallback(fire) {
        fire.scene.fireGroup.add(fire);
      },
    });

    this.playerJumps = 0;
    this.addPlatform(config.width, config.width / 2, config.height * gameOptions.platformVerticalLimit[1]);
    this.player = this.physics.add.sprite(gameOptions.playerStartPosition, config.height * 0.7, 'player');
    this.player.setGravityY(gameOptions.playerGravity);
    this.dying = false;

    this.anims.create({
      key: 'run',
      frames: this.anims.generateFrameNumbers('player', {
        start: 5,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'rotate',
      frames: this.anims.generateFrameNumbers('coin', {
        start: 0,
        end: 5,
      }),
      frameRate: 15,
      yoyo: true,
      repeat: -1,
    });

    this.anims.create({
      key: 'burn',
      frames: this.anims.generateFrameNumbers('fire', {
        start: 0,
        end: 4,
      }),
      frameRate: 15,
      repeat: -1,
    });

    this.physics.add.collider(this.player, this.platformGroup, function () {
      if (!this.player.anims.isPlaying) {
        this.player.anims.play('run');
      }
    }, null, this);

    this.physics.add.overlap(this.player, this.coinGroup, function (player, coin) {
      this.tweens.add({
        targets: coin,
        y: coin.y - 100,
        alpha: 0,
        duration: 800,
        ease: 'Cubic.easeOut',
        callbackScope: this,
        onComplete() {
          this.score += 1;
          this.scoreText.setText(`Score: ${this.score}`);
          this.coinGroup.killAndHide(coin);
          this.coinGroup.remove(coin);
        },
      });
    }, null, this);

    this.physics.add.overlap(this.player, this.fireGroup, function (player, fire) {
      this.dying = true;
      this.player.anims.stop();
      this.player.setFrame(2);
      this.player.body.setVelocityY(-200);
      this.physics.world.removeCollider(this.platformCollider);
      this.model.score = this.score;
      this.scene.start('Game');
      this.scene.start('Over');
    }, null, this);

    this.input.on('pointerdown', this.jump, this);
  }

  addPlatform(platformWidth, posX, posY) {
    this.addedPlatforms++;
    let platform;
    if (this.platformPool.getLength()) {
      platform = this.platformPool.getFirst();
      platform.x = posX;
      platform.y = posY;
      platform.active = true;
      platform.visible = true;
      this.platformPool.remove(platform);
      // const newRatio = platformWidth / platform.displayWidth;
      platform.displayWidth = platformWidth;
      platform.tileScaleX = 1 / platform.scaleX;
    } else {
      platform = this.add.tileSprite(posX, posY, platformWidth, 22, 'platform');
      this.physics.add.existing(platform);
      platform.body.setImmovable(true);
      platform.body.setVelocityX(Phaser.Math.Between(gameOptions.platformSpeedRange[0], gameOptions.platformSpeedRange[1]) * -1);
      this.platformGroup.add(platform);
    }
    this.nextPlatformDistance = Phaser.Math.Between(gameOptions.spawnRange[0], gameOptions.spawnRange[1]);

    if (this.addedPlatforms > 1) {
      if (Phaser.Math.Between(1, 100) <= gameOptions.coinPercent) {
        if (this.coinPool.getLength()) {
          const coin = this.coinPool.getFirst();
          coin.x = posX;
          coin.y = posY - 96;
          coin.alpha = 1;
          coin.active = true;
          coin.visible = true;
          this.coinPool.remove(coin);
        } else {
          const coin = this.physics.add.sprite(posX, posY - 26, 'coin');
          coin.setImmovable(true);
          coin.setVelocityX(platform.body.velocity.x);
          coin.anims.play('rotate');
          this.coinGroup.add(coin);
        }
      }

      if (Phaser.Math.Between(1, 100) <= gameOptions.firePercent) {
        if (this.firePool.getLength()) {
          const fire = this.firePool.getFirst();
          fire.x = posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth);
          fire.y = posY - 46;
          fire.alpha = 1;
          fire.active = true;
          fire.visible = true;
          this.firePool.remove(fire);
        } else {
          const fire = this.physics.add.sprite(posX - platformWidth / 2 + Phaser.Math.Between(1, platformWidth), posY - 46, 'fire');
          fire.setImmovable(true);
          fire.setVelocityX(platform.body.velocity.x);
          fire.setSize(8, 2, true);
          fire.anims.play('burn');
          fire.setDepth(2);
          this.fireGroup.add(fire);
        }
      }
    }
  }

  jump() {
    if ((!this.dying) && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;

      this.player.anims.stop();
    }
  }

  update() {
    const cursorKey = this.input.keyboard.createCursorKeys();
    const didPressJump = Phaser.Input.Keyboard.JustDown(cursorKey.up);

    if (didPressJump && (this.player.body.touching.down || (this.playerJumps > 0 && this.playerJumps < gameOptions.jumps))) {
      if (this.player.body.touching.down) {
        this.playerJumps = 0;
      }
      this.player.setVelocityY(gameOptions.jumpForce * -1);
      this.playerJumps++;
    }

    if (this.player.y > config.height) {
      this.model.score = this.score;
      this.scene.start('Game');
      this.scene.start('Over');
    }
    this.player.x = gameOptions.playerStartPosition;

    let minDistance = config.width;
    let rightmostPlatformHeight = 0;
    this.platformGroup.getChildren().forEach(function (platform) {
      const platformDistance = config.width - platform.x - platform.displayWidth / 2;
      if (platformDistance < minDistance) {
        minDistance = platformDistance;
        rightmostPlatformHeight = platform.y;
      }
      if (platform.x < -platform.displayWidth / 2) {
        this.platformGroup.killAndHide(platform);
        this.platformGroup.remove(platform);
      }
    }, this);

    this.coinGroup.getChildren().forEach(function (coin) {
      if (coin.x < -coin.displayWidth / 2) {
        this.coinGroup.killAndHide(coin);
        this.coinGroup.remove(coin);
      }
    }, this);

    this.fireGroup.getChildren().forEach(function (fire) {
      if (fire.x < -fire.displayWidth / 2) {
        this.fireGroup.killAndHide(fire);
        this.fireGroup.remove(fire);
      }
    }, this);

    if (minDistance > this.nextPlatformDistance) {
      const nextPlatformWidth = Phaser.Math.Between(gameOptions.platformSizeRange[0], gameOptions.platformSizeRange[1]);
      const platformRandomHeight = gameOptions.platformHeighScale * Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]);
      const nextPlatformGap = rightmostPlatformHeight + platformRandomHeight;
      const minPlatformHeight = config.height * gameOptions.platformVerticalLimit[0];
      const maxPlatformHeight = config.height * gameOptions.platformVerticalLimit[1];
      const nextPlatformHeight = Phaser.Math.Clamp(nextPlatformGap, minPlatformHeight, maxPlatformHeight);
      this.addPlatform(nextPlatformWidth, config.width + nextPlatformWidth / 2, nextPlatformHeight);
    }
  }
}