import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Search, Store, LogIn, Menu, Heart, X, MapPin, LocateFixed, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocationContext } from '../context/LocationContext';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { location, detectLocation } = useLocationContext();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setShowDropdown(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
      if (showMobileMenu) {
          document.body.style.overflow = 'hidden';
      } else {
          document.body.style.overflow = 'unset';
      }
      return () => { document.body.style.overflow = 'unset'; };
  }, [showMobileMenu]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowDropdown(false);
    setShowMobileMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowMobileMenu(false);
      setIsSearchOpen(false);
    }
  };

  const cartItemsCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const renderDropdown = () => (
     <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 transform origin-top-right transition-all animate-fade-in z-50">
        <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        
        <div className="p-2">
            {user.role === 'admin' ? (
                <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors">
                    <LayoutDashboard size={18} /> Dashboard
                </Link>
            ) : (
                <div className="flex flex-col">
                    <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors">
                        <User size={18} /> My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-xl transition-colors">
                        <ShoppingBag size={18} /> My Orders
                    </Link>
                </div>
            )}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1">
                <LogOut size={18} /> Sign Out
            </button>
        </div>
    </div>
  );

  return (
    <>
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-4 lg:gap-8">
            <button className="md:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-full" onClick={() => setShowMobileMenu(true)}>
                <Menu size={24} />
            </button>

            <Link to="/" className="text-xl font-semibold tracking-tight text-gray-900 flex items-center gap-2 group">
              <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                 <Store size={18} />
              </div>
              <span className="hidden sm:inline">BuildOwn</span>
            </Link>

            {/* Location Display (Desktop) */}
            {location.loading ? (
                 <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-gray-400">
                    <Loader2 size={14} className="animate-spin" /> Detecting...
                </div>
            ) : location.city ? (
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group border border-transparent hover:border-gray-200">
                    <LocateFixed size={16} className="text-gray-500 group-hover:text-black transition-colors" />
                    <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-gray-400 font-medium">Delivering to</span>
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-black truncate max-w-[120px]">
                            {location.city} {location.pincode}
                        </span>
                    </div>
                    <ChevronDown size={12} className="text-gray-400 ml-1" />
                </div>
            ) : (
                <button onClick={detectLocation} className="hidden lg:flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-black transition-colors">
                    <MapPin size={14} /> Detect Location
                </button>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-1 md:gap-4">
            
            {/* Expandable Search */}
            <div className="hidden md:flex items-center justify-end relative">
                {isSearchOpen ? (
                <form onSubmit={handleSearch} className="absolute right-0 top-1/2 -translate-y-1/2 w-72 animate-scale-in origin-right z-20">
                    <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-4 pr-10 py-2 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-black/5 text-sm outline-none"
                    onBlur={() => {
                        setTimeout(() => {
                           if (!searchQuery) setIsSearchOpen(false);
                        }, 200);
                    }}
                    />
                     <button 
                        type="button" 
                        onClick={() => {
                            setSearchQuery('');
                            setIsSearchOpen(false);
                        }}
                        className="absolute right-3 top-2.5 text-gray-400 hover:text-black"
                    >
                    <X size={14} />
                    </button>
                </form>
                ) : (
                <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-black transition-colors"
                >
                    <Search size={20} strokeWidth={2} />
                </button>
                )}
            </div>

            <div className="w-px h-6 bg-gray-200 hidden md:block mx-1"></div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Link to="/products" className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-black transition-colors" title="Shop">
                    <Store size={20} strokeWidth={2} />
                </Link>
                
                <Link to="/wishlist" className="hidden md:flex p-2.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-black transition-colors relative" title="Wishlist">
                    <Heart size={20} strokeWidth={2} />
                </Link>

                {(user?.role === 'customer' || !user) && (
                    <Link to="/cart" className="flex p-2.5 hover:bg-gray-100 rounded-full text-gray-600 hover:text-black transition-colors relative">
                        <ShoppingBag size={20} strokeWidth={2} />
                        {cartItemsCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 bg-black text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
                            {cartItemsCount}
                            </span>
                        )}
                    </Link>
                )}

                {/* Profile / Menu */}
                {user ? (
                    <div className="relative ml-1" ref={dropdownRef}>
                        <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-2 p-1.5 pl-2 pr-3 hover:bg-gray-100 rounded-full transition-colors border border-gray-100 hover:border-gray-200"
                        >
                            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-700">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {showDropdown && renderDropdown()}
                    </div>
                ) : (
                    <Link to="/login" className="hidden md:flex ml-2 btn btn-primary px-5 py-2 rounded-full text-sm font-medium shadow-lg shadow-gray-200 hover:shadow-xl transition-all">
                        Login
                    </Link>
                )}
            </div>
        </div>
      </div>
      </div>
    </nav>

    {/* Mobile Slide-out Drawer */}
    <AnimatePresence>
    {showMobileMenu && (
        <div className="relative z-[60]">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setShowMobileMenu(false)}
            />

            {/* Drawer */}
            <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col"
            >
                
                {/* Drawer Header */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-2 font-bold text-lg">
                         <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
                            <Store size={18} />
                         </div>
                         BuildOwn
                    </div>
                    <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Search in Drawer */}
                <div className="p-5 border-b border-gray-100">
                     <form onSubmit={handleSearch} className="relative">
                        <Search size={18} className="absolute left-4 top-3 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search components..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-100 text-sm focus:ring-2 focus:ring-black/5 outline-none font-medium"
                        />
                    </form>
                </div>

                {/* Drawer Links */}
                <div className="flex-1 overflow-y-auto p-5 space-y-2">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu</div>
                    
                    <Link to="/" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 font-medium text-gray-700 group-hover:text-black">
                            <Store size={20} /> Home
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </Link>
                    <Link to="/products" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 font-medium text-gray-700 group-hover:text-black">
                            <ShoppingBag size={20} /> Shop All
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </Link>
                    <Link to="/wishlist" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3 font-medium text-gray-700 group-hover:text-black">
                            <Heart size={20} /> Wishlist
                        </div>
                         <div className="bg-gray-100 text-[10px] font-bold px-2 py-0.5 rounded-full text-gray-600">NEW</div>
                    </Link>

                    <div className="h-px bg-gray-100 my-4"></div>

                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Account</div>
                    
                    {user ? (
                        <>
                             <Link to="/profile" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
                                <User size={20} /> My Profile
                            </Link>
                             <Link to="/orders" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700">
                                <ShoppingBag size={20} /> My Orders
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium mt-2">
                                <LogOut size={20} /> Sign Out
                            </button>
                        </>
                    ) : (
                         <Link to="/login" onClick={() => setShowMobileMenu(false)} className="flex items-center gap-3 p-3 rounded-xl bg-black text-white justify-center font-bold shadow-lg shadow-gray-200 mt-2">
                            <LogIn size={18} /> Login / Register
                        </Link>
                    )}
                </div>

                {/* Drawer Footer */}
                <div className="p-5 bg-gray-50 text-center text-xs text-gray-400">
                    &copy; 2024 BuildOwn Inc.
                </div>
            </motion.div>
        </div>
    )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;