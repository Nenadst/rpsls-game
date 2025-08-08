import { fetchChoices, playGame, fetchRandomChoice } from '../gameApi';
import { API } from '../API';

jest.mock('../API', () => ({
  API: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));
const mockedAPI = API as jest.Mocked<typeof API>;

describe('Game API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchChoices', () => {
    test('fetches choices successfully', async () => {
      const mockChoices = [
        { id: 1, name: 'rock' },
        { id: 2, name: 'paper' },
        { id: 3, name: 'scissors' },
        { id: 4, name: 'lizard' },
        { id: 5, name: 'spock' },
      ];

      mockedAPI.get.mockResolvedValue({ data: mockChoices });

      const result = await fetchChoices();

      expect(mockedAPI.get).toHaveBeenCalledWith('/choices');
      expect(result).toEqual(mockChoices);
    });

    test('handles fetch choices error', async () => {
      const errorMessage = 'Network Error';
      mockedAPI.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchChoices()).rejects.toThrow(errorMessage);
    });
  });

  describe('playGame', () => {
    test('plays game successfully', async () => {
      const mockGameResult = {
        id: 'test-id',
        results: 'win',
        player: 1,
        computer: 3,
      };

      mockedAPI.post.mockResolvedValue({ data: mockGameResult });

      const result = await playGame(1);

      expect(mockedAPI.post).toHaveBeenCalledWith('/play', { player: 1 });
      expect(result).toEqual(mockGameResult);
    });

    test('handles play game error', async () => {
      const errorMessage = 'Invalid player choice';
      mockedAPI.post.mockRejectedValue(new Error(errorMessage));

      await expect(playGame(999)).rejects.toThrow(errorMessage);
    });
  });

  describe('fetchRandomChoice', () => {
    test('fetches random choice successfully', async () => {
      const mockRandomChoice = { id: 2, name: 'paper' };

      mockedAPI.get.mockResolvedValue({ data: mockRandomChoice });

      const result = await fetchRandomChoice();

      expect(mockedAPI.get).toHaveBeenCalledWith('/choice');
      expect(result).toEqual(mockRandomChoice);
    });

    test('handles fetch random choice error', async () => {
      const errorMessage = 'Random service unavailable';
      mockedAPI.get.mockRejectedValue(new Error(errorMessage));

      await expect(fetchRandomChoice()).rejects.toThrow(errorMessage);
    });
  });
});
