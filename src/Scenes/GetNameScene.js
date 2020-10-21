/* eslint-disable class-methods-use-this */
/* eslint-disable func-names */
/* eslint-disable no-undef */
import 'phaser';
import getName from '../assets/html/getName.html';
import config from '../Config/config';
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
    this.model = this.sys.game.globals.model;
    this.title = this.add.text(0, 0, 'Please enter your name', { fontSize: '32px', fill: '#fff' });
    this.zone = this.add.zone(config.width / 2, config.height / 2, config.width, config.height);
    this.form = this.add.dom(400, 300).createFromHTML(getName, 'div');
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
    Phaser.Display.Align.In.Center(
      this.title,
      this.zone,
    );
    this.title.setY(80);
    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.model.bgMusicPlaying = true;
      this.bgMusic.play();
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }
}