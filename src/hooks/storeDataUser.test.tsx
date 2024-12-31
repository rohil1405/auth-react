import storeUserData from './StoreDataUser';
import { auth } from '../utils/Firebase';

jest.mock('../utils/Firebase', () => ({
  auth: {
    currentUser: null,
    getIdToken: jest.fn(),
  },
}));

global.fetch = jest.fn();

describe('storeUserData', () => {
  const mockUserId = 'user123';
  const mockUserData = { name: 'Rohil Shah', email: 'rohil.shah@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should store user data successfully', async () => {
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue({
        getIdToken: jest.fn().mockResolvedValue('mockToken'),
      }),
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({ message: 'User data stored successfully' }),
    });

    await storeUserData(mockUserId, mockUserData);

    expect(fetch).toHaveBeenCalledWith(
      `https://rolereact-f4a63-default-rtdb.firebaseio.com/users/${mockUserId}.json?auth=mockToken`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mockUserData),
      }
    );
  });
});
