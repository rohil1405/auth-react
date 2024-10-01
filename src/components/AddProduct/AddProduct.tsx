import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../Layout/InputField";
import "../Layout/layout.scss";
import Menu from "../Menu/Menu";
import Swal from "sweetalert2";
import { adminItems } from "../Menu/MenuItem";
import productid from "../../assets/productif.png";
import priceproduct from "../../assets/price.png";
import descriptionProduct from "../../assets/title.png";
import productcategory from "../../assets/category.png";
import ratingproduct from "../../assets/review.png";
import countproduct from "../../assets/count.png";

const AddProduct: React.FC = () => {
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [count, setCount] = useState("");
  const [id, setId] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let base64Image = "";
      if (image) {
        base64Image = await convertFileToBase64(image);
      }

      const productData = {
        id,
        title,
        description,
        price: parseFloat(price),
        category,
        image: base64Image || "",
        rating: {
          count: parseInt(count) || 0,
          rate: parseFloat(rating) || 0,
        },
      };

      const firebaseURL =
        "https://rolereact-f4a63-default-rtdb.firebaseio.com/products.json";
      const response = await fetch(firebaseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Product added successfully!",
      });

      navigate("/admin");
    } catch (error: any) {
      setErrorMessage(error.message);
      console.error("Error adding product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <>
      <Menu menuItems={adminItems} />
      <div className="form-wrap">
        <div className="form">
          <div className="login-wrap">
            <form onSubmit={handleProduct}>
              <h1>Add Product</h1>
              {errorMessage && <p className="error">{errorMessage}</p>}
              <InputField
                type="number"
                value={id}
                placeholder="Enter Product Id"
                onChange={(e) => setId(e.target.value)}
              />
              <img src={productid} alt="productid" className="add-product id" />

              <InputField
                type="text"
                value={title}
                placeholder="Enter Product Title"
                onChange={(e) => setTitle(e.target.value)}
              />
              <img
                src={descriptionProduct}
                alt="producttitle"
                className="add-product title"
              />

              <InputField
                type="text"
                value={description}
                placeholder="Enter Product Description"
                onChange={(e) => setDescription(e.target.value)}
              />
              <img
                src={descriptionProduct}
                alt="productdescription"
                className="add-product description"
              />

              <InputField
                type="number"
                value={price}
                placeholder="Enter Product Price"
                onChange={(e) => setPrice(e.target.value)}
              />
              <img
                src={priceproduct}
                alt="productprice"
                className="add-product price"
              />

              <InputField
                type="text"
                value={category}
                placeholder="Enter Product Category"
                onChange={(e) => setCategory(e.target.value)}
              />
              <img
                src={productcategory}
                alt="productcategory"
                className="add-product category"
              />

              <InputField
                type="number"
                value={rating}
                placeholder="Enter Product Rating"
                onChange={(e) => setRating(e.target.value)}
              />
              <img
                src={ratingproduct}
                alt="productrating"
                className="add-product rating"
              />

              <InputField
                type="number"
                value={count}
                placeholder="Enter Your Count"
                onChange={(e) => setCount(e.target.value)}
              />
              <img
                src={countproduct}
                alt="productcound"
                className="add-product count"
              />

              <input
                type="file"
                onChange={handleImageChange}
                className="file-choose"
              />

              <div className="cta-btn">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
