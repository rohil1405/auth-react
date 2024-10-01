import Swal from "sweetalert2";

const fetchAllProducts = async () => {
  const firebaseDatabaseURL = `https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json`;

  try {
    const response = await fetch(firebaseDatabaseURL, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    const data = await response.json();
    return Object.entries(data).map(([key, value]) => ({
      ...(value as object), 
      firebaseId: key,
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const updateProduct = async (updatedProduct: any) => {
  const productId = updatedProduct.id; 

  try {
    const allProducts = await fetchAllProducts();

    const productsToUpdate = allProducts.filter((p: any) => p.id === productId);

    for (const product of productsToUpdate) {
      const firebaseDatabaseURL = `https://rolereact-f4a63-default-rtdb.firebaseio.com/products/${product.firebaseId}.json`;

      const response = await fetch(firebaseDatabaseURL, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct), 
      });

      if (!response.ok) {
        throw new Error(`Failed to update product with ID: ${productId}`);
      }
    }

    Swal.fire("Success!", "Products updated successfully!", "success");
    return true;
  } catch (error) {
    console.error("Error updating products:", error);
    throw error;
  }
};
