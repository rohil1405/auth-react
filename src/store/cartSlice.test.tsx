import cartReducer, {
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    loadCartFromLocalStorage,
  } from "./cartSlice";
  
  interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }

  describe("cartSlice", () => {
    const initialState = { items: [] };
  
    const mockItem: CartItem = {
      id: "1",
      title: "Test Item",
      price: 100,
      quantity: 1,
      image: "test-image.jpg",
    };
  
    it("should handle addToCart when the item does not exist", () => {
      const action = addToCart(mockItem);
      const state = cartReducer(initialState, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockItem);
    }
  );
  
    it("should handle addToCart when the item already exists", () => {
      const existingState = { items: [mockItem] };
      const updatedItem = { ...mockItem, quantity: 2 };
      const action = addToCart(updatedItem);
      const state = cartReducer(existingState, action);
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toEqual(3); 
    });
  
    it("should handle removeFromCart", () => {
      const existingState = { items: [mockItem] };
      const action = removeFromCart({ id: "1" });
      const state = cartReducer(existingState, action);
      expect(state.items).toHaveLength(0);
    });
  
    it("should handle incrementQuantity", () => {
      const existingState = { items: [mockItem] };
      const action = incrementQuantity({ id: "1" });
      const state = cartReducer(existingState, action);
      expect(state.items[0].quantity).toEqual(2);
    });
  
    it("should handle decrementQuantity when quantity is greater than 1", () => {
      const existingState = { items: [{ ...mockItem, quantity: 2 }] };
      const action = decrementQuantity({ id: "1" });
      const state = cartReducer(existingState, action);
      expect(state.items[0].quantity).toEqual(1);
    });
  
    it("should not decrementQuantity when quantity is 1", () => {
      const existingState = { items: [mockItem] };
      const action = decrementQuantity({ id: "1" });
      const state = cartReducer(existingState, action);
      expect(state.items[0].quantity).toEqual(1);
    });
  
    it("should handle clearCart", () => {
      const existingState = { items: [mockItem] };
      const action = clearCart();
      const state = cartReducer(existingState, action);
      expect(state.items).toHaveLength(0);
    });

    it("should handle loadCartFromLocalStorage", () => {
      const savedItems = [mockItem, { ...mockItem, id: "2", title: "Second Item" }];
      const action = loadCartFromLocalStorage(savedItems);
      const state = cartReducer(initialState, action);
      expect(state.items).toHaveLength(2);
      expect(state.items).toEqual(savedItems);
    });

  });
  