import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  ShoppingCart, 
  User, 
  List, 
  LogOut, 
  Settings, 
  LayoutDashboard, 
  ChevronDown, 
  ShoppingBag 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
const Header = () => {
  const { user, openLogin, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { cart, removeFromCart, totalPrice } = useCart();
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <List size={20} />
            </div>
            <Link to="/">
              <h1 className="text-sm sm:text-xl md:text-2xl font-black text-blue-600 tracking-tighter">
                GALAXY DIGITAL
              </h1>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-10">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search appliances..."
                className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              />
              <Search
                className="absolute left-4 top-2.5 text-gray-400 group-focus-within:text-blue-500"
                size={18}
              />
            </div>
          </div>

          {/* Actions: Auth & Cart */}
          <div className="flex items-center gap-2 sm:gap-5">
            
            {/* Conditional Auth UI */}
            {!isAuthenticated ? (
              // Case 1: Visitor - Show Login Button
              <button
                onClick={openLogin}
                className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition group"
              >
                <User size={20} className="text-gray-700 group-hover:text-blue-600" />
                <span className="hidden sm:inline">Sign In / Sign Up</span>
              </button>
            ) : (
              // Case 2: Logged In User - Show Profile Dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex cursor-pointer items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Hello,</span>
                    <span className="text-sm font-bold text-gray-800">{user?.name?.split(' ')[0]}</span>
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[10px] text-blue-600 font-bold uppercase">{user?.role} Account</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link 
                        to="/profile" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings size={16} className="text-gray-400" />
                        My Profile
                      </Link>

                      <Link 
                        to="/orders" 
                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <ShoppingBag size={16} className="text-gray-400" />
                        My Orders
                      </Link>

                      {/* Admin Link */}
                      {user?.role === "ADMIN" && (
                        <Link 
                          to="/admin/dashboard" 
                          className="flex items-center gap-3 px-3 py-2 text-sm text-blue-700 font-bold hover:bg-blue-50 rounded-lg transition"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <LayoutDashboard size={16} />
                          Admin Dashboard
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-gray-50 mt-1 p-1">
                      <button
                        onClick={() => {
                          logout();
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-bold"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="w-[1.5px] h-8 bg-gray-200" />

            {/* Shopping Cart */}
<div
  onClick={() => setOpenCart(true)}
  className="relative cursor-pointer hover:scale-110 transition-transform"
>
              <ShoppingCart size={24} className="text-blue-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {cart.length}
              </span>
            </div>
            {/* Cart Drawer */}
{openCart && (
  <div className="fixed inset-0 z-[200] flex">
    
    {/* Overlay */}
    <div
      className="flex-1 bg-black/40"
      onClick={() => setOpenCart(false)}
    />

    {/* Cart Panel */}
    <div className="w-[380px] bg-white h-full shadow-2xl p-6 flex flex-col animate-slide-in">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Shopping Cart</h2>
        <button
          onClick={() => setOpenCart(false)}
          className="text-gray-500 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto space-y-4">

<div className="flex-1 overflow-y-auto space-y-4">

{cart.length === 0 && (
  <p className="text-center text-gray-500">Cart is empty</p>
)}

{cart.map((item) => (
  <div key={item.id} className="flex gap-3 border-b pb-3">
    <img
      src={item.imageUrl}
      className="w-14 h-14 object-cover rounded"
    />

    <div className="flex-1">
      <p className="text-sm font-semibold">{item.name}</p>
      <p className="text-xs text-gray-500">
        {item.quantity} × {item.price} DH
      </p>
    </div>

    <button
      onClick={() => removeFromCart(item.id)}
      className="text-red-500 text-xs"
    >
      remove
    </button>
  </div>
))}

</div>

      </div>

      {/* Footer */}
      <div className="border-t pt-4">
        <p className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{totalPrice} DH</span>
        </p>

        <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl font-semibold">
          Checkout
        </button>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;