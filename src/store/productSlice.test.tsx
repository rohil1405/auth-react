import productsReducer, { setProducts } from './productSlice';
import { Product } from '../components/Product/ProductData';

describe('productsSlice', () => {
  const initialState = { products: [] };

  it('should return the initial state when passed an empty action', () => {
    const result = productsReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('should handle setProducts and update the state', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Product 1',
        description: 'Description for Product 1',
        price: 100,
        category: 'Category 1',
        image: 'image1.jpg',
        rating: {
          rate: 4.5,
          count: 10,
        },
        firebaseId: '',
      },
      {
        id: 2,
        title: 'Product 2',
        description: 'Description for Product 2',
        price: 200,
        category: 'Category 2',
        image: 'image2.jpg',
        rating: {
          rate: 4.0,
          count: 5,
        },
        firebaseId: '',
      },
    ];

    const action = setProducts(mockProducts);
    const result = productsReducer(initialState, action);

    expect(result.products).toHaveLength(2);
    expect(result.products).toEqual(mockProducts);
  });

  it('should overwrite existing products when setProducts is called again', () => {
    const initialProductsState = {
      products: [
        {
          id: 1,
          title: 'Old Product',
          description: 'Old Description',
          price: 50,
          category: 'Old Category',
          image: 'old-image.jpg',
          rating: {
            rate: 3.0,
            count: 20,
          },
          firebaseId: 'old-firebase-id',
        },
      ],
    };

    const newProducts: Product[] = [
      {
        id: 2,
        title: 'New Product',
        description: 'New Description',
        price: 150,
        category: 'New Category',
        image: 'new-image.jpg',
        rating: {
          rate: 4.5,
          count: 8,
        },
        firebaseId: 'new-firebase-id',
      },
    ];

    const action = setProducts(newProducts);
    const result = productsReducer(initialProductsState, action);

    expect(result.products).toHaveLength(1);
    expect(result.products).toEqual(newProducts);
  });
});
