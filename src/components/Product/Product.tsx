import React, { useState } from "react";
import { useProducts } from "../../hooks/useFetchProduct";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import Menu from "../Menu/Menu";
import "./Product.scss";
import loader from "../../assets/loading.png";
import price from "../../assets/price.png";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import { addToCart } from "../../store/cartSlice";
import SweetAlert from "sweetalert2";
import FourFive from "../../assets/4.5.png";
import Second from "../../assets/2.png";
import Three from "../../assets/3.png";
import Four from "../../assets/4.png";
import Five from "../../assets/5.png";
import ThreeFour from "../../assets/3.5.png";
import TwoThree from "../../assets/2.5.png";
import cart from "../../assets/cart.png";
import { productItems } from "../Menu/MenuItem";

const Product: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { data: products, isLoading, error } = useProducts();
  const productList = useSelector((state: RootState) => state.product.products);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="loader">
          <img src={loader} alt="Loading..." />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error fetching products</div>;
  }

  const getStarImage = (rating: number) => {
    if (rating > 4 && rating < 5) return FourFive;
    if (rating > 3 && rating < 4) return ThreeFour;
    if (rating > 2 && rating < 3) return TwoThree;
    if (rating >= 5) return Five;
    if (rating >= 4) return Four;
    if (rating >= 3) return Three;
    if (rating >= 2) return Second;
    return "";
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: any) => {
    if (!user) {
      SweetAlert.fire({
        title: "Please login",
        text: "You need to log in to add items to the cart.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Login",
        cancelButtonText: "Cancel",
        background: "#1F2732",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
  };

  const filteredProducts = productList.filter((product) =>
    product.title.toLowerCase().includes(search.toLowerCase())
  );

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="product-wrap">
      <div className="container">
        <div className="product">
          <Menu menuItems={productItems} />
          <div className="product-header">
            <div className="product-search">
              <input
                type="text"
                placeholder="Please search here..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="add-to-cart">
              <img src={cart} alt="cart" />
              <Link to="/order">{cartCount}</Link>
            </div>
          </div>
          <ul className="product-listing">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <li key={product.id}>
                  <div className="listing-wrap">
                    <div
                      className="product-top"
                      onClick={() => handleProductClick(product)}
                    >
                      <h2>{product.title}</h2>
                      <div className="price-wrap">
                        <div className="price-icon">
                          <img src={price} alt="Price icon" />
                        </div>
                        <p>${product.price}</p>
                      </div>
                      <div className="star-image">
                        <img
                          src={getStarImage(product.rating.rate)}
                          alt={`${product.rating.rate} star rating`}
                        />
                        <span>({product.rating.rate})</span>
                      </div>
                    </div>
                    <div className="product-bottom">
                      <div className="product-img">
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div
                        className="cta-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                      >
                        Add to Cart
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <p>No products available</p>
            )}
          </ul>
        </div>
      </div>

      <Modal
        isOpen={selectedProduct !== null}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Product;
