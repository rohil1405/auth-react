import React from "react";
import "./CartModal.scss";
import cursor from "../../assets/Cursor.svg";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewDescription: string;
  setReviewDescription: (description: string) => void;
  onSubmit: (productId: string) => void; 
  productId: string;
}

const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  reviewDescription,
  setReviewDescription,
  onSubmit,
  productId, 
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(productId); 
  };

  return (
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-modal-actions">
          <h2>Review and Description</h2>
          <div className="close-btn" onClick={onClose}>
            <img src={cursor} alt="cursor" />
          </div>
        </div>

        <textarea
          value={reviewDescription}
          onChange={(e) => setReviewDescription(e.target.value)}
          placeholder="Add any additional notes or descriptions here..."
          className="cart-modal-textarea"
        />
        <div className="submit-btn">
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartModal;

