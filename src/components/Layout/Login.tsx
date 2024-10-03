import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../store/authSlice";
import InputField from "./InputField";
import "./layout.scss";
import visible from "../../assets/visible.png";
import emailImg from "../../assets/email.png";
import invisible from "../../assets/invisible.png";
import logo from "../../assets/logo.png";
import icon from "../../assets/icon.png";
import login from "../../assets/login.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../utils/Firebase";
import Swal from "sweetalert2";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "admin@gmail.com" && password === "admin") {
      const adminUser = {
        id: "admin123", 
        email,
        name: "Admin",
      };

      Swal.fire({
        title: "Login Successful",
        text: "Welcome to the Admin Dashboard!",
        icon: "success",
        background: "#1F2732",
      }).then(() => {
        dispatch(loginUser({ role: "admin", user: adminUser }));
        navigate("/admin");
      });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const loggedInUser = {
        id: user.uid,
        email: user.email ?? "", 
        name: user.displayName ?? "User",
      };

      dispatch(loginUser({ role: "user", user: loggedInUser }));

      Swal.fire({
        title: "Login Successful",
        text: "You have logged in successfully!",
        icon: "success",
        background: "#1F2732",
      }).then(() => {
        navigate("/product");
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: "Invalid credentials. Please try again.",
        icon: "error",
        background: "#1F2732",
      });
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="form-wrap">
      <div className="form">
        <div className="logos">
          <img src={icon} alt="logo-one" />
          <img src={logo} alt="main-logo" className="main-logo" />
          <img src={icon} alt="logo-two" />
        </div>
        <div className="login-wrap">
          <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <div className="login-user-wrap">
              <div className="login-user">
                <img src={login} alt="login-user" />
              </div>
            </div>
            <div className="section-logo">
              <img src={icon} alt="icon" />
            </div>
            <InputField
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <img src={emailImg} alt="email-img" className="login-img email" />

            <InputField
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? visible : invisible}
              alt="showpass"
              className="login-img pass"
              onClick={handleTogglePassword}
            />

            <div className="forgot-pass">
              <Link to="/reset" className="re-direct">
                Forgot Password
              </Link>
            </div>

            <div className="cta-btn">
              <button type="submit">Submit</button>
            </div>

            <div className="register-link">
              <p>Don’t have an account? </p>
              <Link to="/register" className="re-direct">
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
