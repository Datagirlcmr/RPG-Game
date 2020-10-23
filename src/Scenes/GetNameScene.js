/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable no-undef */
import 'phaser';
import getName from '../assets/html/getName.html';
import background from '../assets/forest1.jpg';

export default class GetNameScene extends Phaser.Scene {
  constructor() {
    super('Input');
  }

  preload() {
    this.load.image('background', background);
  }

  create() {
    this.add.image(400, 300, 'background');
    const { model } = this.sys.game.globals;
    this.title = this.add.text(150, 100, 'Please enter your name', { fontSize: '42px', fill: '#283021', fontWeight: 'bolder' });
    this.form = this.add.dom(300, 250).createFromHTML(getName, 'div');
    this.form.addListener('click');
    this.form.on('click', function (event) {
      if (event.target.name === 'setNameButton') {
        const userName = this.getChildByName('Name');
        if (userName.value !== '') {
          model.userName = userName.value;
          this.scene.scene.start('Title');
          this.scene.form.destroy();
        }
      }
    });

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.model.bgMusicPlaying = true;
      this.bgMusic.play();
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}