import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, Tag, ShoppingBag, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';
import { useState } from 'react';
// import testImage from '../assets/test-image.jpg';
const testImage = "https://placehold.co/400?text=Product+Image";

const Cart = () => {
  const { cart, loading, updateCartItem, removeFromCart, applyCoupon, removeCoupon, clearCart } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(null);

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setIsUpdating(productId);
    await updateCartItem(productId, newQuantity);
    setIsUpdating(null);
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode) return;

    try {
      await applyCoupon(couponCode);
      setCouponSuccess('Coupon applied successfully!');
    } catch (error) {
      setCouponError(error.response?.data?.message || 'Invalid coupon code');
    }
  };

  if (loading) return <Loader fullScreen={true} />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-900 tracking-tight">Your bag is empty</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Items remain in your bag for 60 minutes, and then they're moved to your Saved Items.</p>
        <button 
          onClick={() => navigate('/products')} 
          className="bg-black text-white px-8 py-3.5 rounded-full font-bold uppercase tracking-wide hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-10">
        <div className="container-custom py-4 flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
           </button>
           <h1 className="text-xl font-bold tracking-tight">Shopping Bag ({cart.items.length})</h1>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Cart Items List */}
          <div className="flex-1 space-y-8">
            <div className="space-y-6">
                {cart.items.map((item) => (
                <div key={item.product._id} className="flex gap-6 group">
                    {/* Item Image */}
                    <div className="w-32 h-40 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                        <img
                            src={item.product.images?.[0]?.url || testImage}
                            alt={item.product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { e.target.src = testImage; }}
                        />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                         <div className="flex justify-between items-start">
                             <div>
                                 <h3 className="font-semibold text-lg text-gray-900 mb-1 leading-tight max-w-[200px] sm:max-w-md">
                                     {item.name}
                                 </h3>
                                 <p className="text-sm text-gray-500 mb-2">Category: {item.product.category || 'Accessory'}</p>
                                 {item.product.stock <= 5 && (
                                     <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                         Only {item.product.stock} left
                                     </span>
                                 )}
                             </div>
                             <p className="font-bold text-lg text-gray-900">
                                 ₹{(item.price * item.quantity).toLocaleString()}
                             </p>
                         </div>

                         <div className="flex justify-between items-center mt-4">
                             {/* Quantity Control */}
                             <div className="flex items-center gap-4">
                                 <div className="flex items-center border border-gray-200 rounded-full h-9">
                                     <button
                                         className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-l-full transition-colors disabled:opacity-30"
                                         onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                         disabled={isUpdating === item.product._id}
                                     >
                                         <Minus size={14} />
                                     </button>
                                     <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                     <button
                                         className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-r-full transition-colors disabled:opacity-30"
                                         onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                         disabled={isUpdating === item.product._id}
                                     >
                                         <Plus size={14} />
                                     </button>
                                 </div>
                                 <button
                                     onClick={() => removeFromCart(item.product._id)}
                                     className="text-gray-400 hover:text-red-500 hover:underline text-sm transition-colors"
                                 >
                                     Remove
                                 </button>
                             </div>
                         </div>
                    </div>
                </div>
                ))}
            </div>

            {/* Clear Cart Action */}
            <div className="pt-6 border-t border-gray-100">
               <button
                  onClick={clearCart}
                  className="text-xs font-bold text-red-500 uppercase tracking-widest hover:text-red-700 flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={14} /> Clear Shopping Bag
                </button>
            </div>
          </div>

          {/* Checkout Summary - Floating/Sticky */}
          <div className="lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 p-8 rounded-2xl sticky top-28">
              <h2 className="text-xl font-bold mb-6 tracking-tight">Order Summary</h2>

              <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{(cart?.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                {cart?.coupon && (
                  <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({cart.coupon.code})</span>
                      <span>-₹{(cart?.discount || 0).toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span className="font-semibold">₹{((cart?.tax || (cart?.subtotal * 0.18)) || 0).toLocaleString()}</span>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                   <div className="flex justify-between items-end">
                       <span className="text-base font-bold text-gray-900">Total</span>
                       <span className="text-3xl font-bold text-gray-900 tracking-tight">₹{(cart?.total || 0).toLocaleString()}</span>
                   </div>
                   <p className="text-xs text-gray-500 mt-1 text-right">Including VAT & taxes</p>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-8">
                {cart.coupon ? (
                   <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-green-100 shadow-sm">
                        <span className="text-green-700 font-medium flex items-center gap-2 text-sm">
                          <Tag size={14} /> {cart.coupon.code}
                        </span>
                        <button onClick={removeCoupon} className="text-gray-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                   </div>
                ) : (
                    <div className="space-y-2">
                        <div className="flex gap-2">
                             <input
                                type="text"
                                placeholder="Promo Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-black transition-colors"
                             />
                             <button 
                                onClick={handleApplyCoupon}
                                disabled={!couponCode}
                                className="bg-gray-900 text-white px-4 rounded-lg text-sm font-semibold disabled:opacity-50 hover:bg-black transition-colors"
                             >
                                Apply
                             </button>
                        </div>
                        {couponError && <p className="text-red-500 text-xs pl-1">{couponError}</p>}
                        {couponSuccess && <p className="text-green-500 text-xs pl-1">{couponSuccess}</p>}
                    </div>
                )}
              </div>

              {/* Secure Checkout Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-6 bg-white py-2 rounded-lg border border-gray-100">
                  <ShieldCheck size={14} className="text-green-600" /> Secure SSL Checkout
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                Checkout <ArrowRight size={20} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;
