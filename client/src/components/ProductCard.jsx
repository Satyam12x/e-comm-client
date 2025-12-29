import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useState, useMemo } from 'react';
import productsHero from '../assets/products-hero.webp';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setTogglingWishlist(true);
    try {
      await toggleWishlist(product._id);
    } finally {
      setTogglingWishlist(false);
    }
  };

  // Memoize expensive calculations
  const discount = useMemo(() => 
    product.comparePrice
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0,
    [product.comparePrice, product.price]
  );

  const imageUrl = useMemo(() => 
    product.images?.[0]?.url || productsHero,
    [product.images]
  );

  return (
    <Link 
      to={`/products/${product._id}`} 
      className="group relative bg-white block overflow-hidden rounded-sm transition-all duration-500 hover:shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => { e.target.src = productsHero; }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.stock === 0 ? (
            <span className="bg-black/80 backdrop-blur text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              Sold Out
            </span>
          ) : discount > 0 ? (
             <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              -{discount}%
            </span>
          ) : product.isNew ? (
             <span className="bg-white/90 backdrop-blur text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest">
              New
            </span>
          ) : null}
        </div>

        {/* Floating Actions - Shown on Hover */}
        <div className={`absolute right-3 top-3 flex flex-col gap-2 transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'}`}>
          <button 
            onClick={handleWishlistToggle}
            disabled={togglingWishlist}
            className={`w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg ${isInWishlist(product._id) ? 'text-red-500' : ''}`}
          >
            <Heart size={16} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
          </button>
          <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-black hover:text-white transition-colors shadow-lg">
             <Eye size={16} />
          </button>
        </div>

        {/* Quick Add Button - Slide Up */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 translate-y-0 md:translate-y-full ${isHovered ? 'md:translate-y-0' : ''}`}>
           <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || adding}
            className="w-full bg-black text-white py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {adding ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> 
             ) : (
               <>
                 <ShoppingCart size={14} /> Add to Cart
               </>
             )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-4 bg-white relative z-10">
        <h3 className="font-medium text-sm text-gray-900 mb-1 truncate group-hover:underline decoration-1 underline-offset-4">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2 truncate">
           {typeof product.category === 'object' ? product.category?.name : product.category || 'Accessories'}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.comparePrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
