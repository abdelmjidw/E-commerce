import React, { useState, useEffect } from "react";
import API from "../api/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Heart, Eye, Star, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const itemPop = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// Carte produit
const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false); // لحالة التحميل عند الضغط
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, openLogin } = useAuth();

  // حساب نسبة الخصم
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  // دالة الإضافة إلى السلة
  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // 1. التحقق من تسجيل الدخول
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour ajouter au panier");
      openLogin(); // فتح نافذة تسجيل الدخول تلقائياً
      return;
    }

    try {
      setIsAdding(true);
      // 2. استدعاء الدالة من Context (والتي بدورها تراسل الـ API)
      await addToCart(product); 
      
      toast.success(`${product.name} ajouté au panier !`, {
        icon: '🛒',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      });
    } catch (error) {
      toast.error("Erreur lors de l'ajout au panier");
      console.error(error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <motion.div
      variants={itemPop}
      whileHover={{ y: -8 }}
      onClick={()=>navigate(`/product/${product.id}`)}
      className="bg-white cursor-pointer rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image Container */}
      <div className="relative bg-gray-50 p-3 flex items-center justify-center aspect-square overflow-hidden">
        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-30 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
            -{discount}%
          </span>
        )}

        {/* Wishlist Button */}
<button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    toast(liked ? "Retiré des favoris" : "Ajouté aux favoris ❤️");
  }}
  className="absolute top-3 right-3 z-30 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-red-400 group/heart transition-all duration-300"
>
  <motion.div
    whileTap={{ scale: 1.5 }}
    whileHover={{ scale: 1.1 }}
    transition={{ type: "spring", stiffness: 400, damping: 10 }}
  >
    <Heart
      size={16}
      className={`transition-colors duration-300 ${
        liked 
          ? "fill-red-500 text-red-500 hover:text-red-600 hover:fill-red-600" 
          : "text-gray-400 group-hover/heart:text-white"
      }`}
    />
  </motion.div>
</button>

        {/* Product Image */}
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="h-44 w-full object-contain mix-blend-multiply"
        />
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] hover:text-blue-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} fill={i < 4 ? "currentColor" : "none"} className={i >= 4 ? "text-gray-300" : ""} />
          ))}
          <span className="text-gray-400 text-[10px] ml-1 font-medium">(4.8)</span>
        </div>

        {/* Price Section */}
        <div className="mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">
              {product.price.toLocaleString()} DH
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {product.originalPrice.toLocaleString()} DH
              </span>
            )}
          </div>

          {/* Savings Info */}
          {discount > 0 && (
            <p className="text-green-600 text-[10px] font-bold uppercase tracking-wider">
              Économisez {(product.originalPrice - product.price).toLocaleString()} DH
            </p>
          )}
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={isAdding}
          onClick={handleAddToCart}
          className={`mt-3 w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
            isAdding 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-700 active:shadow-inner"
          }`}
        >
          <ShoppingCart size={18} className={isAdding ? "animate-bounce" : ""} />
          {isAdding ? "Chargement..." : "Ajouter au panier"}
        </motion.button>
      </div>
    </motion.div>
  );
};

// Page principale des produits
const ProductsPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "";

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  // Récupération des données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get("/categories"),
          API.get("/products?limit=100"),
        ]);
        console.log(prodRes);
        
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

  // Filtrage des produits selon recherche et filtres
  const filteredProducts = products.filter((product) => {
    const matchCategory =
      !selectedCategory || product.categoryId === Number(selectedCategory);
    const matchMin = !minPrice || product.price >= Number(minPrice);
    const matchMax = !maxPrice || product.price <= Number(maxPrice);
    const matchRating = !rating || (product.rating || 4) >= rating;
    const matchSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCategory && matchMin && matchMax && matchRating && matchSearch;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <div className="container mx-auto px-6 py-10 flex gap-8">
      {/* Sidebar pour filtres */}
      <div className="w-64 bg-white p-5 rounded-xl shadow h-fit">
        <h2 className="font-bold text-lg mb-4">Filtres</h2>

        {/* Catégorie */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Catégorie</h3>
          <select
            className="w-full border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Tous</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Prix */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Prix</h3>
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

        {/* Note */}
        <div>
          <h3 className="font-semibold mb-2">Note</h3>
          <select
            className="w-full border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value="0">Tous</option>
            <option value="5">5 Étoiles</option>
            <option value="4">4 Étoiles et +</option>
            <option value="3">3 Étoiles et +</option>
            <option value="2">2 Étoiles et +</option>
          </select>
        </div>
      </div>

      {/* Affichage des produits */}
      <div className="flex-1">
        {loading ? (
          <p>Chargement...</p>
        ) : (
          <>
            {searchQuery && (
              <h2 className="text-xl font-bold mb-6">
                Résultats de recherche pour: "{searchQuery}" ({filteredProducts.length})
              </h2>
            )}

            {filteredProducts.length === 0 ? (
              <p className="text-gray-500">Aucun produit trouvé</p>
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
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;