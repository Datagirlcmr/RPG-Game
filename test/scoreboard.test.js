import ScoreBoard from '../src/Modules/ScoreBoard';

jest.mock('../src/Modules/ScoreBoard');
describe('Test for the implementation of the Leaderboard API', () => {
  const sb = new ScoreBoard();
  it('Returns all the scores saved with the API', async () => {
    sb.getScores.mockResolvedValue({ result: [{ user: 'Selly', score: 25 }] });
    const recievedScore = await sb.getScores();
    expect(recievedScore).toEqual({ result: [{ user: 'Selly', score: 25 }] });
  });
});