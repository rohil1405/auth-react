import { Link } from "react-router-dom";
import icon from "../../assets/icon.png";
import "./404.scss";
import logo from "../../assets/logo.png";
import one from "../../assets/iconOne.png";
import two from "../../assets/iconTwo.png";

const NotFound = () => {
  return (
    <div className="not-found-wrap">
      <div className="container">
        <div className="not-found">
          <div className='logos'>
            <img src={one} alt="logo-one" />
            <img src={logo} alt="main-logo" />
            <img src={two} alt="logo-two" />
          </div>
          <div className="not-found-item">
            <div className="section-title">404</div>
            <div className="section-logo">
              <img src={icon} alt="icon" />
            </div>
            <div className="section-content">Page Not Found</div>
            <p>The page are looking for does not exist or has been moved</p>
            <div className="cta-btn">
              <Link to="/">Back To Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
