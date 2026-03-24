import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";

// Context & Protection
import { useAuth } from "./context/AuthContext.jsx";
import { ProtectedRoute, AdminRoute } from "./components/ProtectedRoute.jsx";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal.jsx";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProdutsDetails from "./pages/ProdutsDetails.jsx";

// User Protected Pages
import Checkout from "./pages/Checkout.jsx";
import MyOrders from "./pages/MyOrders.jsx";

// Admin Protected Pages
import Dashboard from "./pages/Dashboard.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminOrders from "./pages/AdminOrders.jsx";

// Styles
import "./App.css";

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  // منع الرندرة حتى يتم التأكد من حالة المستخدم (تجنب الـ Redirect العشوائي)
  if (loading) return null;

  return (
    <div className="app-container">
      <Toaster position="top-center" reverseOrder={false} />
      <Header />
      <AuthModal />

      <Routes>
        {/* --- المسارات العامة (للجميع) --- */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProdutsDetails />} />

        {/* --- مسارات المستخدمين (تحتاج تسجيل دخول) --- */}
        {user?.role !== "ADMIN" && (
          <>
            {" "}
            {/* أضفنا هذه الفتحة هنا */}
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
          </>
        )}

        {/* --- مسارات الأدمن (تحتاج رتبة ADMIN) --- */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        {/* إعادة توجيه أي رابط خاطئ إلى الصفحة الرئيسية */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* زر الواتساب العائم */}
      <motion.a
        href="https://wa.me/212608936659"
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl z-50 flex items-center group overflow-hidden"
      >
        <div className="flex items-center">
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold text-sm">
            <span className="px-2">Commander via WhatsApp</span>
          </span>
          <FaWhatsapp size={24} />
        </div>
      </motion.a>

      <Footer />
    </div>
  );
}

export default App;
