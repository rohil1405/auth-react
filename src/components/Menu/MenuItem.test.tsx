import { adminItems, productItems } from './MenuItem';

describe('adminItems Array', () => {
  it('should contain all the correct items for admin', () => {
    expect(adminItems).toHaveLength(6); 
    expect(adminItems[0]).toEqual({ label: "Home", path: "/admin" });
    expect(adminItems[1]).toEqual({ label: "Add Product", path: "/admin/addproduct" });
    expect(adminItems[2]).toEqual({ label: "Add User", path: "/admin/adduser" });
    expect(adminItems[3]).toEqual({ label: "Product", path: "/admin/product" });
    expect(adminItems[4]).toEqual({ label: "Reviews", path: "/admin/reviews" });
    expect(adminItems[5]).toEqual({ label: "logout", path: '/login' });
  });
});

describe('productItems Array', () => {
  it('should contain all the correct items for product', () => {
    expect(productItems).toHaveLength(3); 
    expect(productItems[0]).toEqual({ label: "Home", path: "/product" });
    expect(productItems[1]).toEqual({ label: "My Orders", path: "/order" });
    expect(productItems[2]).toEqual({ label: "Add to Cart", path: "/cart" });
  });
}
);
