/* eslint-disable no-undef */
import 'phaser';

let game;

const gameOptions = {
  platformStartSpeed: 350,
  spawnRange: [100, 350],
  platformSizeRange: [50, 250],
  playerGravity: 900,
  jumpForce: 400,
  playerStartPosition: 200,
  jumps: 2,
};

// object containing configuration options

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  preload() {
    // load images
    // this.load.image('logo', 'assets/logo.png');
    this.load.image('platform', 'assets/platform.png');
    this.load.image('player', 'assets/player.png');
  }

  create() {
    // group with all active platforms.
    this.platformGroup = this.add.group({

      // once a platform is removed, it's added to the pool
      removeCallback(platform) {
        platform.platformPool.add(platform);
      },
    });

    this.platformPool = this.add.group({

      // once a platform is removed from the pool, it's added to the active platforms group
      removeCallback(platform) {
        platform.platformGroup.add(platform);
      },
    });
  }
}
