import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import testImage from '../assets/banner-3.jpg';

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8 md:py-12 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-gray-500">
            {wishlist.length === 0 ? 'Your wishlist is empty' : `${wishlist.length} ${wishlist.length === 1 ? 'item' : 'items'} saved`}
          </p>
        </div>
        <Link to="/products" className="btn btn-outline px-6 py-2 rounded-full text-sm hover:bg-black hover:text-white transition-all flex items-center gap-2">
          <ArrowLeft size={16} />
          Continue Shopping
        </Link>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding products you love!</p>
          <Link to="/products" className="btn btn-primary px-8 py-3 rounded-full">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
              {/* Product Image */}
              <Link to={`/products/${product._id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
                <img
                  src={product.images?.[0]?.url || testImage}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = testImage; }}
                />
                {product.stock === 0 && (
                  <span className="absolute top-3 left-3 bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
                    Sold Out
                  </span>
                )}
              </Link>

              {/* Product Details */}
              <div className="p-4">
                <Link to={`/products/${product._id}`}>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate hover:underline">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-xs text-gray-500 mb-3 truncate">
                  {typeof product.category === 'object' ? product.category?.name : product.category || 'Hardware'}
                </p>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{product.comparePrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(product._id)}
                    disabled={product.stock === 0}
                    className="flex-1 bg-black text-white py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={14} />
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="p-2.5 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
