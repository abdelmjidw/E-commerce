import React from 'react'

// components/Header.jsx
import { Search, ShoppingCart, User } from 'lucide-react';

export const Header = () => (
  <header className="w-full">
    {/* Top Bar */}
    <div className="flex justify-between items-center px-8 py-4 bg-white border-b">
      <h1 className="text-2xl font-bold text-blue-600">Galaxy Digital</h1>
      <div className="flex-1 mx-10 relative">
        <input type="text" placeholder="بحث عن الأجهزة المنزلية..." className="w-full bg-gray-100 p-2 rounded-lg" />
        <Search className="absolute left-3 top-2 text-gray-400" size={20} />
      </div>
      <div className="flex gap-6 items-center">
        <div className="flex items-center gap-1"><User size={20}/> دخول</div>
        <div className="flex items-center gap-1"><ShoppingCart size={20}/> السلة</div>
      </div>
    </div>
    {/* Categories Bar */}
    <nav className="flex justify-center gap-6 py-3 bg-white shadow-sm overflow-x-auto">
      {['الثلاجات', 'الغسالات', 'التكييف', 'التلفزيونات'].map(cat => (
        <span key={cat} className="px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm cursor-pointer">
          {cat}
        </span>
      ))}
    </nav>
  </header>
);
