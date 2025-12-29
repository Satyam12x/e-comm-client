import { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Tag, Search, X, Loader as LoaderIcon, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const toast = useToast();

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '0',
    validUntil: '',
    usageLimit: ''
  });
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const { data } = await api.get('/coupons');
      setCoupons(data.data.coupons);
    } catch (error) {
      toast?.error('Failed to fetch coupons');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(coupons.filter(c => c._id !== id));
      toast?.success('Coupon deleted successfully');
    } catch (error) {
      toast?.error('Failed to delete coupon');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      // Calculate dates
      const validFrom = new Date();
      const validUntil = new Date(formData.validUntil);
      
      const payload = {
        ...formData,
        validFrom,
        validUntil,
        code: formData.code.toUpperCase()
      };

      const { data } = await api.post('/coupons', payload);
      setCoupons([...coupons, data.data.coupon]);
      toast?.success('Coupon created successfully');
      setShowModal(false);
      
      // Reset form
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minOrderAmount: '0',
        validUntil: '',
        usageLimit: ''
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create coupon';
      toast?.error(msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coupons</h1>
          <p className="text-gray-500">Manage promo codes and discounts</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Create Coupon
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4">
        <Search size={20} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by code..." 
          className="flex-1 outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCoupons.map((coupon) => (
          <div key={coupon._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                <span className="font-mono font-bold text-lg tracking-wider">{coupon.code}</span>
              </div>
              <button 
                onClick={() => handleDelete(coupon._id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700">
                <Tag size={16} className="text-primary-600" />
                <span className="font-medium">
                  {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                </span>
                {coupon.minOrderAmount > 0 && (
                   <span className="text-xs text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 ml-auto">
                     Min: ₹{coupon.minOrderAmount}
                   </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar size={16} />
                <span>Expires: {new Date(coupon.validUntil).toLocaleDateString()}</span>
              </div>

               <div className="pt-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50">
                   <span>Used: {coupon.usedCount} times</span>
                   {coupon.usageLimit && (
                       <span>Limit: {coupon.usageLimit}</span>
                   )}
               </div>
            </div>
            
            {/* Active Status Indicator */}
            <div className={`absolute top-6 right-12 w-2.5 h-2.5 rounded-full ${new Date(coupon.validUntil) > new Date() ? 'bg-green-500' : 'bg-red-500'}`} title={new Date(coupon.validUntil) > new Date() ? 'Active' : 'Expired'} />
          </div>
        ))}
        
        {filteredCoupons.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center text-gray-400">
                <Tag size={48} className="mb-4 opacity-20" />
                <p>No coupons found</p>
            </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold">Create New Coupon</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coupon Code</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. SUMMER25"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none uppercase font-mono"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                   <select 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                      value={formData.discountType}
                      onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                   >
                     <option value="percentage">Percentage (%)</option>
                     <option value="fixed">Fixed Amount (₹)</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                   <input 
                      type="number" 
                      required
                      min="0"
                      placeholder="e.g. 10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                    />
                </div>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Amount (₹)</label>
                <input 
                  type="number" 
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  value={formData.minOrderAmount}
                  onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                    <input 
                      type="date" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      value={formData.validUntil}
                      onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (Optional)</label>
                    <input 
                      type="number" 
                      min="1"
                      placeholder="Unlimited"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                    />
                  </div>
              </div>

              <div className="pt-4 flex gap-3">
                 <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit" 
                  disabled={createLoading}
                  className="flex-1 py-2.5 bg-black text-white rounded-lg font-bold hover:bg-gray-900 flex items-center justify-center gap-2 disabled:opacity-70"
                 >
                   {createLoading ? <LoaderIcon className="animate-spin" size={18} /> : 'Create Coupon'}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
