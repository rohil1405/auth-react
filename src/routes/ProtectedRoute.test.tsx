import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const mockStore = (state: any) => {
  return createStore(
    () => ({
      auth: state,
    })
  );
};

const renderWithStore = (store: any, children: React.ReactNode) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("ProtectedRoute Component", () => {
  it("should redirect to /login if the user is not authenticated", () => {
    const store = mockStore({
      isAuthenticated: false,
      role: "user", 
    });

    renderWithStore(store, (
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    ));

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });

  it("should redirect to /login if the user is authenticated but not an admin and is accessing an admin route", () => {
    const store = mockStore({
      isAuthenticated: true,
      role: "user", 
    });

    renderWithStore(store, (
      <ProtectedRoute isAdminRoute={true}>
        <div>Admin Content</div>
      </ProtectedRoute>
    ));

    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    expect(window.location.pathname).toBe("/login");
  });

  it("should render children if the user is authenticated and is not accessing an admin route", () => {
    const store = mockStore({
      isAuthenticated: true,
      role: "user", 
    });

    renderWithStore(store, (
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    ));

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should render children if the user is authenticated and is accessing an admin route with the correct role", () => {
    const store = mockStore({
      isAuthenticated: true,
      role: "admin",
    });

    renderWithStore(store, (
      <ProtectedRoute isAdminRoute={true}>
        <div>Admin Content</div>
      </ProtectedRoute>
    ));

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("should render children if the user is authenticated and is accessing a non-admin route", () => {
    const store = mockStore({
      isAuthenticated: true,
      role: "admin", 
    });

    renderWithStore(store, (
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    ));
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
}
);
