import React, { useState, useEffect } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const itemPop = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const { addToCart } = useCart();

  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <motion.div
      variants={itemPop}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative bg-gray-50 p-3 flex items-center justify-center">
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-30 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}

        <button
          onClick={() => {
            setLiked(!liked);
            toast.success(
              liked ? "Removed from wishlist" : "Added to wishlist ❤️"
            );
          }}
          className="absolute top-3 right-3 z-30 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
        >
          <Heart
            size={16}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        <motion.img
          src={product.imageUrl}
          alt={product.name}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="h-44 object-contain"
        />

        <button
          onClick={() => toast("Quick view coming soon 👀")}
          className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition bg-white px-3 py-1 text-xs rounded-lg shadow flex items-center gap-1"
        >
          <Eye size={14} />
          Quick View
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
          <span className="text-gray-500 text-xs ml-1">(4.8)</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {product.price} DH
          </span>

          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {product.originalPrice} DH
            </span>
          )}
        </div>

        {discount > 0 && (
          <p className="text-green-600 text-xs font-semibold">
            Save {product.originalPrice - product.price} DH
          </p>
        )}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            addToCart(product);
            toast.success("Produit ajouté au panier");
          }}
          className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition"
        >
          <ShoppingCart size={16} />
          Ajouter au panier
        </motion.button>
      </div>
    </motion.div>
  );
};

function Products() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get("/api/categories"),
          API.get("/api/products?limit=100"),
        ]);

        setCategories(catRes.data);
        setProducts(prodRes.data.data);
      } catch (err) {
        toast.error("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchCategory =
      !selectedCategory || product.categoryId === Number(selectedCategory);

    const matchMin = !minPrice || product.price >= Number(minPrice);
    const matchMax = !maxPrice || product.price <= Number(maxPrice);

    const matchRating = !rating || (product.rating || 4) >= rating;

    return matchCategory && matchMin && matchMax && matchRating;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container mx-auto px-6 py-10 flex gap-8">
      
      {/* Filters */}
      <div className="w-64 bg-white p-5 rounded-xl shadow h-fit">
        <h2 className="font-bold text-lg mb-4">Filters</h2>

        {/* Category */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Category</h3>

          <select
            className="w-full border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Price</h3>

          <input
            type="number"
            placeholder="Min"
            className="w-full border p-2 rounded mb-2"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max"
            className="w-full border p-2 rounded"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* Rating */}
        <div>
          <h3 className="font-semibold mb-2">Rating</h3>

          <select
            className="w-full border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="0">All</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars & up</option>
            <option value="3">3 Stars & up</option>
            <option value="2">2 Stars & up</option>
          </select>
        </div>
      </div>

      {/* Products */}
      <div className="flex-1">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products;