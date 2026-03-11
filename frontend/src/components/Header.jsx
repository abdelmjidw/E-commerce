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
  ShoppingBag,
  Plus, // أضفنا Plus
  Minus, // أضفنا Minus
  Trash2, // أضفنا Trash2 بدلاً من كلمة Retirer
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, openLogin, logout, isAuthenticated } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  
  // أضفنا updateQuantity هنا
  const { cart, removeFromCart, totalPrice, updateQuantity } = useCart(); 
  
  const dropdownRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    navigate(`/products?q=${searchTerm}`);
  };

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
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <List size={20} />
            </div>
            <Link to="/">
              <h1 className="text-sm sm:text-xl md:text-2xl font-black text-primary tracking-tighter">
                GALAXY DIGITAL
              </h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-10">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search appliances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              />
              <Search
                onClick={handleSearch}
                className="absolute left-4 top-2.5 text-gray-400 group-focus-within:text-blue-500 cursor-pointer"
                size={18}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-5">
            {!isAuthenticated ? (
              <button onClick={openLogin} className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition group">
                <User size={20} className="text-gray-700 group-hover:text-primary" />
                <span className="hidden sm:inline">Sign In/Sign Up</span>
              </button>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex cursor-pointer items-center gap-2 py-1 px-2 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="flex flex-col justify-baseline"><span className="text-sm text-start font-semibold text-pri">Hello</span> {user?.name.split(' ')[0]}</h3>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
                      <p className="text-[10px] text-primary font-bold uppercase">{user?.role}</p>
                    </div>
                    <div className="p-1">
                      <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"><Settings size={16} /> Profile</Link>
                      <Link to="/orders" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg transition"><ShoppingBag size={16} /> My Orders</Link>
                      <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-bold"><LogOut size={16} /> Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="w-[1.5px] h-8 bg-gray-200" />

            {/* Shopping Cart Trigger */}
            <div onClick={() => setOpenCart(true)} className="relative cursor-pointer hover:scale-110 transition-transform">
              <ShoppingCart size={24} className="text-primary" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
                {cart.length}
              </span>
            </div>

            {/* Cart Drawer */}
            {openCart && (
              <div className="fixed inset-0 z-[200] flex">
                <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setOpenCart(false)} />
                <div className="w-full max-w-[380px] bg-white h-full shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                  
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black italic">VOTRE PANIER</h2>
                    <button onClick={() => setOpenCart(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">✕</button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-6">
                    {cart.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
                        <ShoppingCart size={48} strokeWidth={1} />
                        <p className="font-medium">Votre panier est vide</p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4 group">
                          <img
                            src={item.product.imageUrl}
                            className="w-20 h-20 object-cover rounded-2xl bg-gray-50"
                            alt={item.product.name}
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                            <p className="text-primary font-bold text-sm mb-3">{item.product.price} DH</p>
                            
                            {/* التحكم في الكمية المطور */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-white rounded-md transition shadow-sm disabled:opacity-30"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="px-3 text-sm font-black">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-white rounded-md transition shadow-sm"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-500 font-bold">TOTAL</span>
                        <span className="text-2xl font-black text-primary">{totalPrice} DH</span>
                      </div>
                      <button
                        onClick={() => {
                          setOpenCart(false);
                          navigate("/checkout");
                        }}
                        className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-95"
                      >
                        Passer à la caisse
                      </button>
                    </div>
                  )}
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