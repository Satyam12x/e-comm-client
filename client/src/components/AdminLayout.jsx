import { Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Tag, Users, LogOut, Menu, X, ChevronRight, Settings } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    if (user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/admin/products', label: 'Products', icon: Package },
        { path: '/admin/orders', label: 'Orders', icon: ShoppingBag },
        { path: '/admin/coupons', label: 'Coupons', icon: Tag },
        // { path: '/admin/users', label: 'Users', icon: Users },
    ];

    const SidebarContent = () => (
        <>
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-50 flex-shrink-0">
                 <Link to="/" className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 bg-black rounded-lg flex-shrink-0 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">B</span>
                    </div>
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-bold text-xl tracking-tight whitespace-nowrap"
                            >
                                BuildOwn
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${
                                isActive 
                                ? 'bg-black text-white' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                            }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-black'} />
                            
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-sm font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-4 px-3 py-1 bg-black text-white text-xs font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-gray-100 mt-auto">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow text-gray-500 hover:text-black hidden md:block"
                >
                    <ChevronRight size={14} className={`transition-transform duration-300 ${isSidebarOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${!isSidebarOpen && 'justify-center'}`}>
                    <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-gray-700 border border-gray-200">
                         {user?.name?.charAt(0)}
                    </div>
                    {isSidebarOpen && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold truncate text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">Administrator</p>
                        </div>
                    )}
                    {(isSidebarOpen || isMobileOpen) && (
                        <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                            <LogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                transition={{ duration: 0.3, type: 'spring', stiffness: 100 }}
                className="bg-white border-r border-gray-100 h-screen sticky top-0 hidden md:flex flex-col z-20 shadow-sm"
            >
                <SidebarContent />
            </motion.aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-50 flex flex-col shadow-2xl md:hidden"
                        >
                            <div className="absolute right-4 top-4">
                                <button onClick={() => setIsMobileOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-auto">
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-100 h-16 flex items-center justify-between px-4 md:px-10">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => {
                                setIsMobileOpen(true);
                                setIsSidebarOpen(true); // Ensure expanded view on mobile
                            }}
                            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg md:hidden"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg md:text-xl font-bold capitalize truncate">
                            {location.pathname.split('/').pop() || 'Dashboard'}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                         <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors relative">
                            <ShoppingBag size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                         </button>
                    </div>
                </header>
                
                <div className="p-4 md:p-10 max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
