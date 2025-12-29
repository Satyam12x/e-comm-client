# Frontend Implementation Guide

This guide contains all the remaining frontend components that need to be created. Due to file size, I'm providing the structure and key implementations.

## Context Providers

### AuthContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password, isAdmin = false) => {
    const endpoint = isAdmin ? '/auth/admin/login' : '/auth/login';
    const { data } = await api.post(endpoint, { email, password });
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
```

### CartContext.jsx
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      setCart(data.data.cart);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity });
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const { data          } = await api.delete(`/cart/remove/${productId}`);
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const applyCoupon = async (code) => {
    try {
      const { data } = await api.post('/cart/coupon/apply', { code });
      setCart(data.data.cart);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete('/cart/clear');
      setCart(data.data.cart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    applyCoupon,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
```

## App.jsx - Main Router
```jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CouponManagement from './pages/admin/CouponManagement';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<ProductManagement />} />
            <Route path="/admin/orders" element={<OrderManagement />} />
            <Route path="/admin/coupons" element={<CouponManagement />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
```

## Quick Start Instructions

1. **Create Context Files**:
   - Create `src/context/AuthContext.jsx` with the AuthContext code above
   - Create `src/context/CartContext.jsx` with the CartContext code above

2. **Create App.jsx**:
   - Create `src/App.jsx` with the router configuration above

3. **Create Remaining Components**:
   - All component files are listed in the implementation plan
   - Use the backend API service (`src/services/api.js`) for all HTTP requests
   - Follow the existing design system from `index.css`

4. **Component Structure Examples**:

### ProtectedRoute.jsx
```jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;

  return <Outlet />;
};

export default ProtectedRoute;
```

### Loader.jsx
```jsx
const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600"></div>
    </div>
  );
};

export default Loader;
```

### ProductCard.jsx
```jsx
import { ShoppingCart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    await addToCart(product._id);
  };

  return (
    <Link to={`/products/${product._id}`} className="card group">
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.images[0]?.url || '/placeholder.png'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-primary-600">₹{product.price}</span>
          {product.comparePrice && (
            <span className="text-gray-400 line-through">₹{product.comparePrice}</span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
```

## Pages Implementation

### Home.jsx (with Banner)
- Use Swiper for banner carousel
- Featured products section
- Categories grid
- Call-to-action sections

### Products.jsx
- Product grid with ProductCard
- Filters sidebar (category, price range)
- Sort options
- Pagination
- Search functionality

### ProductDetail.jsx
- Image gallery
- 3D viewer button (if model available)
- Add to cart with quantity selector
- Product specifications
- Reviews section

### Cart.jsx
- Cart items list
- Quantity controls
- Coupon input
- Price breakdown
- Checkout button

### Checkout.jsx
- Shipping address form
- Order summary
- Razorpay integration
- Payment button

## Admin Pages

### Dashboard.jsx
- Stats cards (total orders, revenue, users, products)
- Charts (sales analytics)
- Recent orders table
- Low stock alerts

### ProductManagement.jsx
- Product list table
- Add/Edit product modal
- Image and 3D model upload
- Delete confirmation

### OrderManagement.jsx
- Orders table with filters
- Status update dropdown
- Order details modal
- Track order timeline

### CouponManagement.jsx
- Coupons list
- Create coupon form
- Generate random coupon button
- Delete/Edit actions

## Final Steps

1. Run setup script: `setup.bat`
2. Create all context files
3. Create App.jsx
4. Create component files as needed
5. Create page files
6. Test the application

All API endpoints are documented in README.md. Use the `api` service for all HTTP requests.

The design system is in `index.css` with utility classes ready to use.
