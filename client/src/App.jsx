import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy Load Pages
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));

// Admin Pages
import AdminLayout from './components/AdminLayout';
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const ProductManagement = lazy(() => import('./pages/admin/ProductManagement'));
const OrderManagement = lazy(() => import('./pages/admin/OrderManagement'));
const CouponManagement = lazy(() => import('./pages/admin/CouponManagement'));

// Loading Fallback
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

// Title Updater Component
const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Hardware Components & Peripherals',
      '/products': 'Shop All Premium Hardware',
      '/cart': 'Your Shopping Cart',
      '/wishlist': 'Your Wishlist',
      '/checkout': 'Secure Checkout',
      '/orders': 'My Orders',
      '/order-success': 'Order Confirmed',
      '/profile': 'My Profile',
      '/login': 'Login | Join Elite Builders',
      '/register': 'Register Account',
      '/admin': 'Admin Dashboard',
    };

    const defaultTitle = 'BuildOwn - Build Your Dream PC';
    const currentTitle = titles[location.pathname];

    // For dynamic routes (basic check)
    if (!currentTitle) {
      if (location.pathname.startsWith('/products/')) {
        document.title = 'Product Details | BuildOwn';
      } else if (location.pathname.startsWith('/orders/')) {
        document.title = 'Order Details | BuildOwn';
      } else {
        document.title = defaultTitle;
      }
    } else {
      document.title = `${currentTitle} | BuildOwn`;
    }
  }, [location]);

  return null;
};

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <TitleUpdater />
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route element={<ProtectedRoute />}>
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/products" element={<ProductManagement />} />
                    <Route path="/admin/orders" element={<OrderManagement />} />
                    <Route path="/admin/coupons" element={<CouponManagement />} />
                </Route>
            </Route>
            </Routes>
        </Suspense>
      </main>
      
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
