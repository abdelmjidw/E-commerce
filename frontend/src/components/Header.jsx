// components/Header.jsx
import { Search, ShoppingCart, User, List } from "lucide-react";

import { useAuth } from "../context/AuthContext";
const Header = () => {
  const { openLogin, user } = useAuth();

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-primary p-1.5 rounded-lg text-white">
              <List size={20} />
            </div>
            <h1 className="text-sm sm:text-xl md:text-2xl font-black text-primary tracking-tighter">
              GALAXY DIGITAL
            </h1>
          </div>
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
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={openLogin}
              className="flex cursor-pointer items-center sm:gap-2 text-sm font-semibold text-gray-700 hover:text-primary transition"
            >
              <User size={20} />
              {user ? (
                <span className="ml-2">{user.name}</span>
              ) : (
                <span>Sign In/Sign Up</span>
              )}
            </button>
            <div className="w-[1.5px] h-8 bg-gray-300" />
            <div className="relative cursor-pointer hover:scale-105 transition">
              <ShoppingCart size={24} className="text-blue-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                3
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
