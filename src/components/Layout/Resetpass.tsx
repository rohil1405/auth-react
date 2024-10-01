import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import Swal from "sweetalert2";
import "./layout.scss";
import visible from "../../assets/visible.png";
import emailImg from "../../assets/email.png";
import invisible from "../../assets/invisible.png";
import logo from "../../assets/logo.png";
import icon from "../../assets/icon.png";

const Resetpass: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  useEffect(() => {
    setIsValid(password === confirmPassword && password.length > 0);
  }, [password, confirmPassword]);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isValid) {
      try {
        const response = await fetch(
          `https://rolereact-f4a63-default-rtdb.firebaseio.com/users.json`
        );
        const data = await response.json();

        if (data) {
          const userKey = Object.keys(data).find(
            (key) => data[key].email === email
          );

          if (userKey) {
            await fetch(
              `https://rolereact-f4a63-default-rtdb.firebaseio.com/users/${userKey}.json`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
              }
            );

            Swal.fire({
              icon: "success",
              title: "Password Reset",
              text: "Password has been reset successfully!",
            });

            navigate("/login");
          } else {
            Swal.fire({
              icon: "error",
              title: "User Not Found",
              text: "No user was found with this email address.",
            });
          }
        }
      } catch (error) {
        console.error("Failed to reset password:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reset password. Please try again later.",
        });
      }
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
        <div className="reset-wrap">
          <form onSubmit={handleResetPassword}>
            <h1>Reset Password</h1>
            <div className="section-logo">
              <img src={icon} alt="icon" />
            </div>
            <InputField
              type="email"
              value={email}
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />

            <img
              src={emailImg}
              alt="email-img"
              className="login-img reset-email"
            />
            <InputField
              type={showPassword ? "text" : "password"}
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? visible : invisible}
              alt="showpass"
              className="login-img reset-pass"
              onClick={handleTogglePassword}
            />
            <InputField
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              placeholder="Enter Your Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <img
              src={showPassword ? visible : invisible}
              alt="showpass"
              className="register-img reset-cpass"
              onClick={handleTogglePassword}
            />
            <div className="cta-btn">
              <button type="submit" disabled={!isValid}>
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Resetpass;
