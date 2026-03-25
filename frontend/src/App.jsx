import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // أضفنا useLocation
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
  const { user, loading } = useAuth();
  const location = useLocation(); // الحصول على المسار الحالي

  // التحقق مما إذا كان المستخدم في صفحات لوحة التحكم
  const isAdminPath = location.pathname.startsWith("/dashboard");

  if (loading) return null;

  return (
    <div className="app-container">
      <Toaster position="top-center" reverseOrder={false} />
      
      {/* إظهار الهيدر فقط إذا لم نكن في صفحات الأدمن */}
      {!isAdminPath && <Header />}
      
      <AuthModal />

      <Routes>
        {/* --- المسارات العامة --- */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProdutsDetails />} />

        {/* --- مسارات المستخدمين --- */}
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

        {/* --- مسارات الأدمن --- */}
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

        {/* إعادة توجيه أي رابط خاطئ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* زر الواتساب - يختفي أيضاً في لوحة التحكم لترك مساحة للعمل */}
      {!isAdminPath && (
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
      )}

      {/* إظهار الفوتر فقط إذا لم نكن في صفحات الأدمن */}
      {!isAdminPath && <Footer />}
    </div>
  );
}

export default App;