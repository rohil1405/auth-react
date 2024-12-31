import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "../../store/store";
import Login from "./Login";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

jest.mock("../../utils/Firebase", () => ({
  auth: jest.fn(),
}));

describe("Login Component", () => {
  const renderWithProviders = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>
    );
  };

  it("renders the login form", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter password/i)).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    renderWithProviders(<Login />);
    const passwordInput = screen.getByPlaceholderText(/Enter password/i);
    const toggleButton = screen.getByAltText(/showpass/i);

    expect(passwordInput).toHaveAttribute("type", "password");
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("shows error on invalid credentials", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockRejectedValue({
      message: "Invalid credentials",
    });

    renderWithProviders(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: "wrongemail@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Error!",
        text: "Invalid credentials. Please try again.",
        icon: "error",
        background: "#1F2732",
      });
    });
  });



  it("logs in user with valid credentials", async () => {
    (signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
      user: {
        uid: "user123",
        email: "user@gmail.com",
        displayName: "Test User",
      },
    });

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText(/Enter email/i), {
      target: { value: "user@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByText(/Submit/i));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Login Successful",
        text: "You have logged in successfully!",
        icon: "success",
        background: "#1F2732",
      });
    });
  });
}
);
