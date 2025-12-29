import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight, Printer, Download, MapPin, Mail, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [order, setOrder] = useState(location.state?.order || null);

    useEffect(() => {
        // Redirect if no order data
        if (!location.state?.order) {
            // Optional: Fetch latest order here if needed, or redirect
            // navigate('/orders');
        }

        // Fire confetti animation
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const random = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        return () => clearInterval(interval);
    }, [location.state, navigate]);

    const handlePrint = () => {
        window.print();
    };

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                 <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Order data missing</h1>
                    <Link to="/orders" className="text-blue-600 underline">Go to My Orders</Link>
                 </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 print:bg-white print:p-0">
            {/* Print Styles */}
            <style>
            {`
                @media print {
                    nav, footer, .no-print { display: none !important; }
                    .print-full-width { width: 100% !important; max-width: none !important; box-shadow: none !important; border: none !important; margin: 0 !important; padding: 20px !important; }
                    body { background: white !important; }
                }
            `}
            </style>

            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden print-full-width">
                {/* Success Header (Hidden on Print) */}
                <div className="bg-green-50 p-8 text-center no-print">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-up">
                        <CheckCircle className="text-green-600 w-10 h-10" strokeWidth={3} />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Order Confirmed!</h1>
                    <p className="text-gray-500">Thank you for your purchase. A confirmation email has been sent.</p>
                </div>

                {/* Invoice Content */}
                <div className="p-8 md:p-12">
                     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 pb-10 border-b border-gray-100 gap-6">
                         <div>
                            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Order Number</p>
                            <h2 className="text-2xl font-black text-gray-900">#{order.orderNumber || order._id?.slice(-8).toUpperCase()}</h2>
                         </div>
                         <div className="text-left md:text-right">
                             <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Date</p>
                             <p className="text-gray-900 font-medium">
                                 {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                             </p>
                         </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                         <div>
                             <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin size={18} /> Shipping To
                             </h3>
                             <div className="text-gray-600 text-sm space-y-1">
                                 <p className="font-bold text-gray-900 text-base">{order.shippingAddress?.fullName}</p>
                                 <p>{order.shippingAddress?.addressLine1}</p>
                                 <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                                 <p>{order.shippingAddress?.country}</p>
                                 <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100 w-fit">
                                     <Phone size={14}/> {order.shippingAddress?.phone}
                                 </div>
                             </div>
                         </div>
                         <div>
                              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                 <CheckCircle size={18} /> Payment Info
                              </h3>
                              <div className="text-gray-600 text-sm space-y-1">
                                  <p className="capitalize">Method: <span className="font-medium text-gray-900">
                                      {order.payment?.method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                                  </span></p>
                                  <p>Status: <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded ${order.payment?.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                      {order.payment?.status === 'completed' ? 'Success' : 'Pending'}
                                  </span></p>
                                  {order.payment?.razorpayPaymentId && (
                                     <p className="text-xs text-gray-400 mt-2">Transaction ID: {order.payment.razorpayPaymentId}</p>
                                  )}
                              </div>
                         </div>
                     </div>

                     <div className="mb-10">
                         <h3 className="font-bold text-gray-900 mb-6">Order Items</h3>
                         <div className="border rounded-2xl overflow-hidden">
                             <table className="w-full text-sm text-left">
                                 <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
                                     <tr>
                                         <th className="px-6 py-4">Product</th>
                                         <th className="px-6 py-4 text-center">Qty</th>
                                         <th className="px-6 py-4 text-right">Price</th>
                                         <th className="px-6 py-4 text-right">Total</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-100">
                                     {order.items.map((item, idx) => (
                                         <tr key={idx}>
                                             <td className="px-6 py-4">
                                                 <div className="font-medium text-gray-900">{item.name}</div>
                                             </td>
                                             <td className="px-6 py-4 text-center text-gray-600">x{item.quantity}</td>
                                             <td className="px-6 py-4 text-right text-gray-600">₹{item.price.toLocaleString()}</td>
                                             <td className="px-6 py-4 text-right font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     </div>

                     <div className="flex justify-end">
                         <div className="w-full md:w-1/2 space-y-3">
                             <div className="flex justify-between text-gray-500 text-sm">
                                 <span>Subtotal</span>
                                 <span className="font-medium text-gray-900">₹{(order.pricing?.subtotal || 0).toLocaleString()}</span>
                             </div>
                             <div className="flex justify-between text-gray-500 text-sm">
                                 <span>Shipping</span>
                                 <span className="font-medium text-green-600">{order.pricing?.shipping === 0 ? 'Free' : `₹${order.pricing?.shipping}`}</span>
                             </div>
                             {order.pricing?.discount > 0 && (
                                <div className="flex justify-between text-green-600 text-sm">
                                    <span>Discount</span>
                                    <span>-₹{order.pricing?.discount}</span>
                                </div>
                             )}
                             {order.pricing?.handlingFee > 0 && (
                                <div className="flex justify-between text-gray-500 text-sm">
                                    <span>Handling Fee (COD)</span>
                                    <span className="font-medium text-gray-900">₹{order.pricing?.handlingFee}</span>
                                </div>
                             )}
                             <div className="flex justify-between text-gray-500 text-sm">
                                 <span>Tax (18% GST)</span>
                                 <span className="font-medium text-gray-900">₹{(order.pricing?.tax || Math.round((order.pricing?.subtotal || 0) * 0.18)).toLocaleString()}</span>
                             </div>
                             
                             <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-end">
                                 <span className="text-base font-bold text-gray-900">Total Amount</span>
                                 <span className="text-3xl font-black text-gray-900 tracking-tight">₹{(order.pricing?.total || 0).toLocaleString()}</span>
                             </div>
                         </div>
                     </div>

                     <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row gap-4 no-print">
                        <button 
                            onClick={handlePrint}
                            className="flex-1 bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                            <Download size={20} /> Download Bill
                        </button>
                        <Link 
                            to="/orders"
                            className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            View My Orders
                        </Link>
                        <Link 
                            to="/products"
                            className="flex-1 bg-white border border-gray-200 text-gray-900 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
