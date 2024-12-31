import { fetchAllProducts } from './updateProduct';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe('fetchAllProducts', () => {
  it('should fetch and map all products correctly', async () => {
    const mockData = {
      prod1: { id: 1, name: 'Product 1' },
      prod2: { id: 2, name: 'Product 2' },
    };

    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const products = await fetchAllProducts();

    expect(fetchMock).toHaveBeenCalledWith(
      'https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json',
      { method: 'GET' }
    );

    expect(products).toEqual([
      { id: 1, name: 'Product 1', firebaseId: 'prod1' },
      { id: 2, name: 'Product 2', firebaseId: 'prod2' },
    ]);
  });

  it('should throw an error if response is not ok', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });

    await expect(fetchAllProducts()).rejects.toThrow('Failed to fetch products.');
  });
});
