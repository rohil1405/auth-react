import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { setProducts } from '../store/productSlice';
import { Product } from '../components/Product/ProductData'; 

const firebaseDatabaseURL = "https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json";

const fetchProductsFromFirebase = async (): Promise<Product[]> => {
  const response = await fetch(firebaseDatabaseURL);
  if (!response.ok) {
    throw new Error('Failed to fetch products from Firebase');
  }
  const data = await response.json();

  if (!data) return [];

  return Object.values(data);
};

export const useProducts = () => {
  const dispatch = useDispatch();

  return useQuery<Product[], Error>('products', fetchProductsFromFirebase, {
    onSuccess: (products) => {
      dispatch(setProducts(products));
    },
  });
};
