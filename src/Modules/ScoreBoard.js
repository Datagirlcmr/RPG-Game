/* eslint-disable class-methods-use-this */
import 'regenerator-runtime';

export default class ScoreBoard {
  constructor() {
    this.data = true;
  }

  async newScore() {
    if (localStorage.getItem('scoreSaved') === 'false') {
      localStorage.setItem('scoreSaved', true);
      const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/ySMFTBvzBtxK674PF31a/scores/';
      const data = {
        user: localStorage.getItem('userName'),
        score: localStorage.getItem('score'),
      };
      const response = await fetch(url, {
        mode: 'cors',
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.json();
    }
    return false;
  }

  async getScores() {
    const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/ySMFTBvzBtxK674PF31a/scores/';
    const response = await fetch(url, {
      mode: 'cors',
    });
    return response.json();
  }
}