import React, { useEffect, useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Users, DollarSign, 
  ArrowUpRight, Package, Loader2, LogOut, AlertCircle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import API from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const { logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(false);
        const response = await API.get('/dashboard/stats');
        console.log("Données reçues:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Erreur stats:", error);
        setError(true);
        toast.error("Impossible de charger les données. Vérifiez votre serveur.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <p className="text-slate-500 font-medium">Chargement des données...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-50 text-slate-600">
      <AlertCircle size={64} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold">Erreur de connexion au serveur</h2>
      <p>Assurez-vous que le backend est bien lancé sur le bon port.</p>
      <button 
        onClick={() => window.location.reload()} 
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réessayer
      </button>
    </div>
  );

  const statsCards = [
    { title: "Chiffre d'affaires", value: `${data?.stats?.revenue || 0} DH`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Commandes', value: data?.stats?.orders || 0, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Clients', value: data?.stats?.users || 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Produits', value: data?.stats?.products || 0, icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar - Version Claire */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
        <h2 className="text-2xl font-bold text-blue-600 mb-10 flex items-center gap-2">
           <LayoutDashboard /> Galaxy Admin
        </h2>
        <nav className="space-y-2 flex-1">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-50 text-blue-600 font-semibold transition-all">
            <LayoutDashboard size={20} /> Tableau de bord
          </button>
          <button onClick={()=>{
    navigate('/dashboard/products');
          }} className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-medium">
            <Package size={20} /> Produits
          </button>
          <button onClick={()=>{
    navigate('/dashboard/orders');
          }} className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-medium">
            <ShoppingBag size={20} /> Commandes
          </button>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all mt-auto font-bold border border-transparent hover:border-red-100">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Contenu Principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Tableau de bord</h1>
            <p className="text-slate-500 mt-1 font-medium">Gestion de votre boutique en temps réel.</p>
          </div>
          <div className="bg-white p-2 rounded-xl px-4 text-sm border border-slate-200 shadow-sm font-semibold text-slate-600">
            📅 {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card, idx) => (
            <div key={idx} className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className={`${card.bg} ${card.color} p-3 rounded-2xl`}>
                  <card.icon size={24} />
                </div>
                <div className="bg-slate-50 p-1 rounded-lg">
                   <ArrowUpRight className="text-slate-300" size={16} />
                </div>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{card.title}</p>
              <h3 className="text-2xl font-black mt-1 text-slate-800">{card.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section Graphique */}
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Top 5 Produits les plus vendus</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.topProducts || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="totalSold" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Liste des commandes récentes */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Dernières Commandes</h3>
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {data?.recentOrders?.length > 0 ? (
                data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                    <div>
                      <p className="font-bold text-slate-700 text-sm">{order.user.name}</p>
                      <p className="text-xs font-bold text-blue-600">{order.totalPrice} DH</p>
                    </div>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black tracking-tighter shadow-sm ${
                      order.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-40">
                  <ShoppingBag size={48} className="mb-2" />
                  <p className="text-center text-sm font-medium italic">Aucune commande pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;