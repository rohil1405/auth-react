import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { updateProduct } from "./updateProduct";
import "./EditProduct.scss";
import cursor from "../../assets/Cursor.svg";

interface EditProductProps {
  product: {
    id: number;
    title: string;
    category: string;
    price: number;
    image: string;
    description: string;
    rating?: {
      rate: number;
      count: number;
    };
  };
  onClose: () => void;
  onUpdate: (updatedProduct: any) => void;
}

const EditProduct: React.FC<EditProductProps> = ({
  product,
  onClose,
  onUpdate,
}) => {
  const [title, setTitle] = useState<string>(product.title || "");
  const [category, setCategory] = useState<string>(product.category || "");
  const [price, setPrice] = useState<number>(product.price || 0);
  const [image, setImage] = useState<string>(product.image || "");
  const [description, setDescription] = useState<string>(
    product.description || ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      title,
      category,
      price,
      image,
      description,
    };

    try {
      await updateProduct(updatedProduct);
      onUpdate(updatedProduct);
      Swal.fire("Success!", "Product updated successfully!", "success");
      onClose();
    } catch (error: any) {
      console.error("Error updating product:", error);
      Swal.fire(
        "Error!",
        error.message || "Failed to update product.",
        "error"
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setTitle(product.title);
    setCategory(product.category);
    setPrice(product.price);
    setImage(product.image);
    setDescription(product.description);
  }, [product]);

  return (
    <div className="edit-product-modal">
      <form onSubmit={handleSubmit}>
        <div className="cancel-btn">
          <button type="button" onClick={onClose}>
            <img src={cursor} alt='cursor' />
          </button>
        </div>
        <h2>Edit Product</h2>
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div>
          <textarea
            rows={10}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="cta-btns">
          <button type="submit">Update Product</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
