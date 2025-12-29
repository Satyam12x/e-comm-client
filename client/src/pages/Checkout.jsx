import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CreditCard, MapPin, Package, ArrowRight, ArrowLeft, Check, Lock, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLocationContext } from '../context/LocationContext';
import api from '../services/api';
import Loader from '../components/Loader';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { cart, loading: cartLoading, clearCart } = useCart();
  const { user } = useAuth();
  const { location } = useLocationContext();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'cod'
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    phone: user?.phone || '',
    fullName: user?.name || '',
  });

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setAddress({
        fullName: defaultAddr.fullName || user.name || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        zipCode: defaultAddr.zipCode || '',
        country: defaultAddr.country || 'India',
        phone: defaultAddr.phone || user.phone || '',
      });
    } else if (location.city || location.pincode) {
       setAddress(prev => ({
           ...prev,
           city: location.city || prev.city,
           state: location.state || prev.state,
           zipCode: location.pincode || prev.zipCode,
           street: location.street || prev.street, 
       }));
    }
  }, [user, location]);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // 1. Create Order
      const shippingAddress = {
        fullName: address.fullName,
        addressLine1: address.street,
        city: address.city,
        state: address.state,
        pincode: address.zipCode,
        country: address.country,
        phone: address.phone,
      };

      const { data } = await api.post('/orders/create', { shippingAddress, paymentMethod });
      const { order, razorpayOrderId, key, trialMode } = data.data;

      // Handle Trial Mode, COD, or Direct Success
      if (trialMode || !razorpayOrderId || paymentMethod === 'cod') {
        setProcessingPayment(true);
        // Simulate payment processing delay for premium feel
        setTimeout(async () => {
            try {
                if (razorpayOrderId) {
                     // Even in trial mode, if we got an ID, verify it (mock verification usually)
                     // But if backend says trialMode, order is already created.
                     // We just need to simulate the "Payment Gateway" experience.
                     await api.post('/orders/verify-payment', {
                        razorpayOrderId: razorpayOrderId,
                        razorpayPaymentId: `trial_${Date.now()}`,
                        razorpaySignature: 'trial_signature',
                        orderId: order._id
                    });
                }
                
                clearCart();
                clearCart();
                navigate('/order-success', { state: { order } });
            } catch (err) {
                 console.error("Trial verification failed", err);
                 // Even if verification API fails in assumed trial, order might be pending. 
                 // But usually verification updates it to confirmed.
                 // For now, let's assume it worked or navigate to orders.
                 navigate('/orders'); // Fallback if trial logic acts weird (unlikely)
            }
        }, 2000); 
        return;
      }

      // Handle Live Razorpay
      const options = {
        key: key,
        amount: order.totalAmount * 100,
        currency: 'INR',
        name: 'BuildOwn',
        description: `Order #${order.orderNumber}`,
        image: 'https://via.placeholder.com/150', // Replace with your logo
        order_id: razorpayOrderId,
        handler: async function (response) {
            try {
                setProcessingPayment(true);
                await api.post('/orders/verify-payment', {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature,
                    orderId: order._id
                });
                clearCart();
                clearCart();
                navigate('/order-success', { state: { order: data.data?.order || order } }); // Ensure we pass the updated order if available
            } catch (error) {
                console.error('Payment verification failed', error);
                toast?.error('Payment verification failed. Please contact support.');
                setProcessingPayment(false);
            }
        },
        prefill: {
            name: user.name,
            email: user.email,
            contact: address.phone
        },
        theme: {
            color: '#000000'
        },
        modal: {
            ondismiss: function() {
                setLoading(false);
                toast?.error('Payment cancelled');
            }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Order creation failed:', error);
      toast?.error(error.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartLoading) return <Loader fullScreen={true} />;
  
  if (!cart || cart.items.length === 0) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center p-12 bg-white rounded-3xl shadow-xl max-w-md mx-auto animate-fade-in-up">
                 <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                     <Package size={40} className="text-gray-400"/>
                 </div>
                 <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                 <p className="text-gray-500 mb-8">Looks like you haven't added any premium gear yet.</p>
                 <button onClick={() => navigate('/products')} className="btn btn-primary w-full py-4 rounded-xl">Start Shopping</button>
              </div>
          </div>
      );
  }

  if (processingPayment) {
      return (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center animate-fade-in">
              <div className="w-24 h-24 mb-8 relative">
                  <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <Lock className="absolute inset-0 m-auto text-black" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Processing Secure Payment</h2>
              <p className="text-gray-500">Please do not close this window...</p>
          </div>
      );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 lg:py-12">
      <div className="container-custom max-w-7xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Checkout</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Shield size={16} className="text-green-600" />
                <span className="hidden sm:inline">256-bit SSL Secured</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 ${step === 2 ? 'opacity-60 grayscale' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
                        Shipping Details
                    </h2>
                    {step === 2 && (
                        <button onClick={() => setStep(1)} className="text-sm font-bold underline hover:text-gray-600">Edit</button>
                    )}
                </div>
                
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${step === 2 ? 'pointer-events-none' : ''}`}>
                     <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">Full Name</label>
                          <input 
                            type="text" 
                            name="fullName" 
                            value={address.fullName} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all font-medium" 
                            placeholder="John Doe" 
                          />
                     </div>
                     <div className="md:col-span-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">Street Address</label>
                          <input 
                            type="text" 
                            name="street" 
                            value={address.street} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all font-medium" 
                            placeholder="123 Gaming Lane" 
                          />
                     </div>
                     <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">City</label>
                          <input 
                            type="text" 
                            name="city" 
                            value={address.city} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all font-medium" 
                            placeholder="Metropolis" 
                          />
                     </div>
                     <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">State</label>
                           <input 
                            type="text" 
                            name="state" 
                            value={address.state} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all font-medium" 
                            placeholder="State" 
                          />
                     </div>
                     <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">Pincode</label>
                           <input 
                            type="text" 
                            name="zipCode" 
                            value={address.zipCode} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all font-medium" 
                            placeholder="110001" 
                          />
                     </div>
                     <div>
                           <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1 mb-1 block">Phone Number</label>
                           <input 
                            type="tel" 
                            name="phone" 
                            value={address.phone} 
                            onChange={handleChange} 
                            className="w-full bg-gray-50 border border-transparent focus:border-black focus:bg-white rounded-xl px-4 py-3.5 outline-none transition-all font-medium" 
                            placeholder="+91 98765 43210" 
                          />
                     </div>
                </div>

                {step === 1 && (
                    <button 
                        onClick={() => {
                            if (!address.street || !address.city || !address.zipCode || !address.phone) {
                                toast?.error("Please fill in all shipping details");
                                return;
                            }
                            setStep(2);
                        }}
                        className="mt-8 bg-black text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors ml-auto"
                    >
                        Proceed to Pay <ArrowRight size={18} />
                    </button>
                )}
            </div>

            {/* Step 2: Payment */}
            <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-300 ${step === 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                 <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>2</span>
                    Payment Method
                </h2>

                {step === 2 && (
                    <div className="animate-fade-in-up">


                        {/* Payment Method Selection */}
                        <div className="space-y-4 mb-6">
                            <label className="text-sm font-bold text-gray-900 block mb-2">Select Payment Mode</label>
                            
                            {/* Online Payment Option */}
                            <div 
                                onClick={() => setPaymentMethod('razorpay')}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'razorpay' ? 'border-black' : 'border-gray-300'}`}>
                                    {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold flex items-center gap-2">Pay Online <Shield size={14} className="text-green-600"/></h3>
                                    <p className="text-xs text-gray-500">Credit/Debit Card, UPI, NetBanking</p>
                                </div>
                            </div>

                            {/* COD Option */}
                            <div 
                                onClick={() => setPaymentMethod('cod')}
                                className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold">Cash on Delivery</h3>
                                    <p className="text-xs text-gray-500">Pay using cash when delivered (+₹50 Handling Fee)</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-gray-900/10 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <span>{paymentMethod === 'cod' ? 'Place Order' : `Pay ₹${cart.total.toLocaleString()}`}</span>}
                            {!loading && <Shield size={18} />}
                        </button>
                        
                        <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                            <Lock size={12} /> Encrypted and Secured by Razorpay
                        </p>
                    </div>
                )}
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
             <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden sticky top-24 h-fit border border-gray-100">
                 <div className="p-6 md:p-8 bg-gray-50/50">
                     <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                     <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                         {cart.items.map((item) => (
                             <div key={item.product._id} className="flex gap-4 group">
                                 <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                                     <img src={item.product.images?.[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                 </div>
                                 <div className="flex-1 py-1">
                                     <h4 className="font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                                     <p className="text-sm text-gray-500 mb-2">{item.product.category || 'Hardware'}</p>
                                     <div className="flex justify-between items-center">
                                         <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">x{item.quantity}</span>
                                         <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                                     </div>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>

                 <div className="p-6 md:p-8 space-y-3 border-t border-gray-100 bg-white">
                      <div className="flex justify-between text-gray-500">
                          <span>Subtotal</span>
                          <span className="font-medium text-gray-900">₹{cart.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-500">
                          <span>Shipping</span>
                          <span className="font-bold text-green-600">Free</span>
                      </div>
                      {cart.coupon && (
                          <div className="flex justify-between text-green-600">
                              <span className="flex items-center gap-1"><Shield size={14}/> Discount ({cart.coupon.code})</span>
                              <span className="font-bold">-₹{cart.discount.toLocaleString()}</span>
                          </div>
                      )}

                      <div className="flex justify-between text-gray-500">
                          <span>Tax (18% GST)</span>
                          <span className="font-medium text-gray-900">₹{((cart.tax || (cart.subtotal * 0.18)) + (paymentMethod === 'cod' ? 9 : 0)).toLocaleString()}</span>
                      </div>

                      {paymentMethod === 'cod' && (
                          <div className="flex justify-between text-gray-500">
                             <span>COD Handling Fee</span>
                             <span className="font-medium text-gray-900">₹50</span>
                          </div>
                      )}
                      
                      <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-end">
                          <div>
                              <span className="block text-sm text-gray-500">Total to Pay</span>
                          </div>
                          <span className="text-3xl font-black text-gray-900 tracking-tight">₹{(cart.total + (paymentMethod === 'cod' ? 59 : 0)).toLocaleString()}</span>
                      </div>
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
