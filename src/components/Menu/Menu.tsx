import React from "react";
import icon from "../../assets/logo.png";
import "./Menu.scss";
import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  path: string;
}

interface MenuProps {
  menuItems: MenuItem[]; 
}

const Menu: React.FC<MenuProps> = ({ menuItems }) => {
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
          <Link to="/login">Logout</Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;
