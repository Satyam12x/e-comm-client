import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Award, Package, Users, ShoppingBag, Zap, Shield } from 'lucide-react';

const BentoGrid = ({ products = [] }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Get featured/best products (limit to 3)
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 text-xs md:text-sm font-bold mb-6 backdrop-blur-sm border border-primary-200/50">
            <Sparkles size={16} className="animate-pulse" />
            Premium Selection
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
              Discover
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-primary-600 animate-gradient">
              Excellence
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Curated collection of our finest products and exclusive features
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Large Featured Card - Spans 2x2 */}
          <div 
            className={`lg:col-span-2 lg:row-span-2 relative group rounded-3xl overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black p-8 md:p-10 transform transition-all duration-700 hover:scale-[1.02] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0ms' }}
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593642532454-e138e28a63f4?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold mb-6">
                  <Award size={14} className="text-yellow-400" />
                  Featured Collection
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                  Premium Gaming<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                    Hardware
                  </span>
                </h3>
                <p className="text-gray-300 mb-8 max-w-md leading-relaxed">
                  Experience next-level performance with cutting-edge technology designed for champions.
                </p>
              </div>
              <div>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-colors group-hover:gap-3"
                >
                  Shop Now
                  <Zap size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Card 1 */}
          <div 
            className={`relative group rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 md:p-8 overflow-hidden transform transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <Users className="text-white" size={24} />
              </div>
              <p className="text-5xl font-black text-white mb-2">50k+</p>
              <p className="text-blue-100 font-medium">Happy Customers</p>
            </div>
          </div>

          {/* Stats Card 2 */}
          <div 
            className={`relative group rounded-3xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 md:p-8 overflow-hidden transform transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                <Package className="text-white" size={24} />
              </div>
              <p className="text-5xl font-black text-white mb-2">1000+</p>
              <p className="text-purple-100 font-medium">Products Available</p>
            </div>
          </div>

          {/* Product Card 1 - if available */}
          {featuredProducts[0] ? (
            <Link
              to={`/products/${featuredProducts[0]._id}`}
              className={`relative group rounded-3xl bg-white border-2 border-gray-100 p-6 overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="aspect-square rounded-2xl bg-gray-50 mb-4 overflow-hidden">
                  <img 
                    src={featuredProducts[0].images?.[0]?.url || featuredProducts[0].image || '/assets/test-image.jpg'} 
                    alt={featuredProducts[0].name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{featuredProducts[0].name}</h4>
                <p className="text-2xl font-black text-primary-600">${featuredProducts[0].price}</p>
              </div>
            </Link>
          ) : (
            <div 
              className={`relative group rounded-3xl bg-gradient-to-br from-green-500 to-green-600 p-6 md:p-8 overflow-hidden transform transition-all duration-700 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <p className="text-3xl font-black text-white mb-2">Best Sellers</p>
                <p className="text-green-100 font-medium text-sm">Top rated products</p>
              </div>
            </div>
          )}

          {/* Feature Card - Wide */}
          <div 
            className={`lg:col-span-2 relative group rounded-3xl bg-gradient-to-r from-orange-500 to-red-500 p-6 md:p-8 overflow-hidden transform transition-all duration-700 hover:scale-[1.02] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Shield className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-1">100% Authentic</h3>
                  <p className="text-orange-100">Official warranty on all products</p>
                </div>
              </div>
              <Link 
                to="/products" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-full font-bold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Product Card 2 - if available */}
          {featuredProducts[1] ? (
            <Link
              to={`/products/${featuredProducts[1]._id}`}
              className={`relative group rounded-3xl bg-white border-2 border-gray-100 p-6 overflow-hidden transform transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative z-10">
                <div className="aspect-square rounded-2xl bg-gray-50 mb-4 overflow-hidden">
                  <img 
                    src={featuredProducts[1].images?.[0]?.url || featuredProducts[1].image || '/assets/test-image.jpg'} 
                    alt={featuredProducts[1].name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1">{featuredProducts[1].name}</h4>
                <p className="text-2xl font-black text-primary-600">${featuredProducts[1].price}</p>
              </div>
            </Link>
          ) : (
            <div 
              className={`relative group rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 p-6 md:p-8 overflow-hidden transform transition-all duration-700 hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: '500ms' }}
            >
              <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                  <Zap className="text-white" size={24} />
                </div>
                <p className="text-3xl font-black text-white mb-2">Flash Deals</p>
                <p className="text-yellow-100 font-medium text-sm">Limited time offers</p>
              </div>
            </div>
          )}

          {/* CTA Card */}
          <div 
            className={`relative group rounded-3xl bg-gradient-to-br from-gray-900 to-black p-6 md:p-8 overflow-hidden transform transition-all duration-700 hover:scale-105 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-4">
                <ShoppingBag className="text-primary-400" size={24} />
              </div>
              <div>
                <p className="text-2xl font-black text-white mb-2">Start Shopping</p>
                <p className="text-gray-400 text-sm mb-4">Explore our full catalog</p>
                <Link 
                  to="/products" 
                  className="inline-flex items-center gap-2 text-primary-400 font-bold hover:gap-3 transition-all"
                >
                  Browse All
                  <Zap size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
