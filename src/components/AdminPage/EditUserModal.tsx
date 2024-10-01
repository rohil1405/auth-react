import React, { useState } from "react";
import Swal from "sweetalert2";
import { getAuth } from "firebase/auth";
import "./EditUserModal.scss";
import { UserData } from "../user-data/UserData";
import InputField from "../Layout/InputField";
import close from "../../assets/Cursor.svg";
import profile from "../../assets/profile.png";
import call from "../../assets/call.png";
import emailIcon from "../../assets/email.png";
import visible from "../../assets/visible.png";
import invisible from "../../assets/invisible.png";

interface EditUserModalProps {
  user: UserData;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedUser: UserData) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [password, setPassword] = useState(user.password);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUpdateUser = async () => {
    const auth = getAuth();
    const token = await auth.currentUser?.getIdToken();

    if (!token) {
      Swal.fire("Error!", "Authentication token is missing.", "error");
      return;
    }

    try {
      const userId = user.id;
      const updateUrl = `https://rolereact-f4a63-default-rtdb.firebaseio.com/users/${userId}.json?auth=${token}`;

      const res = await fetch(updateUrl, {
        method: "PATCH",
        body: JSON.stringify({ fullname, email, phone, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const updatedUser: UserData = { ...user };
        onUpdate(updatedUser);
        Swal.fire("Success!", "User updated successfully.", "success");
        onClose();
      } else {
        const errorData = await res.json();
        Swal.fire(
          "Error!",
          errorData.error || "Failed to update user.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire("Error!", "Failed to update user.", "error");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleUpdateUser();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="close-btn">
          <div className="close">
            <img src={close} alt="close" onClick={onClose} />
          </div>
        </div>
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            type="text"
            value={fullname}
            placeholder="Enter Your FullName"
            onChange={(e) => setFullname(e.target.value)}
          />
          <img src={profile} alt="edit-profile" className="edit profile" />

          <InputField
            type="email"
            value={email}
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <img src={emailIcon} alt="edit-email" className="edit email" />

          <InputField
            type={showPassword ? "text" : "password"}
            value={password.toString()}
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <img
            src={showPassword ? visible : invisible}
            alt="password-visibility"
            className="edit cpass"
            onClick={handleTogglePassword}
          />
          
          <InputField
            type="number"
            value={phone}
            placeholder="Enter Your Phone Number"
            onChange={(e) => setPhone(e.target.value)}
          />
          <img src={call} alt="edit-call" className="edit call" />

          <div className="cta-btn">
            <button type="submit">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
