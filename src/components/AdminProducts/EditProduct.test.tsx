import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import Swal from "sweetalert2";
import EditProduct from "./EditProduct";
import { updateProduct } from "./updateProduct";

jest.mock("./updateProduct", () => ({
  updateProduct: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("EditProduct Component", () => {
  const mockProduct = {
    id: 1,
    title: "Sample Product",
    category: "Electronics",
    price: 100,
    image: "sample.jpg",
    description: "A great product",
    rating: {
      rate: 4.5,
      count: 10,
    },
  };

  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders EditProduct component correctly", () => {
    render(
      <EditProduct product={mockProduct} onClose={mockOnClose} onUpdate={mockOnUpdate} />
    );

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Sample Product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Electronics")).toBeInTheDocument();
    expect(screen.getByDisplayValue("100")).toBeInTheDocument();
    expect(screen.getByDisplayValue("A great product")).toBeInTheDocument();
  });

  test("handles input changes correctly", () => {
    render(
      <EditProduct product={mockProduct} onClose={mockOnClose} onUpdate={mockOnUpdate} />
    );

    fireEvent.change(screen.getByDisplayValue("Sample Product"), {
      target: { value: "Updated Product" },
    });
    fireEvent.change(screen.getByDisplayValue("Electronics"), {
      target: { value: "Home Appliances" },
    });
    fireEvent.change(screen.getByDisplayValue("100"), {
      target: { value: "200" },
    });
    fireEvent.change(screen.getByDisplayValue("A great product"), {
      target: { value: "An updated great product" },
    });

    expect(screen.getByDisplayValue("Updated Product")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Home Appliances")).toBeInTheDocument();
    expect(screen.getByDisplayValue("200")).toBeInTheDocument();
    expect(screen.getByDisplayValue("An updated great product")).toBeInTheDocument();
  });

  test("handles form submission successfully", async () => {
    (updateProduct as jest.Mock).mockResolvedValueOnce({});

    render(
      <EditProduct product={mockProduct} onClose={mockOnClose} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(screen.getByText("Update Product"));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalledWith({
        ...mockProduct,
        title: "Sample Product",
        category: "Electronics",
        price: 100,
        image: "sample.jpg",
        description: "A great product",
      });
      expect(Swal.fire).toHaveBeenCalledWith("Success!", "Product updated successfully!", "success");
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockProduct,
        title: "Sample Product",
        category: "Electronics",
        price: 100,
        image: "sample.jpg",
        description: "A great product",
      });
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("handles form submission failure", async () => {
    (updateProduct as jest.Mock).mockRejectedValueOnce(new Error("Update failed"));

    render(
      <EditProduct product={mockProduct} onClose={mockOnClose} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(screen.getByText("Update Product"));

    await waitFor(() => {
      expect(updateProduct).toHaveBeenCalled();
      expect(Swal.fire).toHaveBeenCalledWith("Error!", "Update failed", "error");
    });
  });

  test("calls onClose when cancel button is clicked", () => {
    render(
      <EditProduct product={mockProduct} onClose={mockOnClose} onUpdate={mockOnUpdate} />
    );

    fireEvent.click(screen.getByRole("button", { name: /cursor/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  
}
);
