import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  LogOut,
  Search,
  X,
  Download,
  Phone,
  MapPin,
  Eye,
  Menu, // Added Menu icon
} from "lucide-react";
import API from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { NavLink } from 'react-router-dom';

const AdminOrders = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [updateData, setUpdateData] = useState({ status: "", paymentStatus: "" });
  const [menuOuvert, setMenuOuvert] = useState(false);
  
  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
      isActive ? "bg-blue-50 text-blue-600 font-semibold shadow-sm" : "text-slate-500 hover:bg-slate-100 font-medium"
    }`;
  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders/all");
      setOrders(data);
    } catch (error) {
      toast.error("Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const downloadLivraison = (order) => {
    const itemsList = order.orderItems
      .map((item) => `- ${item.product?.name} (x${item.quantity})`)
      .join("\n");
    const content = `BON DE LIVRAISON - #${order.id}\nCLIENT: ${order.user?.name}\nTEL: ${order.phone}\nADDR: ${order.address}\n\nARTICLES:\n${itemsList}\n\nTOTAL: ${order.totalPrice} DH`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `livraison_${order.id}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.success("Fiche générée !");
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/orders/${currentOrder.id}`, updateData);
      toast.success("Statut mis à jour !");
      setIsModalOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error("Échec de la mise à jour");
    }
  };

  const openDetails = (order) => {
    setCurrentOrder(order);
    setUpdateData({ status: order.status, paymentStatus: order.paymentStatus });
    setIsModalOpen(true);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order.id.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Overlay for Mobile Sidebar */}
      {menuOuvert && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] md:hidden"
          onClick={() => setMenuOuvert(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[55] w-64 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform duration-300 ease-in-out
          ${menuOuvert ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <LayoutDashboard /> Galaxy Admin
          </h2>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setMenuOuvert(false)}>
            <X size={24} />
          </button>
        </div>
<nav className="space-y-2 flex-1">
  <NavLink to="/dashboard" end className={linkClass}>
    <LayoutDashboard size={20} /> Tableau de bord
  </NavLink>
  
  <NavLink to="/dashboard/products" className={linkClass}>
    <Package size={20} /> Produits
  </NavLink>
  
  <NavLink to="/dashboard/orders" className={linkClass}>
    <ShoppingBag size={20} /> Commandes
  </NavLink>
</nav>
        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all font-bold"
        >
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64">
        <header className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3">
              {/* Mobile Menu Trigger */}
              <button 
                onClick={() => setMenuOuvert(true)}
                className="p-2 bg-white border border-slate-200 rounded-lg md:hidden text-slate-600"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl md:text-3xl font-black text-slate-800">Commandes</h1>
            </div>
            <p className="hidden sm:block text-slate-500">Gérez vos ventes et les expéditions.</p>
          </div>
        </header>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="ID, Nom ou Téléphone..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container - Mobile Responsive Scroll */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="p-4 text-center">ID</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-center">Statut</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4 text-center font-bold text-slate-400">#{order.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 leading-tight">{order.user?.name}</div>
                      <div className="text-[11px] text-blue-600 font-bold">{order.phone}</div>
                    </td>
                    <td className="p-4 font-black text-slate-900">{order.totalPrice} DH</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                        order.status === "DELIVERED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openDetails(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => downloadLivraison(order)} className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                          <Download size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal - Already Responsive via Grid */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-800">Détails #{currentOrder?.id}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase text-slate-400">Articles</h3>
                {currentOrder?.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <img src={item.product?.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">{item.product?.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold">Qté: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-black text-blue-600">{item.price} DH</p>
                  </div>
                ))}
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <p className="text-xs font-bold flex gap-2 text-slate-700 mb-2"><MapPin size={14} /> {currentOrder?.address}</p>
                  <p className="text-xs font-black flex gap-2 text-blue-600"><Phone size={14} /> {currentOrder?.phone}</p>
                </div>
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <select
                    value={updateData.status}
                    onChange={(e) => setUpdateData({ ...updateData, status: e.target.value })}
                    className="w-full p-3 bg-slate-100 rounded-xl font-bold outline-none"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="SHIPPED">Expédié</option>
                    <option value="DELIVERED">Livré</option>
                    <option value="CANCELLED">Annulé</option>
                  </select>
                  <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-sm">
                    Mettre à jour
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;