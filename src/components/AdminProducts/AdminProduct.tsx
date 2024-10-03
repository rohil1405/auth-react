import React, { useState } from "react";
import { useProducts } from "../../hooks/useFetchProduct";
import { useDispatch } from "react-redux";
import Menu from "../Menu/Menu";
import "../Product/Product.scss";
import loader from "../../assets/loading.png";
import price from "../../assets/price.png";
import FourFive from "../../assets/4.5.png";
import Second from "../../assets/2.png";
import Three from "../../assets/3.png";
import Four from "../../assets/4.png";
import Five from "../../assets/5.png";
import ThreeFour from "../../assets/3.5.png";
import TwoThree from "../../assets/2.5.png";
import { adminItems } from "../Menu/MenuItem";
import deleteIcon from "../../assets/delete.png";
import Swal from "sweetalert2";
import edit from "../../assets/edit.png";
import { Product } from "../Product/ProductData";
import EditProduct from "./EditProduct";

const AdminProduct: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const { data: products, isLoading, error } = useProducts();
  const dispatch = useDispatch();
  const [editProductModalOpen, setEditProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

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
    return <div>Error fetching products: {error.message}</div>;
  }

  const getStarImage = (rating: number) => {
    if (rating >= 5) return Five;
    if (rating >= 4) return Four;
    if (rating >= 3) return Three;
    if (rating >= 2) return Second;
    if (rating > 4 && rating < 5) return FourFive;
    if (rating > 3 && rating < 4) return ThreeFour;
    if (rating > 2 && rating < 3) return TwoThree;
    return "";
  };

  const filteredProducts =
    products?.filter((product) =>
      product.title.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const handleUpdateProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditProductModalOpen(true);
  };
  const deleteProduct = async (firebaseId: string | number) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      background: "#1F2732",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const deleteUrl = `https://rolereact-f4a63-default-rtdb.firebaseio.com/products/${firebaseId}.json`;

        const deleteRes = await fetch(deleteUrl, {
          method: "DELETE",
        });

        if (!deleteRes.ok) {
          const errorMessage = await deleteRes.text(); // Log the error message for debugging
          throw new Error(`Failed to delete product: ${errorMessage}`);
        }

        Swal.fire({
          title: "Deleted!",
          text: "Product deleted successfully.",
          icon: "success",
          background: "#1F2732",
        });
      } catch (error: any) {
        console.error("Error deleting product:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete product.",
          background: "#1F2732",
        });
      }
    }
  };

  return (
    <div className="admin-product-wrap">
      <div className="product-wrap">
        <div className="container">
          <div className="product">
            <Menu menuItems={adminItems} />
            <ul className="product-listing">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <li key={product.id}>
                    <div className="listing-wrap">
                      <div>
                        <h2>{product.title}</h2>
                        <div className="price-wrap">
                          <div className="price-icon">
                            <img src={price} alt="Price icon" />
                          </div>
                          <p>${product.price ?? "N/A"}</p>
                        </div>
                        <div className="star-image">
                          <img
                            width="250px"
                            style={{ objectFit: "cover", paddingTop: "20px" }}
                            src={getStarImage(product.rating?.rate ?? 0)}
                            alt={`${product.rating?.rate ?? 0} star rating`}
                          />
                          <span>({product.rating?.rate ?? "N/A"})</span>
                        </div>
                        <div className="product-img">
                          <img
                            src={product.image ?? loader}
                            alt={product.title}
                            width="100px"
                            height="100px"
                            style={{
                              objectFit: "cover",
                              marginTop: "20px",
                              marginBottom: "20px",
                            }}
                          />
                        </div>
                      </div>
                      <div className="product-bottom">
                        <div
                          className="edit-btn"
                          onClick={() => handleUpdateProduct(product)}
                        >
                          <img src={edit} alt="edit" />
                        </div>
                        <div className="actions-btn">
                          <div
                            className="delete-product"
                            onClick={() => deleteProduct(product.firebaseId)}
                          >
                            <img src={deleteIcon} alt="delete" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>No products available</p>
              )}
            </ul>
            {editProductModalOpen && selectedProduct && (
              <EditProduct
                product={{ ...selectedProduct }}
                onClose={() => setEditProductModalOpen(false)}
                onUpdate={(updatedProduct) => {
                  setEditProductModalOpen(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProduct;
