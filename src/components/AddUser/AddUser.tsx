import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../Layout/InputField";
import "../Layout/layout.scss";
import visible from "../../assets/visible.png";
import invisible from "../../assets/invisible.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auth, createUserWithEmailAndPassword } from "../../utils/Firebase";
import storeUserData from "../../hooks/StoreDataUser";
import { adminItems } from "../Menu/MenuItem";
import Menu from "../Menu/Menu";
import Swal from "sweetalert2";
import person from "../../assets/username.png";
import emailIcon from "../../assets/email.png";
import call from "../../assets/call.png";
import date from "../../assets/calender.png";

const AddUser: React.FC = () => {
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDOB] = useState<Date | null>(null);
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();

      const userData = {
        fullname,
        email,
        phone,
        password,
        dob: dob ? dob.toISOString() : null,
        gender,
        token,
      };

      await storeUserData(user.uid, userData);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User added successfully!",
      });

      navigate("/admin");
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Error registering user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <>
      <Menu menuItems={adminItems} />
      <div className="form-wrap">
        <div className="form">
          <div className="login-wrap">
            <form onSubmit={handleUser}>
              <h1>Add User</h1>
              {errorMessage && <p className="error">{errorMessage}</p>}
              <InputField
                type="text"
                value={fullname}
                placeholder="Enter Your Full Name"
                onChange={(e) => setFullName(e.target.value)}
              />
              <img src={person} alt="fullname" className="admin-icon name" />

              <InputField
                type="email"
                value={email}
                placeholder="Enter Your Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <img src={emailIcon} alt="email" className="admin-icon email" />
              
              <InputField
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={showPassword ? visible : invisible}
                alt="password"
                className="admin-icon pass"
                onClick={handleTogglePassword}
              />
              <InputField
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="Confirm Your Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img
                src={showPassword ? visible : invisible}
                alt="password-visibility"
                className="admin-icon cpass"
                onClick={handleTogglePassword}
              />
              <DatePicker
                selected={dob}
                onChange={(date) => setDOB(date)}
                dateFormat="dd-MM-yyyy"
                placeholderText="dd-mm-yyyy"
                className="datepicker"
              />
              <img src={date} alt="date" className="admin-icon date" />
              <div className="gender-selection">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === "male"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === "female"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Female
                </label>
              </div>
              <InputField
                type="number"
                value={phone}
                placeholder="Enter Your Phone Number"
                onChange={(e) => setPhone(e.target.value)}
              />
              <img src={call} alt="call" className="admin-icon phone" />
              <div className="cta-btn">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
