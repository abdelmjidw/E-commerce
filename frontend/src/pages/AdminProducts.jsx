import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, LogOut, 
  Search, Plus, Edit, Trash2, X, Image as ImageIcon, Loader2, UploadCloud
} from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const { logout } = useAuth();
  
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal & Preview
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Form State (Aligné sur Prisma)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    stock: '',
    categoryId: '',
    image: null
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        API.get('/products'),
        API.get('/categories')
      ]);
      setProducts(Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data.products || []));
      setCategories(catRes.data || []);
    } catch (error) {
      toast.error("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        stock: product.stock || 0,
        categoryId: product.categoryId || '',
        image: null
      });
      setImagePreview(product.imageUrl ? `http://localhost:5000${product.imageUrl}` : null);
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', description: '', price: '', originalPrice: '', stock: '0', categoryId: '', image: null });
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== '') {
        data.append(key, formData[key]);
      }
    });

    try {
      if (currentProduct) {
        await API.put(`/products/${currentProduct.id}`, data);
        toast.success("Produit mis à jour");
      } else {
        await API.post('/products', data);
        toast.success("Produit ajouté au catalogue");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer définitivement ce produit ?")) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Produit supprimé");
        fetchData();
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    }
  };

  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar - Inchangée */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col shadow-sm">
        <h2 className="text-2xl font-bold text-blue-600 mb-10 flex items-center gap-2">
           <LayoutDashboard /> Galaxy Admin
        </h2>
        <nav className="space-y-2 flex-1">
          <Link to="/dashboard" className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-medium">
            <LayoutDashboard size={20} /> Tableau de bord
          </Link>
          <Link to="/dashboard/products" className="flex items-center gap-3 w-full p-3 rounded-xl bg-blue-50 text-blue-600 font-semibold transition-all">
            <Package size={20} /> Produits
          </Link>
          <Link to="/dashboard/orders" className="flex items-center gap-3 w-full p-3 rounded-xl text-slate-500 hover:bg-slate-100 transition-all font-medium">
            <ShoppingBag size={20} /> Commandes
          </Link>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 text-red-500 p-3 hover:bg-red-50 rounded-xl transition-all mt-auto font-bold border border-transparent hover:border-red-100">
          <LogOut size={20} /> Déconnexion
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Gestion des Produits</h1>
            <p className="text-slate-500 mt-1 font-medium">{products.length} articles en ligne.</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-sm"
          >
            <Plus size={20} /> Nouveau Produit
          </button>
        </header>

        {/* Filtre */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-3">
          <Search className="text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom ou catégorie..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium"
          />
        </div>

        {/* TABLEAU ORIGINAL */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                <th className="p-4 font-bold">Image</th>
                <th className="p-4 font-bold">Nom</th>
                <th className="p-4 font-bold">Catégorie</th>
                <th className="p-4 font-bold">Prix</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    {product.imageUrl ? (
                      <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><ImageIcon size={20}/></div>
                    )}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-800">{product.name}</p>
                    <p className="text-[10px] text-slate-400 italic">Stock: {product.stock}</p>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                      {product.category?.name || 'Sans catégorie'}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-blue-600">{product.price} DH</td>
                  <td className="p-4 flex justify-center gap-3">
                    <button onClick={() => openModal(product)} className="p-2 text-amber-500 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL FIXED VIEW */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-4xl shadow-2xl relative animate-in fade-in zoom-in duration-300 flex gap-10">
            
            {/* Gauche : Image Preview */}
            <div className="w-1/3 flex flex-col gap-4">
               <label className="block text-sm font-bold text-slate-700 ml-1">Aperçu Visuel</label>
               <div className="relative h-72 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center group transition-all hover:border-blue-400">
                 {imagePreview ? (
                   <>
                     <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <UploadCloud className="text-white" size={32} />
                     </div>
                   </>
                 ) : (
                   <div className="text-center p-6 text-slate-400">
                     <UploadCloud size={40} className="mx-auto mb-2 opacity-20" />
                     <p className="text-xs font-medium">Cliquez pour ajouter</p>
                   </div>
                 )}
                 <input type="file" name="image" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
            </div>

            {/* Droite : Champs */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-800">{currentProduct ? 'Modifier' : 'Nouveau Produit'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Nom</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-medium" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Prix (DH)</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl font-black text-blue-600 outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Stock</label>
                    <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Catégorie</label>
                    <select 
                      required 
                      name="categoryId" 
                      value={formData.categoryId} 
                      onChange={handleInputChange} 
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium appearance-none"
                    >
                      <option value="">Sélectionner une catégorie...</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl h-24 resize-none outline-none font-medium" />
                </div>

                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl mt-2 active:scale-95">
                  {currentProduct ? 'Sauvegarder les changements' : 'Mettre en vente'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;