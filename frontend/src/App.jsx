import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import use_user_store from "./stores/use_user_store";
import CategoryPage from "./pages/CategoryPage";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import use_cart_store from "./stores/use_cart_store";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import CustomerDeshboard from "./pages/CustomerDeshboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPassword from "./pages/ResetPassword";
function App() {
  const { user, checkAuth } = use_user_store();
  const { getCartItems } = use_cart_store();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) {
      getCartItems();
    }
  }, [getCartItems, user]);

  return (
    <div className="bg-gray-900  text-white  min-h-screen relative overflow-hidden">
      <div className="relative pt-20">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={user ? <ContactPage /> : <Login />} />
          <Route path="/cart" element={user ? <CartPage /> : <Login />} />
          <Route path="/login" element={user ? <Home /> : <Login />} />
          <Route path="/signup" element={user ? <Home /> : <Signup />} />

          <Route
            path="/secret-dashboard"
            element={
              user?.role === "admin" ? (
                <AdminPage />
              ) : (
                <CustomerDeshboard user={user} />
              )
            }
          />

          <Route path="/category/:category" element={<CategoryPage />} />
          <Route
            path="/purchase-success"
            element={user ? <PurchaseSuccessPage /> : <Home />}
          />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:id" element={<ResetPassword />} />
        </Routes>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
