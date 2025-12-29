import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, ShoppingBag, LogOut, MapPin, Edit2, Shield, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Loader from '../components/Loader';

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, ordersRes] = await Promise.all([
        api.get('/auth/profile'),
        api.get('/orders/my-orders')
      ]);
      setProfile({
        ...profileRes.data.data.user,
        ordersCount: ordersRes.data.data.orders.length
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen={true} />;

  const user = profile || authUser;

  // Stats
  const stats = [
      { label: 'Total Orders', value: user?.ordersCount || 0 },
      { label: 'Wishlist', value: 0 }, // Placeholder
      { label: 'Member Status', value: 'Active' }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container-custom py-12 lg:py-20">
        
        {/* Header */}
        <div className="mb-12 border-b-2 border-black pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">My Account</h1>
                <p className="text-gray-500 font-mono text-sm tracking-wide">MANAGE YOUR PROFILE & PREFERENCES</p>
            </div>
            <div className="flex items-center gap-4">
                 <div className="text-right hidden md:block">
                     <p className="font-bold text-lg">{user?.name}</p>
                     <p className="text-xs text-gray-500 font-mono">{user?.email}</p>
                 </div>
                 <div className="w-16 h-16 bg-black text-white flex items-center justify-center font-bold text-2xl border-2 border-black">
                     {user?.name?.charAt(0) || 'U'}
                 </div>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0 space-y-8">
                 <nav className="flex flex-col gap-2">
                     <Link to="/profile" className="flex items-center justify-between px-6 py-4 bg-black text-white font-bold uppercase tracking-wider text-sm group">
                         <span>Dashboard</span>
                         <ChevronRight size={16} />
                     </Link>
                     <Link to="/orders" className="flex items-center justify-between px-6 py-4 border border-gray-200 hover:border-black font-bold uppercase tracking-wider text-sm transition-colors group">
                         <span>Order History</span>
                         <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                     </Link>
                     <button onClick={logout} className="flex items-center justify-between px-6 py-4 border border-gray-200 hover:bg-red-50 hover:border-red-200 text-red-600 font-bold uppercase tracking-wider text-sm transition-colors text-left group">
                         <span>Sign Out</span>
                         <LogOut size={16} />
                     </button>
                 </nav>

                 <div className="p-6 bg-gray-50 border border-gray-100">
                     <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Shield size={16} /> Secure Account
                     </h3>
                     <p className="text-xs text-gray-500 leading-relaxed">
                         Your data is encrypted and secure. You can manage your security settings at any time.
                     </p>
                 </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-12">
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="p-6 border border-gray-200 hover:border-black transition-colors">
                            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    
                    {/* Personal Info */}
                    <div>
                        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                            <h2 className="text-xl font-bold uppercase tracking-tight">Identity</h2>
                            <button className="text-xs font-bold underline hover:text-gray-600">Edit Details</button>
                        </div>
                        <div className="space-y-6">
                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                                <div className="font-medium text-lg border-b border-transparent group-hover:border-gray-200 py-1 transition-colors">
                                    {user?.name}
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Email Address</label>
                                <div className="font-medium text-lg border-b border-transparent group-hover:border-gray-200 py-1 transition-colors">
                                    {user?.email}
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 block">Mobile</label>
                                <div className="font-medium text-lg border-b border-transparent group-hover:border-gray-200 py-1 transition-colors">
                                    {user?.phone || '—'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Book */}
                    <div>
                        <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                            <h2 className="text-xl font-bold uppercase tracking-tight">Address Book</h2>
                            <button className="text-xs font-bold bg-black text-white px-3 py-1 hover:bg-gray-800 transition-colors">
                                + Add New
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                             {user?.addresses?.length > 0 ? (
                                 user.addresses.map((addr, idx) => (
                                     <div key={idx} className="p-4 border border-gray-200 hover:border-black transition-colors relative group">
                                         {addr.isDefault && (
                                             <span className="absolute top-0 right-0 bg-black text-white text-[9px] font-bold uppercase px-2 py-0.5">Default</span>
                                         )}
                                         <div className="flex gap-4">
                                             <div className="mt-1">
                                                 <MapPin size={16} />
                                             </div>
                                             <div>
                                                 <p className="font-bold text-sm mb-1">{addr.street}</p>
                                                 <p className="text-xs text-gray-500 font-mono mb-2">
                                                     {addr.city}, {addr.state} {addr.zipCode}
                                                 </p>
                                                 <p className="text-xs font-bold uppercase">{addr.country}</p>
                                             </div>
                                         </div>
                                         <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                                             <button className="text-xs font-bold hover:underline">Edit</button>
                                             <button className="text-xs font-bold text-red-600 hover:underline">Delete</button>
                                         </div>
                                     </div>
                                 ))
                             ) : (
                                 <div className="p-8 border border-dashed border-gray-300 text-center">
                                     <p className="text-sm text-gray-400 mb-4">No addresses saved.</p>
                                     <button className="text-sm font-bold underline">Add Address</button>
                                 </div>
                             )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
