import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import Modal from "./Modal";
jest.mock("../../assets/price.png", () => "mockedPrice.png");

describe("Modal Component", () => {
  const mockProduct = {
    title: "Sample Product",
    image: "sample-image.jpg",
    description: "A great product",
    price: 100,
    rating: {
      count: 10,
    },
  };

  const mockOnClose = jest.fn();

  afterEach(cleanup);

  test("does not render Modal when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose} product={mockProduct} />
    );

    expect(screen.queryByText("Sample Product")).not.toBeInTheDocument();
  });

});
