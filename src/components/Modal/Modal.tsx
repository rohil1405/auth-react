import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";
import price from "../../assets/price.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{product.title}</h2>
        <div className="main-image">
          <img src={product.image} alt={product.title} className="main-image" />
        </div>

        <div className="desc">{product.description}</div>
        <div className="modal-details">
          <div className="price">
            <div className="price-wrap">
              <img src={price} alt="price" />
            </div>
            <p>${product.price.toFixed(2)}</p>
          </div>

          <div className="count">
            <span>Count:</span>
            <div className="desc">{product.rating.count}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("modal-root")!
  );
};

export default Modal;
