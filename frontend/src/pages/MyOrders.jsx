import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Package, Calendar, CheckCircle2, Clock, ChevronRight, Loader2 } from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my-orders");
        // تأكد أن البيانات مصفوفة دائماً
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Fetch Orders Error:", err);
        toast.error("Erreur lors du chargement de vos commandes");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusDetails = (status) => {
    // تأمين الحالة في حال كانت فارغة
    const safeStatus = (status || "pending").toLowerCase();
    const map = {
      pending: { label: "En attente", color: "bg-orange-100 text-orange-600", icon: <Clock size={14} /> },
      shipped: { label: "Expédiée", color: "bg-blue-100 text-blue-600", icon: <Package size={14} /> },
      delivered: { label: "Livrée", color: "bg-green-100 text-green-600", icon: <CheckCircle2 size={14} /> },
      cancelled: { label: "Annulée", color: "bg-red-100 text-red-600", icon: <Clock size={14} /> },
    };
    return map[safeStatus] || { label: safeStatus, color: "bg-gray-100 text-gray-600", icon: <Package size={14} /> };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <ShoppingBag className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">MES COMMANDES</h1>
            <p className="text-gray-500 text-sm">Suivez l'état de vos achats chez Galaxy</p>
          </div>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[2.5rem] p-12 text-center border border-gray-100 shadow-sm">
            <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Aucune commande trouvée</h3>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold mt-4">Commencer mes achats</button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              // صمام أمان لـ Status و ID
              const status = getStatusDetails(order?.status);
              const orderId = order?._id || order?.id || "N/A";

              return (
                <motion.div key={orderId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex gap-4">
                      <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center text-gray-400">
                        <Package size={24} />
                      </div>
                      <div>
                        {/* استخدام اختصار آمن للأيدي */}
                        <h4 className="font-bold text-gray-900">Commande #{orderId.toString().slice(-6)}</h4>
                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                          <Calendar size={12} />
                          {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : "Date inconnue"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      <span className="text-lg font-black text-blue-600">{order?.totalPrice || 0} DH</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex -space-x-3">
                       {order?.items?.map((item, idx) => (
                         <img 
                          key={idx} 
                          src={item.product?.imageUrl || 'https://via.placeholder.com/40'} 
                          className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-100" 
                          alt="product" 
                         />
                       ))}
                    </div>
                    <button className="text-sm font-bold text-gray-400 group-hover:text-blue-600 flex items-center gap-1">
                      Détails <ChevronRight size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;