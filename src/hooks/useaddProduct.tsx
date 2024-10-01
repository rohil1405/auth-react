const firebaseDatabaseURL =
  "https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json";

export const addProductsToFirebase = async () => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error("Failed to fetch products from fake API");
    }
    const products = await response.json();

    const limitedProducts = products.slice(0, 20);

    for (const product of limitedProducts) {
      try {
        const postResponse = await fetch(firebaseDatabaseURL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        });

        if (!postResponse.ok) {
          throw new Error(`Failed to post product: ${product.title}`);
        }
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
};

addProductsToFirebase();

export {};
