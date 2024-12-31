import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Resetpass from "./Resetpass";
import Swal from "sweetalert2";  

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

describe("Resetpass Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test("should render Resetpass form with initial email from location.state", () => {
    const email = "test@example.com";
    render(
      <MemoryRouter initialEntries={[{ pathname: "/resetpass", state: { email } }]}>
        <Routes>
          <Route path="/resetpass" element={<Resetpass />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue(email)).toBeInTheDocument();
  });

  // test("should toggle password visibility when clicking the eye icon", () => {
  //   render(
  //     <MemoryRouter>
  //       <Resetpass />
  //     </MemoryRouter>
  //   );

  //   const passwordInput = screen.getByPlaceholderText("Enter password");
  //   const eyeIcon = screen.getByAltText("showpass");

  //   expect(passwordInput).toHaveAttribute("type", "password");

  //   userEvent.click(eyeIcon);
  //   expect(passwordInput).toHaveAttribute("type", "text");

  //   userEvent.click(eyeIcon);
  //   expect(passwordInput).toHaveAttribute("type", "password");
  // });

  test("should enable the submit button when passwords match and are not empty", () => {
    render(
      <MemoryRouter>
        <Resetpass />
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");
    const confirmPasswordInput = screen.getByPlaceholderText("Enter Your Confirm Password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    expect(submitButton).toBeDisabled();

    userEvent.type(passwordInput, "password123");
    userEvent.type(confirmPasswordInput, "password123");

    expect(submitButton).toBeEnabled();
  });

  test("should call Swal and navigate when password is reset successfully", async () => {
    const email = "test@example.com";
    render(
      <MemoryRouter initialEntries={[{ pathname: "/resetpass", state: { email } }]}>
        <Routes>
          <Route path="/resetpass" element={<Resetpass />} />
        </Routes>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");
    const confirmPasswordInput = screen.getByPlaceholderText("Enter Your Confirm Password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    userEvent.type(passwordInput, "newpassword");
    userEvent.type(confirmPasswordInput, "newpassword");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ "1": { email: "test@example.com" } }),
      })
    ) as jest.Mock;

    userEvent.click(submitButton);

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "Password Reset" })));
  });

  test("should show error message if user not found during password reset", async () => {
    const email = "test@example.com";
    render(
      <MemoryRouter initialEntries={[{ pathname: "/resetpass", state: { email } }]}>
        <Routes>
          <Route path="/resetpass" element={<Resetpass />} />
        </Routes>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");
    const confirmPasswordInput = screen.getByPlaceholderText("Enter Your Confirm Password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    userEvent.type(passwordInput, "newpassword");
    userEvent.type(confirmPasswordInput, "newpassword");
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    userEvent.click(submitButton);

    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "User Not Found" })));
  });

  test("should show error message if password reset fails", async () => {
    const email = "test@example.com";
    render(
      <MemoryRouter initialEntries={[{ pathname: "/resetpass", state: { email } }]}>
        <Routes>
          <Route path="/resetpass" element={<Resetpass />} />
        </Routes>
      </MemoryRouter>
    );

    const passwordInput = screen.getByPlaceholderText("Enter password");
    const confirmPasswordInput = screen.getByPlaceholderText("Enter Your Confirm Password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    userEvent.type(passwordInput, "newpassword");
    userEvent.type(confirmPasswordInput, "newpassword");

    global.fetch = jest.fn(() => Promise.reject("Error")) as jest.Mock;

    userEvent.click(submitButton);
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "Error" })));
  });
}
);
