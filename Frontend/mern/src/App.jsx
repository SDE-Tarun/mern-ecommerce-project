import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Customer pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import ProductDetails from "./Pages/ProductDetails";
import CheckOutAddress from "./Pages/CheckOutAddress";
import CheckOut from "./Pages/CheckOut";
import OrderSuccess from "./Pages/OrderSuccess";
import MyOrders from "./Pages/MyOrders";

// Customer components
import Navbar from "./Components/Header";
import Cart from "./Components/Cart";

// Admin pages
import AdminLayout from "./Admin/AdminLayout";
import AdminDashboard from "./Admin/AdminDashboard";
import ProductList from "./Admin/ProductList";
import AddProduct from "./Admin/AddProduct";
import EditProduct from "./Admin/EditProduct";
import Orders from "./Admin/Orders";

// Customer layout: Navbar appears on all customer pages
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Routes>
        {/* Customer routes - all show the Navbar */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/products/:id"
            element={<ProductDetails />}
          />

          <Route path="/user/cart" element={<Cart />} />

          <Route
            path="/cart"
            element={<Navigate to="/user/cart" replace />}
          />

          <Route
            path="/checkout-address"
            element={<CheckOutAddress />}
          />

          <Route path="/checkout" element={<CheckOut />} />

          <Route
            path="/order-success/:id"
            element={<OrderSuccess />}
          />

          {/* My Orders now uses the same customer layout */}
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* Admin routes - without customer Navbar */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />

          <Route
            path="products"
            element={<ProductList />}
          />

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
