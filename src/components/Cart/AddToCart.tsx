import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  loadCartFromLocalStorage,
} from "../../store/cartSlice";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Menu from "../Menu/Menu";
import { productItems } from "../Menu/MenuItem";
import { auth } from "../../utils/Firebase";
import "./AddToCart.scss";
import { useNavigate } from "react-router-dom";
import cart from "../../assets/cart-empty.png";

const AddToCart: React.FC = () => {
  const cartItems = useSelector(
    (state: { cart: { items: any[] } }) => state.cart.items
  );
  const dispatch = useDispatch();
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const storedCartItems = localStorage.getItem("cartItems");
    if (storedCartItems) {
      dispatch(loadCartFromLocalStorage(JSON.parse(storedCartItems)));
    }
  }, [dispatch]);

  const handleCheckout = async () => {
    if (userId) {
      try {
        const cartData = cartItems.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        }));

        const response = await fetch(
          `https://rolereact-f4a63-default-rtdb.firebaseio.com/cart/${userId}.json`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cartData),
          }
        );

        if (!response.ok) {
          const errorDetails = await response.json();
          throw new Error(
            `Error: ${response.status} - ${errorDetails.message}`
          );
        }

        dispatch(clearCart());

        Swal.fire({
          title: "Thank You!",
          text: "Your order has been placed successfully.",
          icon: "success",
          confirmButtonText: "OK",
          background: "#1F2732",
        });
      } catch (error: any) {
        console.error("Checkout error:", error);
        Swal.fire({
          title: "Error!",
          text: `There was an issue with checkout: ${error.message}. Please try again.`,
          icon: "error",
          background: "#1F2732",
        });
      }
    } else {
      Swal.fire({
        title: "Error!",
        text: "You must be logged in to checkout.",
        icon: "error",
        background: "#1F2732",
      });
    }

    navigate("/product");
  };

  return (
    <div className="cart">
      <Menu menuItems={productItems} />
      <div className="container">
        {cartItems.length === 0 ? (
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
              Before procceed to checkout you must add some products to your
              shopping cart.
            </p>
            <p>
              You will find a lot of interesting products on our "Product" Page
            </p>
            <div className="shopping-btn">
              <Link to="/product">Return to Shop</Link>
            </div>
          </div>
        ) : (
          <div className="cart-content">
            <h1>Your Cart</h1>
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
                          onClick={() =>
                            dispatch(incrementQuantity({ id: item.id }))
                          }
                        >
                          +
                        </button>
                        {item.quantity}
                        <button
                          className="quantity"
                          onClick={() =>
                            dispatch(decrementQuantity({ id: item.id }))
                          }
                        >
                          -
                        </button>
                      </div>
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button
                        className="remove-btn"
                        onClick={() =>
                          dispatch(removeFromCart({ id: item.id }))
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-bottom">
              <h2>Total: ${totalPrice.toFixed(2)}</h2>
              <button className="checkout-button" onClick={handleCheckout}>
                Checkout
              </button>
            </div>
            <div className="shopping-btn">
              <Link to="/product">Return to Shop</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
