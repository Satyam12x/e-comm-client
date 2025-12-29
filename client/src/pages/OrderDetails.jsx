import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Package, Truck, CheckCircle, Clock, ShoppingBag, MapPin, Calendar, ArrowLeft, CreditCard, Download, ExternalLink } from 'lucide-react';
import api from '../services/api';
import Loader from '../components/Loader';

// Reuse Status Badge
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
    cancelled: ShoppingBag,
  };

  const Icon = icons[status] || Package;

  return (
    <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles.pending} uppercase tracking-wide`}>
      <Icon size={12} />
      {status}
    </span>
  );
};

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data.data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status) => {
      const steps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
      return steps.indexOf(status) + 1;
  };

  if (loading) return <Loader fullScreen={true} />;
  if (!order) return <div className="text-center py-20">Order not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container-custom max-w-5xl">
        <Link to="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-6 font-medium transition-colors">
            <ArrowLeft size={20} /> Back to Orders
        </Link>

        {/* Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-wrap justify-between items-end gap-6">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold tracking-tight">Order #{order.orderNumber}</h1>
                    <StatusBadge status={order.status} />
                </div>
                <p className="text-gray-500 flex items-center gap-2">
                    <Calendar size={16} /> Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
            <button className="btn btn-secondary px-6 py-2.5 rounded-full flex items-center gap-2 text-sm">
                <Download size={16} /> Download Invoice
            </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Timeline & Items */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Tracking / Status Timeline */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <Package size={20} /> Order Status
                    </h2>
                    
                    <div className="relative pl-4">
                        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-100"></div>
                        <div className="space-y-8 relative">
                           {[
                               { id: 'pending', label: 'Order Placed', desc: 'We have received your order.' },
                               { id: 'confirmed', label: 'Confirmed', desc: 'Your order has been confirmed.' },
                               { id: 'processing', label: 'Processing', desc: 'We are preparing your order.' },
                               { id: 'shipped', label: 'Shipped', desc: 'Your order has been shipped.' },
                               { id: 'delivered', label: 'Delivered', desc: 'Package delivered.' }
                           ].map((step, index) => {
                               const currentStep = getStatusStep(order.status);
                               const stepIndex = index + 1;
                               const isCompleted = stepIndex <= currentStep;
                               const isCurrent = stepIndex === currentStep;

                               return (
                                   <div key={step.id} className="flex gap-6 relative z-10">
                                       <div className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-white transition-all duration-500
                                           ${isCompleted 
                                               ? 'border-black bg-black text-white' 
                                               : 'border-gray-200 text-gray-300'
                                           } ${isCurrent ? 'ring-4 ring-black/10 scale-110' : ''}`}>
                                           {isCompleted ? <CheckCircle size={14} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                       </div>
                                       <div className={`${isCompleted ? 'opacity-100' : 'opacity-40'} pt-1`}>
                                           <h4 className="font-bold text-base">{step.label}</h4>
                                           <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                                            {isCurrent && order.trackingInfo && (
                                                <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm border border-gray-100 inline-block">
                                                    <p className="font-medium text-black">Tracking Number:</p>
                                                    <p className="text-blue-600 font-mono">{order.trackingInfo.trackingNumber}</p>
                                                    {order.trackingInfo.carrier && <p className="text-gray-500 text-xs mt-1">via {order.trackingInfo.carrier}</p>}
                                                </div>
                                            )}
                                       </div>
                                   </div>
                               );
                           })}
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                     <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <ShoppingBag size={20} /> Items ({order.items.length})
                    </h2>
                    <div className="space-y-6">
                        {order.items.map((item) => (
                            <div key={item._id} className="flex gap-6 items-center group">
                                <Link to={`/products/${item.product._id}`} className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </Link>
                                <div className="flex-1">
                                    <Link to={`/products/${item.product._id}`} className="font-bold text-gray-900 text-lg hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">
                                        {item.name}
                                    </Link>
                                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg">₹{item.price.toLocaleString()}</p>
                                    <p className="text-sm text-gray-400">Total: ₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Address & Payment */}
            <div className="space-y-8">
                
                {/* Shipping Address */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <MapPin size={20} /> Shipping Details
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Delivering To</p>
                            <p className="font-bold text-lg">{order.shippingAddress?.fullName}</p>
                        </div>
                         <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                            <p className="text-gray-600 leading-relaxed">
                                {order.shippingAddress?.addressLine1}
                                {order.shippingAddress?.addressLine2 && <br/>}
                                {order.shippingAddress?.addressLine2}<br/>
                                {order.shippingAddress?.city}, {order.shippingAddress?.state}<br/>
                                {order.shippingAddress?.pincode}, {order.shippingAddress?.country}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Contact</p>
                            <p className="font-medium">{order.shippingAddress?.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <CreditCard size={20} /> Payment Summary
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span className="font-medium text-gray-900">₹{order.pricing.subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Tax (18% GST)</span>
                            <span className="font-medium text-gray-900">₹{(order.pricing.tax || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Shipping</span>
                            <span className="font-bold text-green-600">Free</span>
                        </div>
                        {order.pricing.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount</span>
                                <span className="font-bold">-₹{order.pricing.discount.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="border-t border-gray-100 pt-6">
                        <div className="flex justify-between items-end">
                            <span className="font-bold text-lg">Total Paid</span>
                            <span className="text-3xl font-black tracking-tight">₹{order.pricing.total.toLocaleString()}</span>
                        </div>
                        <div className="mt-4 bg-gray-50 rounded-xl p-3 flex items-center gap-3 text-sm text-gray-500">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle size={14} /> 
                            </div>
                            Paid via {order.payment.method === 'razorpay' ? 'Razorpay Secure' : 'Payment Gateway'}
                        </div>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;
