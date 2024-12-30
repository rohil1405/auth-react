import { render, screen, fireEvent } from "@testing-library/react";
import CartModal from "./CartModal";

describe("CartModal Component", () => {
  const mockOnClose = jest.fn();
  const mockSetReviewDescription = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    reviewDescription: "Test review",
    setReviewDescription: mockSetReviewDescription,
    onSubmit: mockOnSubmit,
    productId: "12345",
  };

  const renderComponent = (props = defaultProps) =>
    render(<CartModal {...props} />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the modal when `isOpen` is true", () => {
    renderComponent();
    expect(screen.getByText("Review and Description")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "Add any additional notes or descriptions here..."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("should not render the modal when `isOpen` is false", () => {
    renderComponent({ ...defaultProps, isOpen: false });
    expect(
      screen.queryByText("Review and Description")
    ).not.toBeInTheDocument();
  });

  it("should call `onClose` when the close button is clicked", () => {
    renderComponent();
    const closeButton = screen.getByAltText("cursor");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call `setReviewDescription` when textarea value changes", () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      "Add any additional notes or descriptions here..."
    );
    fireEvent.change(textarea, { target: { value: "New review description" } });
    expect(mockSetReviewDescription).toHaveBeenCalledWith(
      "New review description"
    );
  });

  it("should call `onSubmit` with the correct productId when submit button is clicked", () => {
    renderComponent();
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledWith("12345");
  });

  it("should display the current reviewDescription in the textarea", () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText(
      "Add any additional notes or descriptions here..."
    );
    expect(textarea).toHaveValue("Test review");
  });
});
