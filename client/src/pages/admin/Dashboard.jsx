import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ShoppingBag, Package, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    todayRevenue: 0,
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  // Daily Goal Target (configurable or static for now)
  const DAILY_GOAL = 50000;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data } = await api.get('/admin/dashboard');
      if (data.success) {
        setStats({
            ...data.data.overview,
            recentOrders: data.data.recentOrders
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { 
      label: 'Total Revenue', 
      value: `₹${stats.totalRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'bg-black text-white', 
      trend: '+12.5%', 
      trendUp: true 
    },
    { 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      icon: ShoppingBag, 
      color: 'bg-gray-100 text-gray-900', 
      trend: '+4.3%', 
      trendUp: true 
    },
    { 
      label: 'Products', 
      value: stats.totalProducts, 
      icon: Package, 
      color: 'bg-gray-100 text-gray-900', 
      trend: '0%', 
      trendUp: true 
    },
    { 
      label: 'Total Users', 
      value: stats.totalUsers, 
      icon: Users, 
      color: 'bg-gray-100 text-gray-900', 
      trend: '+2.1%', 
      trendUp: true 
    },
  ];

  // Calculate Daily Progress
  const dailyProgress = Math.min(Math.round((stats.todayRevenue / DAILY_GOAL) * 100), 100);

  if (loading) return <div className="text-center py-20">Loading stats...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-${stat.color.split('-')[1]}-600`}>
                <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity / Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-lg">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders?.length > 0 ? (
                    stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">#{order.orderNumber?.slice(-6) || order._id.slice(-6)}</td>
                        <td className="px-6 py-4">{order.user?.name || 'Guest'}</td>
                        <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${order.status === 'delivered' ? 'bg-green-50 text-green-700' : 
                            order.status === 'cancelled' ? 'bg-red-50 text-red-700' : 
                            'bg-yellow-50 text-yellow-700'}`}>
                            {order.status}
                        </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold">₹{order.totalAmount?.toLocaleString()}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-400">No recent orders found</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions or Analytics Preview */}
        <div className="bg-black text-white rounded-2xl p-8 shadow-xl shadow-gray-200 flex flex-col justify-between">
           <div>
              <h2 className="font-bold text-xl mb-2">Daily Performance</h2>
              <p className="text-gray-400 text-sm mb-8">
                You've earned <span className="text-white font-bold">₹{stats.todayRevenue?.toLocaleString() || 0}</span> today.
              </p>

              <div>
                  <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Daily Goal (₹{DAILY_GOAL.toLocaleString()})</span>
                      <span className="font-bold">{dailyProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-500" 
                        style={{ width: `${dailyProgress}%` }}
                      ></div>
                  </div>
              </div>
           </div>
           
           <div className="pt-6 border-t border-gray-800 mt-6">
                <p className="text-sm text-gray-400 mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 gap-3">
                    <Link to="/admin/products" className="bg-white text-center text-black py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                      Add Product
                    </Link>
                    {/* Assuming you might want an Analytics page later, linking to Settings or Orders for now */}
                    <Link to="/admin/orders" className="bg-gray-800 text-center text-white py-2 rounded-lg text-sm font-bold hover:bg-gray-700 transition-colors">
                      View Reports
                    </Link>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
