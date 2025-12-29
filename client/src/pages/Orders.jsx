import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ChevronRight, ShoppingBag, MapPin, Calendar, ExternalLink, CreditCard } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

// Status Badge Component
const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-50 text-yellow-700 border-yellow-100',
    processing: 'bg-blue-50 text-blue-700 border-blue-100',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    delivered: 'bg-green-50 text-green-700 border-green-100',
    cancelled: 'bg-red-50 text-red-700 border-red-100',
  };

  const icons = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    cancelled: ShoppingBag, // Just a placeholder
  };

  const Icon = icons[status] || Package;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending} uppercase tracking-wide`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/my-orders');
      setOrders(data.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusStep = (status) => {
      const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
      return steps.indexOf(status) + 1;
  };

  if (loading) return <Loader fullScreen={true} />;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation (Replicated for consistency) */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                     <div className="p-6 border-b border-gray-50">
                        <h2 className="font-bold text-lg">My Account</h2>
                     </div>
                     <nav className="p-2 space-y-1">
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black transition-colors">
                             <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                 <Package size={16} />
                             </div>
                             Dashboard
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black text-white font-medium shadow-md shadow-gray-200">
                             <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                                 <ShoppingBag size={16} />
                             </div>
                             My Orders
                        </Link>
                         <Link to="/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-black transition-colors pointer-events-none opacity-50">
                             <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                 <MapPin size={16} />
                             </div>
                             Addresses (Soon)
                        </Link>
                     </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Order History</h1>
                    <span className="text-sm text-gray-500">Showing {orders.length} orders</span>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-6">When you place an order, it will appear here.</p>
                        <Link to="/products" className="btn btn-primary px-6 py-2.5 rounded-full inline-flex items-center gap-2">
                            Start Shopping <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                                {/* Order Header */}
                                <div className="bg-gray-50/50 p-6 flex flex-wrap justify-between items-center gap-4 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl border border-gray-200 flex items-center justify-center font-bold text-gray-400">
                                            #{order.orderNumber?.slice(-4) || 'ORD'}
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Order ID</p>
                                            <p className="font-bold text-gray-900">{order.orderNumber || order._id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Date Placed</p>
                                            <p className="font-medium flex items-center gap-1.5">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total Amount</p>
                                            <p className="font-bold">₹{order.pricing.total.toLocaleString()}</p>
                                        </div>
                                            <div className="flex flex-col items-end gap-2">
                                            <StatusBadge status={order.status} />
                                            {order.status !== 'cancelled' && (
                                                <Link 
                                                    to={`/orders/${order._id}`}
                                                    className="text-xs font-bold text-black underline flex items-center gap-1 hover:text-gray-600"
                                                >
                                                    View Details / Track
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                     <div className="space-y-4">
                                         {order.items.map((item) => (
                                             <div key={item._id} className="flex gap-4 items-center">
                                                 <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                     <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                 </div>
                                                 <div className="flex-1">
                                                     <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                     <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                 </div>
                                                 <div className="text-right">
                                                     <span className="font-semibold">₹{item.price.toLocaleString()}</span>
                                                 </div>
                                             </div>
                                         ))}
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
