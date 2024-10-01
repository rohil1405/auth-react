export interface Product {
    firebaseId: string;
    category: string;
    image: string;
    id: number;
    title: string;
    price: number;
    description: string;
    rating: {
      rate: number;
      count: number;
    }
  }
  