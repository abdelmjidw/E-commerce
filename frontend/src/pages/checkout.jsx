import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  MapPin, 
  ShoppingBag, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOrder = async () => {
    if (!phone || !address) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    if (cart.length === 0) {
      toast.error("Votre panier est vide");
      return;
    }

    try {
      setLoading(true);
      const orderItems = cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price
      }));

      await API.post("/orders", {
        phone,
        address,
        totalPrice,
        items: orderItems
      });

      toast.custom((t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-lg rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold text-gray-900">Commande Confirmée !</p>
                <p className="mt-1 text-sm text-gray-500">Merci pour votre confiance. Nous vous contacterons bientôt.</p>
              </div>
            </div>
          </div>
        </div>
      ));

      clearCart();
      navigate("/"); // العودة للرئيسية بعد النجاح
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la création de la commande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <ShoppingBag className="text-blue-600" /> FINALISER LA COMMANDE
            </h1>
            <p className="text-gray-500 mt-2">Complétez vos informations pour recevoir votre colis.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="tel"
                  placeholder="06 XX XX XX XX"
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Adresse de livraison à Agadir</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-5 text-gray-400" size={18} />
                <textarea
                  placeholder="Quartier, Rue, N° d'appartement..."
                  rows="4"
                  className="w-full bg-gray-50 border-none p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all outline-none font-medium resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              onClick={handleOrder}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  CONFIRMER MA COMMANDE <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <ShieldCheck size={16} /> PAIEMENT À LA LIVRAISON
            </div>
            <div className="h-4 w-[1px] bg-gray-200"></div>
            <div className="text-[10px] font-bold uppercase tracking-widest">Galaxy Digital Agadir</div>
          </div>
        </motion.div>

        {/* Right Side: Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="font-black text-gray-900 mb-6">RÉSUMÉ DU PANIER</h2>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-8 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center gap-4 group">
                  <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 p-2">
                    <img src={item.product.imageUrl} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-gray-800 truncate">{item.product.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold">Qté: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-black text-blue-600">{(item.product.price * item.quantity).toLocaleString()} DH</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-dashed border-gray-100">
              <div className="flex justify-between text-sm text-gray-500 font-medium">
                <span>Sous-total</span>
                <span>{totalPrice.toLocaleString()} DH</span>
              </div>
              <div className="flex justify-between text-sm text-green-600 font-medium">
                <span>Livraison</span>
                <span className="font-bold">GRATUITE</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-black text-gray-900">TOTAL</span>
                <span className="text-2xl font-black text-blue-600 tracking-tighter">{totalPrice.toLocaleString()} DH</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
      `}</style>
    </div>
  );
}