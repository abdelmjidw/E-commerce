import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, LogOut, 
  Search, Edit, X, Download, Phone, MapPin, Eye, FileText
} from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [updateData, setUpdateData] = useState({ status: '', paymentStatus: '' });
  const [menuOuvert, setMenuOuvert] = useState(false);
  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/all'); 
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

  // Fonction pour télécharger le bon de livraison
  const downloadLivraison = (order) => {
    const itemsList = order.orderItems.map(item => `- ${item.product?.name} (x${item.quantity})`).join('\n');
    const content = `
      BON DE LIVRAISON - Commande #${order.id}
      -------------------------------------------
      CLIENT : ${order.user?.name || 'Anonyme'}
      TÉLÉPHONE : ${order.phone}
      ADRESSE : ${order.address}
      -------------------------------------------
      ARTICLES :
      ${itemsList}
      -------------------------------------------
      TOTAL À PAYER : ${order.totalPrice} DH
      STATUT PAIEMENT : ${order.paymentStatus === 'PAID' ? 'PAYÉ' : 'À ENCAISSER'}
    `;

    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `livraison_commande_${order.id}.txt`;
    document.body.appendChild(element);
    element.click();
    toast.success("Fiche de livraison générée !");
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

  const filteredOrders = orders.filter(order => 
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.phone?.includes(searchTerm) ||
    order.id.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex ">
      {/* Sidebar */}      {menuOuvert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] md:hidden" onClick={() => setMenuOuvert(false)} />
      )}
      <aside        className={`fixed inset-y-0 left-0 z-[55] w-64 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform duration-300 ease-in-out
          ${menuOuvert ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
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
          <Link to="/dashboard/orders"className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-50 text-blue-600 font-semibold transition-all">
            <ShoppingBag size={20} /> Commandes
          </Link>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all mt-auto font-bold border border-transparent hover:border-red-100">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>
      <main className="flex-1 p-8 md:ml-64">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Gestion des Commandes</h1>
            <p className="text-slate-500">Gérez vos ventes et les expéditions ici.</p>
          </div>
        </header>

        {/* Recherche */}
        <div className="mb-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Rechercher par ID, Nom ou Téléphone..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* Tableau */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                <th className="p-4 text-center">ID</th>
                <th className="p-4">Client</th>
                <th className="p-4">Total</th>
                <th className="p-4 text-center">Statut</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 text-center font-bold text-slate-400">#{order.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-slate-800">{order.user?.name}</div>
                    <div className="text-xs text-blue-600 font-bold">{order.phone}</div>
                  </td>
                  <td className="p-4 font-black text-slate-900">{order.totalPrice} DH</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                        {/* Bouton pour voir les détails (Ouvre la modal) */}
                        <button onClick={() => openDetails(order)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                            <Eye size={18} />
                        </button>
                        {/* Bouton pour télécharger les infos de livraison */}
                        <button onClick={() => downloadLivraison(order)} className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition-all" title="Télécharger pour livraison">
                            <Download size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal : Détails de la commande */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Détails Commande #{currentOrder?.id}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500">
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Liste des produits */}
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-widest">Articles achetés</h3>
                <div className="space-y-3">
                  {currentOrder?.orderItems?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <img src={item.product?.imageUrl} className="w-12 h-12 rounded-xl object-cover bg-white" alt="" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-800">{item.product?.name}</p>
                        <p className="text-[10px] font-black text-slate-400">Qté: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-black text-blue-600">{item.price} DH</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infos Client & Livraison */}
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                  <h3 className="text-[10px] font-black text-blue-800 uppercase mb-3">Infos Livraison</h3>
                  <p className="text-sm font-bold flex items-start gap-2 text-slate-700 mb-2"><MapPin size={16}/> {currentOrder?.address}</p>
                  <p className="text-sm font-black flex items-center gap-2 text-blue-600"><Phone size={16}/> {currentOrder?.phone}</p>
                </div>

                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400">Statut de livraison</label>
                    <select 
                      value={updateData.status} 
                      onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
                      className="w-full mt-1 p-3 bg-slate-100 border-none rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="PENDING">🕒 En attente</option>
                      <option value="SHIPPED">🚚 Expédié</option>
                      <option value="DELIVERED">✅ Livré</option>
                      <option value="CANCELLED">❌ Annulé</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all">
                    Enregistrer les modifications
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