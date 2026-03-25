import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Package, LogOut, 
  Search, Plus, Edit, Trash2, X, Image as ImageIcon, Loader2, UploadCloud, Menu
} from 'lucide-react';
import API from '../api/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const AdminProducts = () => {
  const { logout } = useAuth();
  
  // États (States)
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOuvert, setMenuOuvert] = useState(false);
  
  // Modal & Aperçu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // État du formulaire
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
        API.get('/products?limit=100'),
        API.get('/categories')
      ]);
      const productsData = prodRes.data.data || [];
      setProducts(productsData);
      setCategories(catRes.data || []);
    } catch (error) {
      console.error("Erreur fetchData:", error);
      toast.error("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 ${
      isActive 
      ? "bg-blue-50 text-blue-600 font-semibold shadow-sm" 
      : "text-slate-500 hover:bg-slate-100 font-medium"
    }`;

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
      }
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
      setImagePreview(product.imageUrl || null);
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
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', String(formData.price));
    data.append('originalPrice', String(formData.originalPrice));
    data.append('stock', String(formData.stock));
    data.append('categoryId', String(formData.categoryId));

    if (formData.image) data.append('image', formData.image);

    try {
      if (currentProduct) {
        await API.put(`/products/${currentProduct.id}`, data);
        toast.success("Produit mis à jour");
      } else {
        if (!formData.image) return toast.error("Veuillez ajouter une image");
        await API.post('/products', data);
        toast.success("Produit ajouté");
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur enregistrement");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer ce produit ?")) {
      try {
        await API.delete(`/products/${id}`);
        toast.success("Produit supprimé");
        fetchData();
      } catch (error) {
        toast.error("Erreur suppression");
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      {/* Navbar Mobile */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-[54]">
        <h2 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <LayoutDashboard size={24} /> Galaxy Admin
        </h2>
        <button onClick={() => setMenuOuvert(!menuOuvert)} className="p-2 hover:bg-slate-100 rounded-lg">
          {menuOuvert ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Overlay Mobile */}
      {menuOuvert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] md:hidden" onClick={() => setMenuOuvert(false)} />
      )}

      {/* Sidebar - FIXED & Consistent */}
      <aside
        className={`fixed inset-y-0 left-0 z-[55] w-64 bg-white border-r border-slate-200 p-6 flex flex-col transition-transform duration-300 ease-in-out
          ${menuOuvert ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="hidden md:flex text-2xl font-bold text-blue-600 mb-10 items-center gap-2">
          <LayoutDashboard /> Galaxy Admin
        </h2>
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
        <button onClick={logout} className="flex items-center gap-3 text-red-500 p-3 hover:bg-red-50 rounded-xl mt-auto font-bold transition-colors group">
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" /> Déconnexion
        </button>
      </aside>

      {/* Main Content - md:ml-64 used to offset fixed sidebar */}
      <main className={`transition-all duration-300 p-4 md:p-8 ${menuOuvert ? "blur-sm md:blur-none" : ""} md:ml-64`}>
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Gestion du Catalogue</h1>
            <p className="text-slate-500 mt-1 font-medium italic">{products.length} articles répertoriés.</p>
          </div>
          <button 
            onClick={() => openModal()} 
            className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 shadow-sm transition-all active:scale-95"
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

        {/* Tableau */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold">Aperçu</th>
                    <th className="p-4 font-bold">Produit</th>
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
                          <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                        ) : (
                          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400"><ImageIcon size={20}/></div>
                        )}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-800">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Stock: {product.stock}</p>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
                          {product.category?.name || 'Général'}
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
          )}
        </div>
      </main>

      {/* Modal - Unified Design */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[70] p-4">
          <div className="max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 w-full max-w-4xl shadow-2xl flex flex-col md:flex-row gap-8 relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-full transition-all z-10"><X size={24} /></button>
            
            <div className="w-full md:w-1/3 flex flex-col gap-4">
               <label className="block text-sm font-bold text-slate-700 ml-1">Image du Produit</label>
               <div className="relative h-64 md:h-72 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] overflow-hidden flex flex-col items-center justify-center group">
                 {imagePreview ? (
                   <img src={imagePreview} className="w-full h-full object-cover" alt="Aperçu" />
                 ) : (
                   <div className="text-center p-6 text-slate-400">
                     <UploadCloud size={40} className="mx-auto mb-2 opacity-20" />
                     <p className="text-xs font-medium">Uploader l'image</p>
                   </div>
                 )}
                 <input type="file" name="image" onChange={handleInputChange} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-black text-slate-800 mb-6">{currentProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Nom du produit</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Prix de vente</label>
                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-3.5 bg-blue-50/50 border border-blue-100 rounded-2xl font-black text-blue-600 outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Stock</label>
                    <input required type="number" name="stock" value={formData.stock} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Catégorie</label>
                  <select required name="categoryId" value={formData.categoryId} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium">
                    <option value="">Sélectionner...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 ml-1">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl h-24 resize-none outline-none font-medium" />
                </div>
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                  {currentProduct ? 'Enregistrer' : 'Mettre en vente'}
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