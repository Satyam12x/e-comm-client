import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Upload, Save, MoreHorizontal, Image as ImageIcon, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';
import Loader from '../../components/Loader';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    countInStock: '',
    images: [], // For existing images
    newImages: [] // For file uploads
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100'); // Fetch all for now (simple admin)
      setProducts(data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
        const { data } = await api.get('/categories');
        setCategories(data.data.categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            console.error('Failed to delete product', error);
            alert('Failed to delete product');
        }
    }
  };

  const handleEdit = (product) => {
      setEditingProduct(product);
      setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category?._id || '',
          countInStock: product.countInStock,
          images: product.images || [],
          newImages: []
      });
      setIsModalOpen(true);
  };

  const handleAddNew = () => {
      setEditingProduct(null);
      setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          countInStock: '',
          images: [],
          newImages: []
      });
      setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
          // Prepare FormData for file upload
          const data = new FormData();
          const productPayload = {
              name: formData.name,
              description: formData.description,
              price: Number(formData.price),
              category: formData.category,
              stock: Number(formData.countInStock), // Backend uses 'stock' not 'countInStock'
          };

          data.append('data', JSON.stringify(productPayload));

          // Append new images
          formData.newImages.forEach(file => {
              data.append('images', file);
          });

          if (editingProduct) {
              await api.put(`/products/${editingProduct._id}`, data, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
          } else {
              await api.post('/products', data, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
          }

          setIsModalOpen(false);
          fetchProducts(); // Refresh list
      } catch (error) {
          console.error('Operation failed', error);
          alert('Failed to save product. ' + (error.response?.data?.message || ''));
      } finally {
          setLoading(false);
      }
  };

  // Image handling
  const handleImageChange = (e) => {
      if (e.target.files) {
          setFormData({ ...formData, newImages: [...formData.newImages, ...Array.from(e.target.files)] });
      }
  };

  if (loading && !isModalOpen) return <Loader fullScreen={false} />;

  return (
    <div className="relative min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-gray-500 mt-1">Manage your store inventory</p>
        </div>
        <button 
            onClick={handleAddNew}
            className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-gray-900 transition-colors font-medium"
        >
            <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 border border-gray-200 flex flex-col md:flex-row gap-4 mb-6 sticky top-20 z-10 shadow-sm">
           <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-black rounded-lg outline-none transition-all" 
                />
           </div>
           <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
               <button className="px-4 py-2.5 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium hover:border-black transition-colors whitespace-nowrap bg-white">
                   <Filter size={16} /> Category
               </button>
               <button className="px-4 py-2.5 border border-gray-200 rounded-lg flex items-center gap-2 text-sm font-medium hover:border-black transition-colors whitespace-nowrap bg-white">
                    <Box size={16} /> Stock Status
               </button>
           </div>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                 <thead className="bg-gray-50 border-b border-gray-100">
                     <tr>
                         <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Product</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Category</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Price</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Stock</th>
                         <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                     </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                     {products.map((product) => (
                         <tr key={product._id} className="hover:bg-gray-50/80 transition-colors group">
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 bg-gray-100 flex-shrink-0 border border-gray-200 overflow-hidden">
                                         {product.images?.[0]?.url ? (
                                             <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                                         ) : (
                                             <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                 <ImageIcon size={24} />
                                             </div>
                                         )}
                                     </div>
                                     <div>
                                         <p className="font-bold text-gray-900 line-clamp-1 text-base">{product.name}</p>
                                         <p className="text-xs text-gray-500 font-mono mt-0.5">ID: {product._id.slice(-6)}</p>
                                     </div>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-sm font-medium text-gray-600">
                                 {product.category?.name || 'Uncategorized'}
                             </td>
                             <td className="px-6 py-4 font-bold text-gray-900">
                                 ₹{product.price.toLocaleString()}
                             </td>
                             <td className="px-6 py-4">
                                 <div className="flex items-center gap-2">
                                     <div className={`w-2 h-2 rounded-full ${product.countInStock > 10 ? 'bg-green-500' : product.countInStock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                                     <span className="text-sm font-medium text-gray-700">{product.countInStock} units</span>
                                 </div>
                             </td>
                             <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button 
                                        onClick={() => handleEdit(product)} 
                                        className="p-2 hover:bg-gray-100 rounded text-gray-500 hover:text-black transition-colors"
                                        title="Edit Product"
                                    >
                                         <Edit2 size={18} />
                                     </button>
                                     <button 
                                        onClick={() => handleDelete(product._id)} 
                                        className="p-2 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete Product"
                                    >
                                         <Trash2 size={18} />
                                     </button>
                                 </div>
                             </td>
                         </tr>
                     ))}
                 </tbody>
             </table>
         </div>
         {products.length === 0 && !loading && (
             <div className="text-center py-20 text-gray-500">
                 No products found. Add your first product!
             </div>
         )}
      </div>

      {/* Add/Edit Modal - Full Height Slide-over */}
      <AnimatePresence>
          {isModalOpen && (
              <>
                  <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsModalOpen(false)}
                      className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                  />
                  <motion.div
                      initial={{ x: '100%' }}
                      animate={{ x: 0 }}
                      exit={{ x: '100%' }}
                      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                      className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-white shadow-2xl z-50 overflow-y-auto"
                  >
                      <div className="min-h-full flex flex-col">
                           {/* Header */}
                           <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
                               <div>
                                   <h2 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                                   <p className="text-sm text-gray-500">Fill in the details below</p>
                               </div>
                               <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                   <X size={24} />
                               </button>
                           </div>

                           {/* Form Content */}
                           <div className="flex-1 p-8 space-y-8">
                               <form id="productForm" onSubmit={handleFormSubmit} className="space-y-8">
                                   {/* Image Upload Section */}
                                   <div>
                                       <label className="block text-sm font-bold text-gray-900 mb-3">Product Images</label>
                                       <div className="grid grid-cols-4 gap-4 mb-4">
                                            {/* Existing Images Preview */}
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="aspect-square bg-gray-100 border border-gray-200 relative group overflow-hidden">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                                        className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            {/* New Images Preview */}
                                            {formData.newImages.map((file, idx) => (
                                                <div key={`new-${idx}`} className="aspect-square bg-gray-50 border border-gray-200 relative flex items-center justify-center overflow-hidden">
                                                     <img  
                                                        src={URL.createObjectURL(file)} 
                                                        alt="preview" 
                                                        className="w-full h-full object-cover opacity-80"
                                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                                     />
                                                </div>
                                            ))}
                                            
                                            <div className="aspect-square border-2 border-dashed border-gray-300 hover:border-black transition-colors bg-gray-50 cursor-pointer relative flex flex-col items-center justify-center text-gray-400 hover:text-black">
                                                <input 
                                                    type="file" 
                                                    multiple 
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <Upload size={24} className="mb-1" />
                                                <span className="text-xs font-bold uppercase">Upload</span>
                                            </div>
                                       </div>
                                       <p className="text-xs text-gray-400">
                                            Supported formats: JPG, PNG, WEBP. Max size: 5MB.
                                       </p>
                                   </div>

                                   {/* Basic Info */}
                                   <div className="space-y-6">
                                       <div>
                                           <label className="block text-sm font-bold text-gray-900 mb-2">Product Name</label>
                                           <input 
                                               type="text" 
                                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-lg outline-none transition-colors"
                                               placeholder="e.g. RTX 4090 Gaming OC"
                                               value={formData.name}
                                               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                               required
                                           />
                                       </div>
                                       
                                       <div className="grid grid-cols-2 gap-6">
                                            <div>
                                               <label className="block text-sm font-bold text-gray-900 mb-2">Category</label>
                                               <div className="relative">
                                                   <select 
                                                       className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-lg outline-none transition-colors appearance-none cursor-pointer"
                                                       value={formData.category}
                                                       onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                       required
                                                   >
                                                       <option value="">Select Category</option>
                                                       {categories.map((cat) => (
                                                           <option key={cat._id} value={cat._id}>{cat.name}</option>
                                                       ))}
                                                   </select>
                                                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                                               </div>
                                           </div>
                                            <div>
                                               <label className="block text-sm font-bold text-gray-900 mb-2">Stock Count</label>
                                               <input 
                                                   type="number" 
                                                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-lg outline-none transition-colors"
                                                   value={formData.countInStock}
                                                   onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
                                                   min="0"
                                                   required
                                               />
                                           </div>
                                       </div>

                                       <div className="grid grid-cols-2 gap-6">
                                           <div>
                                               <label className="block text-sm font-bold text-gray-900 mb-2">Price (₹)</label>
                                               <input 
                                                   type="number" 
                                                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-lg outline-none transition-colors font-mono"
                                                   value={formData.price}
                                                   onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                   min="0"
                                                   required
                                               />
                                           </div>
                                       </div>

                                       <div>
                                           <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
                                           <textarea 
                                               rows="5" 
                                               className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:border-black focus:bg-white rounded-lg outline-none transition-colors resize-none"
                                               placeholder="Detailed product specifications..."
                                               value={formData.description}
                                               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                               required
                                           ></textarea>
                                       </div>
                                   </div>
                               </form>
                           </div>

                           {/* Footer Actions */}
                           <div className="p-8 border-t border-gray-100 bg-gray-50 sticky bottom-0 z-10 flex items-center justify-end gap-4">
                               <button 
                                   type="button" 
                                   onClick={() => setIsModalOpen(false)}
                                   className="px-6 py-3 rounded-lg font-bold text-gray-600 hover:text-black hover:bg-white transition-all"
                                   disabled={loading}
                               >
                                   Cancel
                               </button>
                               <button 
                                   form="productForm"
                                   type="submit" 
                                   disabled={loading}
                                   className="px-8 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                               >
                                   {loading ? 'Saving...' : 'Save Product'}
                               </button>
                           </div>
                      </div>
                  </motion.div>
              </>
          )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManagement;
