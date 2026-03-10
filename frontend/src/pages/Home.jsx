import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FAQSection from "../components/FAQSection";
import API from "../api/api"; // Assure-toi que ce chemin est correct
import {
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  Loader2,
  UnfoldHorizontal,
} from "lucide-react";
import { Heart, Eye, Star } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Styles Swiper
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

// --- Variantes d'Animation ---
const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemPop = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 200 },
  },
};

// --- Données Traduites ---
const HERO_SLIDES = [
  {
    id: 1,
    tag: "Offres Spéciales Agadir",
    title: "ÉLECTRONIQUE",
    subtitle: "PREMIUM.",
    desc: "Améliorez votre foyer avec les dernières technologies. Livraison gratuite à Agadir.",
    img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80",
    color: "#111827",
  },
  {
    id: 2,
    tag: "Offre à Durée Limitée",
    title: "MACHINES À",
    subtitle: "LAVER SMART.",
    desc: "Économisez jusqu'à 30% sur les meilleurs appareils de buanderie cette semaine.",
    img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80",
    color: "#1e293b",
  },
];

// const PRODUCTS = [
//   {
//     id: 1,
//     name: 'Samsung 55" Crystal UHD 4K Smart TV',
//     price: 4299,
//     originalPrice: 7499,
//     discount: 42,
//     imageUrl:
//       "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 2,
//     name: "LG Vivace 9KG Front Load Washing Machine",
//     price: 3499,
//     originalPrice: 4999,
//     discount: 30,
//     imageUrl:
//       "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 3,
//     name: "Bosch Serie 4 NoFrost Refrigerator 400L",
//     price: 6999,
//     originalPrice: 8999,
//     discount: 22,
//     imageUrl:
//       "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 4,
//     name: "Whirlpool Split Air Conditioner 12000 BTU",
//     price: 3199,
//     originalPrice: 4099,
//     discount: 21,
//     imageUrl:
//       "https://images.unsplash.com/photo-1610552050890-fe99536c2615?auto=format&fit=crop&w=400&q=80",
//   },
//   {
//     id: 5,
//     name: "Sony PlayStation 5 Console Digital Edition",
//     price: 6799,
//     originalPrice: 8599,
//     discount: 20,
//     imageUrl:
//       "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80",
//   },
// ];

const REVIEWS = [
  {
    id: 1,
    name: "Ahmed B.",
    rating: 5,
    comment: "Excellent produit ! Livraison rapide et qualité incroyable.",
    product: 'Samsung 55" TV',
  },
  {
    id: 2,
    name: "Sara L.",
    rating: 4,
    comment: "La machine à laver fonctionne parfaitement. Très satisfaite !",
    product: "LG Vivace 9KG",
  },
  {
    id: 3,
    name: "Youssef M.",
    rating: 5,
    comment: "Le réfrigérateur garde tout super frais. Je recommande.",
    product: "Bosch Serie 4",
  },
];

// --- Fonctions d'aide ---
const getCategoryDetails = (name) => {
  const map = {
    Électroménager: { icon: "❄️", color: "bg-blue-50" },
    "Petit Électroménager": { icon: "☕", color: "bg-green-50" },
    "Climatisation & Confort": { icon: "🌬️", color: "bg-purple-50" },
    "TV & Électronique": { icon: "📺", color: "bg-orange-50" },
    Cuisine: { icon: "🍳", color: "bg-yellow-50" },
  };
  return map[name] || { icon: "📦", color: "bg-gray-50" };
};

// --- Sous-composants ---

const ReviewCard = ({ review }) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 m-1 shadow-sm hover:shadow-md transition-shadow duration-500">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
        {review.name.charAt(0)}
      </div>
      <div className="ml-4">
        <h4 className="font-bold text-gray-800 text-sm">{review.name}</h4>
        <p className="text-xs text-gray-400">{review.product}</p>
      </div>
    </div>
    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  </div>
);

const ProductCard = ({ product }) => {
  const [liked, setLiked] = useState(false);

  const { addToCart } = useCart();
  const discount =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        )
      : 0;

  return (
    <motion.div
      variants={itemPop}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 group hover:shadow-2xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative bg-gray-50 p-3 flex items-center justify-center">
        {/* Discount */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 z-30 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
            -{discount}%
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => {
            setLiked(!liked);
            toast.success(
              liked ? "Removed from wishlist" : "Added to wishlist ❤️",
            );
          }}
          className="absolute top-3 right-3 z-30 bg-white p-2 rounded-full shadow hover:bg-red-500 hover:text-white transition"
        >
          <Heart
            size={16}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
        </button>

        {/* Image */}
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          className="h-44 object-contain"
        />

        {/* Quick view */}
        <button
          onClick={() => toast("Quick view coming soon 👀")}
          className="absolute bottom-3 opacity-0 group-hover:opacity-100 transition bg-white px-3 py-1 text-xs rounded-lg shadow flex items-center gap-1"
        >
          <Eye size={14} />
          Quick View
        </button>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
          <span className="text-gray-500 text-xs ml-1">(4.8)</span>
        </div>

        {/* Price */}
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

        {/* Save */}
        {discount > 0 && (
          <p className="text-green-600 text-xs font-semibold">
            Save {product.originalPrice - product.price} DH
          </p>
        )}

        {/* Add to cart */}
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

export default function GalaxyHome() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get("/api/categories"),
          API.get("/api/products?limit=10"),
        ]);
        console.log(prodRes.data);

        setCategories(catRes.data);
        setProducts(prodRes.data.data);
      } catch (err) {
        console.error(err.message);

        toast.error("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categoryCounts = products.reduce((acc, product) => {
    acc[product.categoryId] = (acc[product.categoryId] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation des Catégories */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInDown}
        className="bg-white flex py-4 border-b border-gray-100 sticky top-0 z-40 overflow-x-auto no-scrollbar"
      >
        <div className="max-w-7xl mx-auto px-4 flex gap-3">
          <button className="px-5 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white shadow-lg shadow-blue-200 flex-shrink-0">
            Tous les produits
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/products?category=${cat.id}`)}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-gray-50 text-gray-700 hover:bg-gray-100 flex items-center gap-2 flex-shrink-0 transition-all"
            >
              {cat.name} <ChevronDown size={14} />
            </button>
          ))}
        </div>
      </motion.div>

      <main className="pb-20">
        {/* Section Hero */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 group mb-16 mt-6">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            effect="fade"
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 6000 }}
            loop={true}
            className="rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {HERO_SLIDES.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="min-h-[500px] md:h-[450px] flex flex-col md:flex-row items-center px-8 py-12 md:px-16 relative overflow-hidden"
                  style={{ backgroundColor: slide.color }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 z-20 text-center md:text-left"
                  >
                    <span className="bg-blue-600/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
                      {slide.tag}
                    </span>
                    <h2 className="text-white text-4xl md:text-5xl font-black leading-tight mb-4 uppercase">
                      {slide.title} <br />{" "}
                      <span className="text-blue-500">{slide.subtitle}</span>
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-md">
                      {slide.desc}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-black px-10 py-4 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all shadow-xl"
                    >
                      Acheter
                    </motion.button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 relative h-full w-full flex justify-center items-center z-10 mt-8 md:mt-0"
                  >
                    <div className="absolute w-64 h-64 md:w-[400px] md:h-[400px] bg-blue-600/10 rounded-full blur-3xl"></div>
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full max-w-sm drop-shadow-2xl"
                    />
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>

        {/* Grille des Catégories */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-end mb-10"
          >
            <div>
              <h2 className="text-3xl text-gray-900 font-bold tracking-tight">
                Acheter par Catégorie
              </h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-2"></div>
            </div>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
            >
              {categories.map((cat) => {
                const details = getCategoryDetails(cat.name);
                return (
                  <motion.div
                    key={cat.id}
                    variants={itemPop}
                    whileHover={{ y: -5 }}
                    onClick={() => navigate(`/products?category=${cat.id}`)}
                    className="group cursor-pointer flex flex-col items-center"
                  >
                    <div
                      className={`${details.color} w-24 h-24 rounded-full flex items-center justify-center mb-4`}
                    >
                      <span className="text-4xl">{details.icon}</span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-sm">
                      {cat.name}
                    </h3>

                    <p className="text-gray-400 text-xs mt-1">
                      {categoryCounts[cat.id] || 0} products
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>

        {/* Produits Populaires */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="flex justify-between items-end mb-10"
          >
            <div>
              <h2 className="text-3xl text-gray-900 font-bold tracking-tight">
                Articles Populaires
              </h2>
              <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-2"></div>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="text-blue-600 font-bold text-sm flex items-center gap-1 cursor-pointer"
            >
              Voir toutes les offres <ChevronRight size={16} />
            </button>
          </motion.div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {products?.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </section>

        {/* Avis Clients */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mb-10"
          >
            <h2 className="text-3xl text-gray-900 font-bold tracking-tight">
              Avis de nos Clients
            </h2>
            <div className="h-1.5 w-16 bg-blue-600 rounded-full mt-2"></div>
          </motion.div>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {REVIEWS.map((review) => (
              <SwiperSlide key={review.id}>
                <ReviewCard review={review} />
              </SwiperSlide>
            ))}
          </Swiper>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-20"
          >
            <FAQSection />
          </motion.div>
        </section>
      </main>



      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          background: rgba(255,255,255,0.1);
          width: 45px; height: 45px; border-radius: 50%;
          backdrop-filter: blur(8px); opacity: 0; transition: 0.3s;
        }
        .group:hover .swiper-button-next, .group:hover .swiper-button-prev { opacity: 1; }
        .swiper-pagination-bullet-active { background: #3b82f6 !important; width: 25px; border-radius: 10px; }
      `}</style>
    </div>
  );
}
