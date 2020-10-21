/* eslint-disable no-underscore-dangle */
export default class Model {
  constructor() {
    this._soundOn = true;
    this._musicOn = true;
    this._bgMusicPlaying = false;
    this.scoreCount = 0;
    this.userNa = 'no name';
    this.leader = false;
    localStorage.setItem('userName', 'no name');
  }

  set musicOn(value) {
    this._musicOn = value;
  }

  get musicOn() {
    return this._musicOn;
  }

  set soundOn(value) {
    this._soundOn = value;
  }

  get soundOn() {
    return this._soundOn;
  }

  set bgMusicPlaying(value) {
    this._bgMusicPlaying = value;
  }

  get bgMusicPlaying() {
    return this._bgMusicPlaying;
  }

  set score(value) {
    this.scoreCount = value;
    localStorage.setItem('score', value);
  }

  get score() {
    return this.scoreCount;
  }

  set userName(value) {
    this.userNa = value;
    localStorage.setItem('userName', value);
  }

  get userName() {
    return this.userNa;
  }

  set leaderboard(value) {
    this.leader = value;
  }

  get leaderboard() {
    return this.leader;
  }
}
