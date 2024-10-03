import React from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Login from "./components/Layout/Login";
import NotFound from "./components/NotFound/NotFound";
import AdminPage from "./components/AdminPage/AdminPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Register from "./components/Layout/Register";
import Resetpass from "./components/Layout/Resetpass";
import Product from "./components/Product/Product";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AddProduct from "./components/AddProduct/AddProduct";
import Cart from "./components/Cart/AddToCart";
import MyOrder from "./components/MyOrder/MyOrder";
import "./App.scss";
import AddUser from "./components/AddUser/AddUser";
import Reviews from "./components/review/Review";
import AdminProduct from "./components/AdminProducts/AdminProduct";

const routes = [
  {
    path: "/",
    element: <Navigate to="/product" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset",
    element: (
      <ProtectedRoute>
        <Resetpass />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/product",
    element: (
      <ProtectedRoute>
        <AdminProduct />
      </ProtectedRoute>
    ),
  },

  {
    path: "/product",
    element: (
        <Product />
    ),
  },
  {
    path: "/order",
    element: (
      <ProtectedRoute>
        <MyOrder />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cart",
    element: (
      <ProtectedRoute>
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute isAdminRoute={true}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/addproduct",
    element: (
      <ProtectedRoute isAdminRoute={true}>
        <AddProduct />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/adduser",
    element: (
      <ProtectedRoute isAdminRoute={true}>
        <AddUser />
      </ProtectedRoute>
    ),
  },
  {
    path: "admin/reviews",
    element: (
      <ProtectedRoute isAdminRoute={true}>
        <Reviews />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
