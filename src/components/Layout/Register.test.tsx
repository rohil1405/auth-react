import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import Register from "./Register";

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../utils/Firebase", () => ({
  auth: {},
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("../../hooks/StoreDataUser", () => jest.fn());

jest.mock("react-datepicker", () => {
  return function MockDatePicker({
    onChange,
  }: {
    onChange: (date: Date) => void;
  }) {
    return (
      <input
        type="date"
        data-testid="mock-datepicker"
        onChange={(e) => onChange(new Date(e.target.value))}
      />
    );
  };
});


describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

  // it("renders all form fields correctly", () => {
  //   render(
  //     <MemoryRouter>
  //       <Register />
  //     </MemoryRouter>
  //   );

  //   expect(
  //     screen.getByPlaceholderText("Enter Your Full Name")
  //   ).toBeInTheDocument();
  //   expect(screen.getByPlaceholderText("Enter Your Email")).toBeInTheDocument();
  //   expect(
  //     screen.getByPlaceholderText("Enter Your Password")
  //   ).toBeInTheDocument();
  //   expect(
  //     screen.getByPlaceholderText("Confirm Your Password")
  //   ).toBeInTheDocument();
  //   expect(screen.getByPlaceholderText("dd-mm-yyyy")).toBeInTheDocument();
  //   expect(screen.getByText("Male")).toBeInTheDocument();
  //   expect(screen.getByText("Female")).toBeInTheDocument();
  //   expect(
  //     screen.getByPlaceholderText("Enter Your Phone Number")
  //   ).toBeInTheDocument();
  //   expect(screen.getByText("Submit")).toBeInTheDocument();
  // });

  it("shows error if passwords do not match", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Your Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Confirm Your Password"), {
      target: { value: "password456" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error",
        text: "Passwords do not match!",
        background: "#1F2732",
      });
    });
  });

  it("shows error if phone number is not 10 digits", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("Enter Your Phone Number"), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        icon: "error",
        title: "Error",
        text: "Phone number must be 10 digits long!",
        background: "#1F2732",
      });
    });
  });

  // it("handles Firebase registration errors", async () => {
  //   (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue({
  //     message: "Email already in use",
  //   });

  //   renderComponent();

  //   fireEvent.change(screen.getByPlaceholderText("Enter Your Email"), {
  //     target: { value: "rohil@example.com" },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText("Enter Your Password"), {
  //     target: { value: "password123" },
  //   });
  //   fireEvent.change(screen.getByPlaceholderText("Confirm Your Password"), {
  //     target: { value: "password123" },
  //   });
  //   fireEvent.click(screen.getByText("Submit"));

  //   await waitFor(() => {
  //     expect(Swal.fire).toHaveBeenCalledWith({
  //       icon: "error",
  //       title: "Error",
  //       text: "Email already in use",
  //       background: "#1F2732",
  //     });
  //   });
  // });

  it("toggles password visibility", () => {
    renderComponent();

    const passwordInput = screen.getByPlaceholderText("Enter Your Password");
    const toggleIcon = screen.getByAltText("toggle password visibility");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleIcon);
    expect(passwordInput).toHaveAttribute("type", "password");
  });
});
