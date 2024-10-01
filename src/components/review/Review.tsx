import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Review.scss";
import { adminItems } from "../Menu/MenuItem";
import Menu from "../Menu/Menu";
import logo from "../../assets/icon.png";
import loader from "../../assets/loading.png";

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          "https://rolereact-f4a63-default-rtdb.firebaseio.com/productreviews.json"
        );
        const data = await response.json();

        if (data) {
          const reviewArray: any[] = [];
          Object.keys(data).forEach((productId) => {
            const productReviews = data[productId];
            Object.keys(productReviews).forEach((reviewId) => {
              reviewArray.push({
                ...productReviews[reviewId],
                id: reviewId,
                productId: productId,
              });
            });
          });
          setReviews(reviewArray);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleStatusChange = (
    reviewId: string,
    productId: string,
    newStatus: string
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to mark this review as "${newStatus}"?`,
      icon: "warning",
      background: "#1F2732",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        updateReviewStatus(reviewId, productId, newStatus);
      }
    });
  };

  const updateReviewStatus = async (
    reviewId: string,
    productId: string,
    status: string
  ) => {
    try {
      await fetch(
        `https://rolereact-f4a63-default-rtdb.firebaseio.com/productreviews/${productId}/${reviewId}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, status } : review
        )
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `The review has been marked as ${status}.`,
        background: "#1F2732",
      });
    } catch (error) {
      console.error("Failed to update review status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update review status. Please try again.",
        background: "#1F2732",
      });
    }
  };

  return (
    <div className="review-wrap">
      <div className="container">
        <Menu menuItems={adminItems} />
        <div className="reviews-container">
          <h1>Product Reviews</h1>
          <img src={logo} alt="logo" />
          {loading ? (
            <div className="loader-container">
              <div className="loader">
                <img src={loader} alt="Loading..." />
                <span style={{color: "#fff"}}>Loading...</span>
              </div>
            </div>
          ) : (
            <table className="review-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Title</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id}>
                    <td>{review.productId}</td>
                    <td>{review.title}</td>
                    <td>{review.review}</td>
                    <td
                      className={
                        review.status === "approved" ? "approved" : "pending"
                      }
                    >
                      {review.status}
                    </td>
                    <td>
                      <button
                        className={`status-btn approve ${
                          review.status === "approved" ? "disabled" : ""
                        }`}
                        onClick={() =>
                          handleStatusChange(
                            review.id,
                            review.productId,
                            "approved"
                          )
                        }
                        disabled={review.status === "approved"}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
