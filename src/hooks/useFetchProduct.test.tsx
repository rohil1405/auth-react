import { fetchProductsFromFirebase } from './useFetchProduct';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('fetchProductsFromFirebase', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('fetches and returns products from Firebase', async () => {
    const mockResponse = {
      product1: { id: 1, name: 'Product 1', price: 100 },
      product2: { id: 2, name: 'Product 2', price: 200 },
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

    const products = await fetchProductsFromFirebase();
    expect(products).toEqual(Object.values(mockResponse));
    expect(fetchMock).toHaveBeenCalledWith('https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json');
  });

  it('returns an empty array when Firebase returns no products', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const products = await fetchProductsFromFirebase();
    expect(products).toEqual([]);
    expect(fetchMock).toHaveBeenCalledWith('https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json');
  });

  it('throws an error when the response is not OK', async () => {
    fetchMock.mockResponseOnce('', { status: 500 });

    await expect(fetchProductsFromFirebase()).rejects.toThrow('Failed to fetch products from Firebase');
    expect(fetchMock).toHaveBeenCalledWith('https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json');
  });

}
);
