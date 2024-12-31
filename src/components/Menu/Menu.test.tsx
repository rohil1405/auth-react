import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import Menu from "./Menu";

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Menu Component", () => {
  const mockMenuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows Login button when user is not logged in", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback(null); 
      return jest.fn(); 
    });

    render(
      <MemoryRouter>
        <Menu menuItems={mockMenuItems} />
      </MemoryRouter>
    );

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
  });

  test("shows Logout button when user is logged in", () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({ uid: "12345" });
      return jest.fn(); 
    });

    render(
      <MemoryRouter>
        <Menu menuItems={mockMenuItems} />
      </MemoryRouter>
    );

    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.queryByText("Login")).not.toBeInTheDocument();
  });

  test("handles logout functionality", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({ uid: "12345" }); // Mock a logged-in user
      return jest.fn(); // Mock unsubscribe function
    });
  
    (signOut as jest.Mock).mockResolvedValueOnce(undefined); // Explicitly provide `undefined`
  
    render(
      <MemoryRouter>
        <Menu menuItems={mockMenuItems} />
      </MemoryRouter>
    );
  
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
  
    expect(signOut).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/login"));
  });
  

  test("handles logout error gracefully", async () => {
    (onAuthStateChanged as jest.Mock).mockImplementation((auth, callback) => {
      callback({ uid: "12345" }); 
      return jest.fn();
    });

    const error = new Error("Sign out failed");
    (signOut as jest.Mock).mockRejectedValueOnce(error);

    render(
      <MemoryRouter>
        <Menu menuItems={mockMenuItems} />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalled();
    await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled()); 
  });
}
);
