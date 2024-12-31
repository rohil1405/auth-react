import { render, screen, fireEvent } from "@testing-library/react";
import InputField from "./InputField";

const mockOnChange = jest.fn();

describe("InputField Component", () => {
  it("renders the input field correctly", () => {
    render(
      <InputField
        type="text"
        value="test"
        placeholder="Enter text"
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue("test");
  });

  it("calls onChange when the input value changes", () => {
    render(
      <InputField
        type="text"
        value="test"
        placeholder="Enter text"
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    fireEvent.change(inputElement, { target: { value: "new text" } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });
;

  it("should have correct type attribute", () => {
    render(
      <InputField
        type="password"
        value="test"
        placeholder="Enter password"
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter password");
    expect(inputElement).toHaveAttribute("type", "password");
  });

  it("should display the correct value", () => {
    render(
      <InputField
        type="text"
        value="initial value"
        placeholder="Enter text"
        onChange={mockOnChange}
      />
    );

    const inputElement = screen.getByPlaceholderText("Enter text");
    expect(inputElement).toHaveValue("initial value");
  });
}
);
