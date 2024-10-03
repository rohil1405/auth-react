import React, { useEffect, useState } from "react";
import icon from "../../assets/logo.png";
import "./Menu.scss";
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

interface MenuItem {
  label: string;
  path: string;
}

interface MenuProps {
  menuItems: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ menuItems }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="menu-container-wrap">
      <div className="menu-container">
        <div className="menu-top">
          <img src={icon} alt="logo" />
          <div className="menu-content">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.path}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="menu-bottom">
          {isLoggedIn ? (
            <button className="auth-button" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link className="auth-button" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
