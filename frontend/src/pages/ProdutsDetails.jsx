import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Loader2,
  User,
  Send
} from "lucide-react";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated, openLogin, user } = useAuth(); // جلب user لمعرفة بياناته إذا لزم الأمر

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // حقول المراجعات (Reviews)
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // جلب تفاصيل المنتج والمراجعات في نفس الوقت لتسريع التحميل
        const [productRes, reviewsRes] = await Promise.all([
          API.get(`/products/${id}`),
          API.get(`/reviews?productId=${id}`)
        ]);
        
        setProduct(productRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        toast.error("Produit introuvable");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter");
      openLogin();
      return;
    }
    try {
      setIsAdding(true);
      await addToCart(product, quantity);
      toast.success("Ajouté au panier !");
    } catch (error) {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setIsAdding(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Veuillez vous connecter pour laisser un avis");
      openLogin();
      return;
    }
    if (!newComment.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await API.post("/reviews", {
        productId: id,
        rating: newRating,
        comment: newComment,
      });
      
      // إضافة المراجعة الجديدة إلى القائمة محلياً (مع بيانات المستخدم الوهمية مؤقتاً لتظهر فوراً)
      const newReview = {
        ...res.data,
        user: { name: user?.name || "Vous" }, // افترض أن لديك اسم المستخدم في الـ Context
      };
      
      setReviews([newReview, ...reviews]);
      setNewComment("");
      setNewRating(5);
      toast.success("Votre avis a été publié avec succès !");
    } catch (error) {
      // التعامل مع الخطأ P2002 الذي برمجته في الباك اند
      const errorMsg = error.response?.data?.message || "Erreur lors de la publication de l'avis";
      toast.error(errorMsg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  // حساب متوسط التقييم
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header / Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors font-bold text-sm"
        >
          <ArrowLeft size={18} /> RETOUR
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
        {/* Left: Image Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative bg-gray-50 rounded-[3rem] p-12 flex items-center justify-center aspect-square overflow-hidden"
        >
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl"
          />
        </motion.div>

        {/* Right: Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <span className="text-blue-600 font-black tracking-widest text-xs uppercase mb-4">
            GALAXY DIGITAL EXCLUSIF
          </span>
          <h1 className="text-4xl font-black text-gray-900 leading-tight mb-4 uppercase">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill={i < Math.round(averageRating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-400 font-bold text-sm">
              ({averageRating}/5 - {reviews.length} avis)
            </span>
          </div>

          <div className="mb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-black text-blue-600">
                {product.price.toLocaleString()} DH
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-300 line-through font-bold">
                  {product.originalPrice.toLocaleString()} DH
                </span>
              )}
            </div>
            <p className="text-green-600 font-bold text-sm mt-2 uppercase tracking-wide">
              En stock - Livraison gratuite à Agadir
            </p>
          </div>

          <p className="text-gray-500 leading-relaxed mb-10 text-lg">
            {product.description || "Découvrez la performance et l'élégance avec ce produit sélectionné par Galaxy Digital."}
          </p>

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-6 mb-12">
            <div className="flex items-center bg-gray-100 rounded-2xl p-2 w-fit">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-white rounded-xl transition-all shadow-sm"
              >
                <Minus size={20} />
              </button>
              <span className="px-8 font-black text-xl">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-white rounded-xl transition-all shadow-sm"
              >
                <Plus size={20} />
              </button>
            </div>

            <button
              disabled={isAdding}
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all active:scale-95"
            >
              {isAdding ? <Loader2 className="animate-spin" /> : <ShoppingCart size={22} />}
              AJOUTER AU PANIER
            </button>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><ShieldCheck size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Garantie 2 ans</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><Truck size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Livraison 24h</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><RotateCcw size={20} /></div>
              <span className="text-[10px] font-black text-gray-400 uppercase">Retour Gratuit</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl mx-auto px-4 border-t border-gray-100 pt-16">
        <h2 className="text-2xl font-black text-gray-900 mb-8">AVIS CLIENTS ({reviews.length})</h2>

        {/* Formulaire d'ajout d'avis */}
        <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-[2rem] mb-12">
          <h3 className="font-bold text-gray-800 mb-4">Laisser un avis</h3>
          
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setNewRating(star)}
                className={`${newRating >= star ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
              >
                <Star size={24} fill={newRating >= star ? "currentColor" : "none"} />
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              rows="3"
              placeholder={isAuthenticated ? "Partagez votre expérience avec ce produit..." : "Veuillez vous connecter pour écrire un avis..."}
              className="w-full bg-white border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!isAuthenticated || isSubmittingReview}
              onClick={() => !isAuthenticated && openLogin()}
            />
            <button
              type="submit"
              disabled={!isAuthenticated || isSubmittingReview || !newComment.trim()}
              className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              {isSubmittingReview ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>
        </form>

        {/* Liste des avis */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Aucun avis pour le moment. Soyez le premier !</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900">{review.user?.name || "Utilisateur"}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-1 text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}