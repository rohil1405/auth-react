import authReducer, { loginUser, logoutUser } from "./authSlice";

describe("authSlice", () => {
  it("should return the initial state", () => {
    const initialState = {
      isAuthenticated: false,
      role: null,
      user: null,
    };

    const result = authReducer(undefined, { type: "" });
    expect(result).toEqual(initialState);
  });
  it("should handle loginUser", () => {
    const user = {
      id: "1",
      email: "test@example.com",
    };
    const role = "admin";
    const action = loginUser({ user, role });

    const result = authReducer(
      { isAuthenticated: false, role: null, user: null },
      action
    );

    expect(result.isAuthenticated).toBe(true);
    expect(result.role).toBe(role);
    expect(result.user).toEqual(user);
  });

  it("should handle logoutUser", () => {
    const initialState = {
      isAuthenticated: true,
      role: "admin",
      user: { id: "1", email: "test@example.com" },
    };
    const action = logoutUser();
    const result = authReducer(initialState, action);

    expect(result.isAuthenticated).toBe(false);
    expect(result.role).toBeNull();
    expect(result.user).toBeNull();
  });
});
