import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, LogOut, 
  Search, Edit, X, Filter, Eye
} from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterPayment, setFilterPayment] = useState('ALL');
  
  // Modal de mise à jour
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', paymentStatus: '' });

  const fetchOrders = async () => {
    try {
      // Assurez-vous que la route backend correspond à votre routeur (ex: /orders/all)
      const { data } = await API.get('/orders/all'); 
      setOrders(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Logique de filtrage
  const filteredOrders = orders.filter(order => {
    const matchSearch = order.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        order.user?.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'ALL' || order.status === filterStatus;
    const matchPayment = filterPayment === 'ALL' || order.paymentStatus === filterPayment;
    
    return matchSearch && matchStatus && matchPayment;
  });

  const openUpdateModal = (order) => {
    setCurrentOrder(order);
    setUpdateData({ 
      status: order.status || 'PENDING', 
      paymentStatus: order.paymentStatus || 'UNPAID' 
    });
    setIsModalOpen(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assurez-vous que l'URL correspond à la route updateOrderStatus de votre backend
      await API.put(`/orders/${currentOrder.id}`, updateData);
      toast.success("Commande mise à jour !");
      setIsModalOpen(false);
      fetchOrders(); // Rafraîchir la liste
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  // Badges de couleurs
  const getPaymentBadge = (status) => {
    return status === 'PAID' 
      ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Payé</span>
      : <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Non Payé</span>;
  };

  const getStatusBadge = (status) => {
    const styles = {
      'PENDING': 'bg-amber-100 text-amber-700',
      'PROCESSING': 'bg-blue-100 text-blue-700',
      'SHIPPED': 'bg-purple-100 text-purple-700',
      'DELIVERED': 'bg-emerald-100 text-emerald-700',
      'CANCELLED': 'bg-slate-200 text-slate-700'
    };
    return <span className={`${styles[status] || styles['PENDING']} px-3 py-1 rounded-full text-xs font-bold`}>{status}</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
        <h2 className="text-2xl font-bold text-blue-600 mb-10 flex items-center gap-2">
           <LayoutDashboard /> Galaxy Admin
        </h2>
        <nav className="space-y-2 flex-1">
          <Link to="/dashboard" className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-medium">
            <LayoutDashboard size={20} /> Tableau de bord
          </Link>
          <Link to="/dashboard/products" className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-medium">
            <Package size={20} /> Produits
          </Link>
          <Link to="/dashboard/orders" className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-50 text-blue-600 font-semibold transition-all">
            <ShoppingBag size={20} /> Commandes
          </Link>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all mt-auto font-bold border border-transparent hover:border-red-100">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestion des Commandes</h1>
          <p className="text-slate-500 mt-1 font-medium">Suivez et mettez à jour l'état des livraisons.</p>
        </header>

        {/* Barre de Filtres */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[250px] flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Search className="text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par client ou email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium text-sm"
            />
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Filter className="text-slate-400" size={18} />
            <select 
              value={filterPayment} 
              onChange={(e) => setFilterPayment(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium text-sm cursor-pointer"
            >
              <option value="ALL">Tous les paiements</option>
              <option value="PAID">Payé</option>
              <option value="UNPAID">Non Payé</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <Filter className="text-slate-400" size={18} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-slate-700 font-medium text-sm cursor-pointer"
            >
              <option value="ALL">Toutes les livraisons</option>
              <option value="PENDING">En attente (PENDING)</option>
              <option value="PROCESSING">En préparation (PROCESSING)</option>
              <option value="SHIPPED">Expédié (SHIPPED)</option>
              <option value="DELIVERED">Livré (DELIVERED)</option>
              <option value="CANCELLED">Annulé (CANCELLED)</option>
            </select>
          </div>
        </div>

        {/* Tableau des Commandes */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">N° Commande</th>
                <th className="p-4 font-bold">Client</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold text-center">Paiement</th>
                <th className="p-4 font-bold text-center">Statut</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-800">#{order.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{order.user?.name}</p>
                    <p className="text-xs text-slate-500 font-medium">{order.user?.email}</p>
                  </td>
                  <td className="p-4 text-slate-500 font-medium text-sm">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="p-4 font-black text-blue-600">{order.totalPrice} DH</td>
                  <td className="p-4 text-center">{getPaymentBadge(order.paymentStatus)}</td>
                  <td className="p-4 text-center">{getStatusBadge(order.status)}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => openUpdateModal(order)} 
                      className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-sm font-bold"
                    >
                      <Edit size={16} /> Gérer
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-slate-500 font-medium">
                    Aucune commande ne correspond à vos critères.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal de Mise à jour */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700">
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Mettre à jour</h2>
            <p className="text-slate-500 text-sm font-medium mb-6">Commande #{currentOrder?.id} - {currentOrder?.user?.name}</p>
            
            <form onSubmit={handleUpdateSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Statut du Paiement</label>
                <select 
                  value={updateData.paymentStatus} 
                  onChange={(e) => setUpdateData({...updateData, paymentStatus: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700"
                >
                  <option value="UNPAID">Non Payé</option>
                  <option value="PAID">Payé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Statut de la Livraison</label>
                <select 
                  value={updateData.status} 
                  onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-slate-700"
                >
                  <option value="PENDING">En attente (PENDING)</option>
                  <option value="PROCESSING">En préparation (PROCESSING)</option>
                  <option value="SHIPPED">Expédié (SHIPPED)</option>
                  <option value="DELIVERED">Livré (DELIVERED)</option>
                  <option value="CANCELLED">Annulé (CANCELLED)</option>
                </select>
              </div>
              
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors mt-2">
                Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;