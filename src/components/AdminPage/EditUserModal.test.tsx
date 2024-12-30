import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditUserModal from "./EditUserModal";
import { UserData } from "../user-data/UserData";
import { getAuth } from "firebase/auth";
import Swal from "sweetalert2";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
}));

jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const mockUser: UserData = {
    id: 1,
    fullname: "Rohil Shah",
    email: "rohilshah@example.com",
    phone: "1234567890",
    password: 12345678,
    gender: "",
    dob: ""
};

describe("EditUserModal", () => {
  const mockOnClose = jest.fn();
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test("should render modal when open", () => {
    render(
      <EditUserModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText("Edit User")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter Your FullName")).toHaveValue(
      mockUser.fullname
    );
    expect(screen.getByPlaceholderText("Enter Your Email")).toHaveValue(
      mockUser.email
    );
  });

  test("should not render modal when closed", () => {
    render(
      <EditUserModal
        user={mockUser}
        isOpen={false}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
  });

  test("should toggle password visibility", () => {
    render(
      <EditUserModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const passwordInput = screen.getByPlaceholderText("Enter Your Password");
    const togglePasswordIcon = screen.getByAltText("password-visibility");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(togglePasswordIcon);

    expect(passwordInput).toHaveAttribute("type", "text");
    fireEvent.click(togglePasswordIcon);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  test("should call onUpdate when the form is submitted", async () => {
    render(
      <EditUserModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const submitButton = screen.getByText("Update");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockUser,
        fullname: "Rohil Shah",
        email: "rohilshah@example.com",
        phone: "1234567890",
        password: "password123",
      });
    });
  });

  test("should call onClose when the close button is clicked", () => {
    render(
      <EditUserModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const closeButton = screen.getByAltText("close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  test("should show Swal error if authentication token is missing", async () => {
    (getAuth as jest.Mock).mockReturnValueOnce({
      currentUser: { getIdToken: jest.fn().mockResolvedValue(null) },
    });

    render(
      <EditUserModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const submitButton = screen.getByText("Update");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        "Error!",
        "Authentication token is missing.",
        "error"
      );
    });
  });

  test("should show Swal success message if the user is updated successfully", async () => {
    const mockResponse = { ok: true };
    global.fetch = jest.fn().mockResolvedValue(mockResponse);

    render(
      <EditUserModal
        user={mockUser}
        isOpen={true}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const submitButton = screen.getByText("Update");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith("Success!", "User updated successfully.", "success");
      expect(mockOnUpdate).toHaveBeenCalled();
    });
  });

  test("should return null if modal is closed (isOpen false)", () => {
    render(
      <EditUserModal
        user={mockUser}
        isOpen={false}
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
  });
});
