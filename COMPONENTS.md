# Frontend Components - Copy these into respective files

This document contains all essential frontend components. Create each file in the specified location.

## Components

### components/ProtectedRoute.jsx
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
```

### components/Loader.jsx
```jsx
const Loader = ({ fullScreen = true }) => {
  const containerClass = fullScreen
    ? 'flex justify-center items-center min-h-screen'
    : 'flex justify-center items-center p-8';

  return (
    <div className={containerClass}>
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
    </div>
  );
};

export default Loader;
```

### components/Navbar.jsx
```jsx
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-gradient">
            Hardware Shop
          </Link>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user && user.role === 'customer' &&  (
              <Link to="/cart" className="relative">
                <ShoppingCart className="text-gray-700 hover:text-primary-600 transition-colors" size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User size={20} />
                  <span>{user.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        <LayoutDashboard size={18} />
                        Admin Dashboard
                      </Link>
                    )}
                    {user.role === 'customer' && (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={18} />
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Orders
                        </Link>
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

### components/Footer.jsx
```jsx
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-xl font-bold mb-4">Hardware Shop</h3>
            <p className="text-sm">
              Your one-stop shop for all IT hardware needs. Quality  products at competitive prices.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">Returns</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>Email: support@hardwareshop.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Mumbai, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Hardware Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

### components/ProductCard.jsx
```jsx
import { ShoppingCart, Eye, Cube } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);

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

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product._id}`} className="card group">
      <div className="relative overflow-hidden aspect-square bg-gray-100">
        <img
          src={product.images[0]?.url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        {product.model3D && (
          <div className="absolute top-2 right-2 bg-primary-600 text-white p-2 rounded-full">
            <Cube size={16} />
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {product.shortDescription || product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-primary-600">
            ₹{product.price.toLocaleString()}
          </span>
          {product.comparePrice && (
            <span className="text-gray-400 line-through text-sm">
              ₹{product.comparePrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating.average)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating.count})</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || adding}
          className="w-full btn btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} />
          {adding ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
```

## Continue with FRONTEND_GUIDE.md for page implementations

All page components follow similar patterns:
1. Import necessary hooks and components
2. Fetch data using the api service
3. Handle loading and error states
4. Render UI using Tailwind classes
5. Handle user interactions

Refer to FRONTEND_GUIDE.md for detailed examples of each page component.
