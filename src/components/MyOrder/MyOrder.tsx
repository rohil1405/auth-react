import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  loadCartFromLocalStorage,
} from "../../store/cartSlice";
import CartModal from "./CartModal";
import "./MyOrder.scss";
import { Link } from "react-router-dom";
import { productItems } from "../Menu/MenuItem";
import Menu from "../Menu/Menu";
import Swal from "sweetalert2";
import cart from "../../assets/cart-empty.png";

const MyOrder: React.FC = () => {
  const cartItems = useSelector(
    (state: { cart: { items: any[] } }) => state.cart.items
  );
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [reviewDescription, setReviewDescription] = useState("");
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      dispatch(loadCartFromLocalStorage(JSON.parse(storedCartItems)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleReview = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setReviewDescription("");
    setCurrentProductId(null);
  };

  const handleSubmit = async (productId: string) => {
    if (reviewDescription.trim() === "") {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Review cannot be empty.",
        background: "#1F2732",
      });
      return;
    }

    try {
      const reviewData = {
        review: reviewDescription,
        productId,
        title: cartItems.find((item) => item.id === productId)?.title || "",
        status: "pending",
        date: new Date().toISOString(),
      };

      const response = await fetch(
        `https://rolereact-f4a63-default-rtdb.firebaseio.com/productreviews/${productId}.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review.");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Review submitted successfully!",
        background: "#1F2732",
      });
      handleModalClose();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error submitting review. Please try again later.",
        background: "#1F2732",
      });
    }
  };

  return (
    <div className="cart">
      <Menu menuItems={productItems} />
      <div className="container">
        {cartItems.length === 0 ? (
          <>
            <div className="cart-empty">
              <h2>Shopping Cart</h2>
              <div className="cart-navigate">
                <Link to="/product">Home</Link> / Cart
              </div>
              <div className="cart-img">
                <img src={cart} alt="cart-empty" />
              </div>
              <h1 className="h1">Your Cart is Currently Empty!</h1>
              <p>
                Before proceeding to checkout you must add some products to your
                shopping cart.
              </p>
              <p>
                You will find a lot of interesting products on our "Product"
                Page
              </p>
            </div>
            <div className="shopping-btn" style={{ marginTop: "20px 0 0" }}>
              <Link to="/product">Return to Shop</Link>
            </div>
          </>
        ) : (
          <div className="cart-content">
            <h1>My Order</h1>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="cart-item-image"
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <div className="add-quantity">
                        <button
                          className="quantity"
                          onClick={() => {
                            dispatch(incrementQuantity({ id: item.id }));
                            Swal.fire({
                              icon: "success",
                              title: "Success!",
                              text: "Item quantity increased!",
                              background: "#1F2732",
                            });
                          }}
                        >
                          +
                        </button>
                        {item.quantity}
                        <button
                          className="quantity"
                          onClick={() => {
                            dispatch(decrementQuantity({ id: item.id }));
                            Swal.fire({
                              icon: "success",
                              title: "Success!",
                              text: "Item quantity decreased!",
                              background: "#1F2732",
                            });
                          }}
                        >
                          -
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <div className="buttons">
                        <button
                          className="remove-btn"
                          onClick={() => {
                            dispatch(removeFromCart({ id: item.id }));
                            Swal.fire({
                              icon: "info",
                              title: "Removed",
                              text: "Item removed from cart.",
                              background: "#1F2732",
                            });
                          }}
                        >
                          Remove
                        </button>
                        <button
                          className="review-btn"
                          onClick={() => {
                            handleReview();
                            setReviewDescription("");
                            setCurrentProductId(item.id);
                          }}
                        >
                          Review
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="shopping-btn">
              <Link to="/product">Return to Shop</Link>
            </div>
          </div>
        )}
        {isModalOpen && (
          <CartModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            reviewDescription={reviewDescription}
            setReviewDescription={setReviewDescription}
            onSubmit={handleSubmit}
            productId={currentProductId!}
          />
        )}
      </div>
    </div>
  );
};

export default MyOrder;
