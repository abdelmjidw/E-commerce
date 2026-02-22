import React from 'react'

export // components/ProductCard.jsx
const ProductCard = ({ product }) => (
  <div className="border rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition relative">
    <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg">
      خصم 20%
    </span>
    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-contain mb-4" />
    <h3 className="font-bold text-gray-800 line-clamp-1">{product.name}</h3>
    <div className="mt-2">
      <span className="text-xl font-bold">{product.price} DH</span>
      <span className="text-gray-400 text-sm line-through ml-2">{(product.price * 1.2).toFixed(2)} DH</span>
    </div>
    <p className="text-green-600 text-sm mt-1 font-medium">وفرت: {(product.price * 0.2).toFixed(2)} DH</p>
  </div>
);
