import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Header from "./components/Header";
import Checkout from "./pages/Checkout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProdutsDetails from "./pages/ProdutsDetails.jsx";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import "./App.css";
import AuthModal from "../src/components/AuthModal.jsx";
import { motion } from "framer-motion";
import { useAuth } from "./context/AuthContext.jsx";
import { FaWhatsapp } from "react-icons/fa";

function App() {
  const { isAuthenticated, user, loading } = useAuth();

  
  if (loading) return null; 

  return (
    <>
      <Toaster position="top-center" />
      <Header />
      <AuthModal />
      <Routes>
        {user?.role === "ADMIN" && (
          <Route path="/dashboard" element={<Dashboard />} />
        )}
        
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProdutsDetails />} />
        
  
        {isAuthenticated && <Route path="/checkout" element={<Checkout />} />}
      </Routes>

  
      <motion.a
        href="https://wa.me/212608936659"
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring" }}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-2xl z-49 flex items-center group"
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold text-sm">
          <span className="px-2">Commander via WhatsApp</span>
        </span>
        <FaWhatsapp size={24} />
      </motion.a>
      <Footer />
    </>
  );
}

export default App;