import { addProductsToFirebase } from "./useaddProduct";

global.fetch = jest.fn();

describe("addProductsToFirebase", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("fetches products from the fake API and posts to Firebase", async () => {
    const mockProducts = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      description: `Description of Product ${i + 1}`,
    }));

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      })
      .mockResolvedValue({
        ok: true,
      });

    await addProductsToFirebase();

    expect(fetch).toHaveBeenCalledTimes(21);
    expect(fetch).toHaveBeenCalledWith("https://fakestoreapi.com/products");
    expect(fetch).toHaveBeenCalledWith(
      "https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String),
      })
    );
  });

  test("handles errors during fake API fetch", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await addProductsToFirebase();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching products:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  test("handles errors during posting products to Firebase", async () => {
    const mockProducts = Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      description: `Description of Product ${i + 1}`,
    }));

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      })
      .mockResolvedValueOnce({ ok: false });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await addProductsToFirebase();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error adding product:",
      expect.any(Error)
    );
    consoleErrorSpy.mockRestore();
  });

  test("limits products to 20 when posting to Firebase", async () => {
    const mockProducts = Array.from({ length: 25 }, (_, i) => ({
      id: i + 1,
      title: `Product ${i + 1}`,
      description: `Description of Product ${i + 1}`,
    }));

    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValue(mockProducts),
      })
      .mockResolvedValue({
        ok: true,
      });

    await addProductsToFirebase();

    expect(fetch).toHaveBeenCalledTimes(21);
  });
}
);
