import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Trophy, Shield, Clock, ChevronRight, Box } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import ProductCard from '../components/ProductCard';
import ProductViewer3D from '../components/ProductViewer3D';
import BentoGrid from '../components/BentoGrid';
import ErrorBoundary from '../components/ErrorBoundary';
import api from '../services/api';
import { dummyProducts, dummyCategories, getFeaturedProducts } from '../data/dummyData';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// Import local optimized assets
import banner1 from '../assets/banner-1.webp';
import banner2 from '../assets/banner-2.webp';
import banner3 from '../assets/banner-3.jpg';
import banner4 from '../assets/banner-4.webp';

const bannerData = [
  {
    id: 1,
    image: banner1,
    badge: "POWER REDEFINED",
    badgeColor: "bg-primary-600",
    title: "The Future of Gaming is Here.",
    desc: "Experience ray-tracing like never before with the all-new RTX 4090 series. Now in stock.",
    btnText: "Shop Collection",
    btnLink: "/products"
  },
  {
    id: 2,
    image: banner2,
    badge: "FLASH SALE",
    badgeColor: "bg-yellow-500 text-black",
    title: "Upgrade Your Battlestation.",
    desc: "Exclusive deals on mechanical keyboards, mice, and high-refresh monitors.",
    btnText: "View Deals",
    btnLink: "/products"
  },
  {
    id: 3,
    image: banner3,
    badge: "IMMERSIVE REALITY",
    badgeColor: "bg-purple-600",
    title: "Dive Into New Worlds.",
    desc: "Next-gen VR headsets with 4K clarity and wireless freedom. Limits broken.",
    btnText: "Explore VR",
    btnLink: "/products?category=vr"
  },
  {
    id: 4,
    image: banner4,
    badge: "CONSOLE GAMING",
    badgeColor: "bg-blue-600",
    title: "Play Without Limits.",
    desc: "Get the latest controllers, accessories, and games for your console setup.",
    btnText: "Shop Console",
    btnLink: "/products?category=console"
  }
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const { data } = await api.get('/products');
               if (data && (data.products?.length > 0 || Array.isArray(data) && data.length > 0)) {
                   setProducts(data.products || data);
               } else {
                    setProducts(dummyProducts);
               }
          } catch (error) {
              console.error('Error fetching home products, using dummy data:', error);
              setProducts(dummyProducts);
          } finally {
              setLoading(false);
          }
      };
      fetchData();
  }, []);

  const safeProducts = Array.isArray(products) ? products : [];
  const featuredProducts = safeProducts.filter(p => p.featured).slice(0, 8);
  const newArrivals = safeProducts.slice(0, 4); // Just taking the first 4 as new

  // Use centralized categories
  const categories = dummyCategories;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      
      {/* Hero Section - Full Width */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-900">
        {/* Preload first hero image for instant visibility */}
        <link rel="preload" as="image" href={banner1} />
        
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="h-full"
        >
          {bannerData.map((banner) => (
             <SwiperSlide key={banner.id}>
                <div className="absolute inset-0 transition-transform duration-10000 hover:scale-105">
                  <img 
                    src={banner.image} 
                    alt={banner.title}
                    className="w-full h-full object-cover"
                    loading={banner.id === 1 ? "eager" : "lazy"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute inset-0 flex items-center">
                  <div className="container-custom">
                    <div className="max-w-2xl text-white pl-4 md:pl-0">
                      <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide animate-fade-in-up ${banner.badgeColor}`}>
                        {banner.badge}
                      </span>
                      <h1 className="text-4xl md:text-7xl font-bold mb-6 leading-tight animate-fade-in-up delay-100" dangerouslySetInnerHTML={{ __html: banner.title.replace(/\./, '<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">.</span>') }}>
                      </h1>
                      <p className="text-base md:text-xl text-gray-300 mb-8 animate-fade-in-up delay-200 max-w-lg leading-relaxed">
                        {banner.desc}
                      </p>
                      <div className="flex gap-4 animate-fade-in-up delay-300">
                         <Link to={banner.btnLink} className="btn btn-primary px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-primary-900/40 hover:scale-105 transition-transform">
                            {banner.btnText}
                         </Link>
                      </div>
                    </div>
                  </div>
                </div>
             </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Features Strip */}
      <section className="bg-white border-b border-gray-100 py-8 relative z-20 -mt-2 md:-mt-0">
        <div className="container-custom">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                 { icon: Zap, title: "Super Fast Shipping", desc: "Free on orders > $99" },
                 { icon: Shield, title: "Secure Warranty", desc: "100% Original items" },
                 { icon: Clock, title: "24/7 Support", desc: "Expert tech assistance" },
                 { icon: Trophy, title: "Official Dealer", desc: "Authorized retailer" }
              ].map((item, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 p-4 md:p-0 hover:bg-gray-50 md:hover:bg-transparent rounded-xl transition-colors">
                      <div className="p-3 bg-gray-100 rounded-full text-gray-900 shrink-0">
                          <item.icon size={20} strokeWidth={2.5} />
                      </div>
                      <div>
                          <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                  </div>
              ))}
           </div>
        </div>
      </section>

      {/* Image Based Categories */}
      <section className="py-20">
         <div className="container-custom">
            <div className="flex items-end justify-between mb-8">
                 <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
                    <p className="text-gray-500">Pick parts for your next masterpiece.</p>
                 </div>
                 <Link to="/products" className="hidden md:flex items-center gap-1 font-semibold text-primary-600 hover:text-primary-700">
                    See All <ChevronRight size={16} />
                 </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                 {categories.map((cat) => (
                     <Link to={`/products?category=${cat.slug}`} key={cat._id} className="group relative aspect-[4/3] md:aspect-square overflow-hidden rounded-2xl bg-gray-100">
                         <img 
                            src={cat.image} 
                            alt={cat.name}
                            loading="lazy" 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                         <div className="absolute bottom-0 left-0 p-5 w-full">
                             <h3 className="text-white font-bold text-lg md:text-xl mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">{cat.name}</h3>
                             <div className="h-0.5 w-0 bg-primary-500 group-hover:w-full transition-all duration-300" />
                         </div>
                     </Link>
                 ))}
            </div>
         </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
             <div className="text-center md:text-left">
                <span className="text-xs font-bold text-primary-600 tracking-wider uppercase">Hot Picks</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Hardware</h2>
             </div>
             <Link to="/products" className="btn btn-outline px-6 py-2 rounded-full text-sm hover:bg-black hover:text-white transition-all">
                View All Items
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))
            ) : (
                <div className="col-span-full py-12 text-center text-gray-500">
                    No featured products available at the moment.
                </div>
            )}
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <BentoGrid products={safeProducts} />

      {/* Build Your Legacy - with 3D Viewer */}
      <section className="py-20 overflow-hidden">
          <div className="container-custom">
              <div className="bg-black rounded-3xl overflow-hidden relative">
                  {/* Background Image with Overlay */}
                  <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  
                  <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
                      
                      {/* Left: Content */}
                      <div className="text-left text-white space-y-8">
                          <div>
                            <span className="px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                                Next Gen Experience
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black mt-6 leading-tight">
                                Build Your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-500">Legacy.</span>
                            </h2>
                            <p className="text-gray-400 mt-6 text-lg max-w-md leading-relaxed">
                                Customize every aspect of your dream machine. Visualize your build in 3D before you buy.
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-4">
                              <Link to="/builder" className="btn bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                                  Start Building
                              </Link>
                              <Link to="/showcase" className="btn border border-white/30 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                                  View Showcase
                              </Link>
                          </div>

                          <div className="pt-8 border-t border-white/10 flex gap-8">
                              <div>
                                  <p className="text-3xl font-bold">50k+</p>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Builders</p>
                              </div>
                              <div>
                                  <p className="text-3xl font-bold">100%</p>
                                  <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Satisfaction</p>
                              </div>
                          </div>
                      </div>

                      {/* Right: 3D Interaction */}
                      <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
                          <div className="absolute top-4 left-4 z-20">
                             <div className="flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur rounded-full border border-white/10">
                                <Box size={14} className="text-primary-400"/>
                                <span className="text-xs font-bold text-white">Interactive 3D Demo</span>
                             </div>
                          </div>
                          <ErrorBoundary>
                            <ProductViewer3D />
                          </ErrorBoundary>
                      </div>

                  </div>
              </div>
          </div>
      </section>

    </div>
  );
};

export default Home;
