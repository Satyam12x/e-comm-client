import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star, Truck, ShieldCheck, ArrowRight, Activity, Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { getProductById, getProductsByCategory } from '../data/dummyData';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedImage, setSelectedImage] = useState(0);

  const fallbackImage = "/assets/test-image.jpg";

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      
      let productData = null;
      let shouldUseDummy = false;

      try {
        const { data } = await api.get(`/products/${id}`);
        const extractedProduct = data?.data?.product || data?.product || data;
        
        if (extractedProduct && extractedProduct._id && extractedProduct.name) {
          productData = extractedProduct;
          console.log('Using API product data:', productData);
        } else {
          console.log('API returned invalid product data, using dummy data');
          shouldUseDummy = true;
        }
      } catch (apiError) {
        console.log('API request failed, using dummy data:', apiError.message);
        shouldUseDummy = true;
      }

      if (shouldUseDummy || !productData) {
        const dummyProduct = getProductById(id);
        if (dummyProduct) {
          productData = dummyProduct;
          console.log('Using dummy product data:', productData);
        } else {
          console.error('Product not found in dummy data either');
        }
      }

      if (productData) {
        setProduct(productData);

        try {
          if (shouldUseDummy || !productData) {
            const categorySlug = productData.category?.slug || productData.category;
            if (categorySlug) {
              const related = getProductsByCategory(categorySlug).filter(p => p._id !== id).slice(0, 4);
              setRelatedProducts(related);
            }
          } else {
            const categoryId = typeof productData.category === 'object' ? productData.category._id : productData.category;
            if (categoryId) {
              try {
                const relatedRes = await api.get(`/products?category=${categoryId}&limit=5`);
                const relatedList = relatedRes.data?.products || relatedRes.data?.data?.products || [];
                setRelatedProducts(relatedList.filter(p => p._id !== id).slice(0, 4));
              } catch (err) {
                const categorySlug = productData.category?.slug;
                if (categorySlug) {
                  const related = getProductsByCategory(categorySlug).filter(p => p._id !== id).slice(0, 4);
                  setRelatedProducts(related);
                }
              }
            }
          }
        } catch (error) {
          console.log('Error fetching related products:', error);
        }
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchProductAndRelated();
  }, [id]);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAdding(false);
    }
  };

  const handleWishlistToggle = async () => {
    setTogglingWishlist(true);
    try {
      await toggleWishlist(product._id);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const getImageUrl = (imageObj) => {
    const url = typeof imageObj === 'object' ? imageObj?.url : imageObj;
    if (!url) return fallbackImage;
    if (typeof url === 'string' && url.startsWith('http')) return url;
    return fallbackImage;
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="container-custom py-20 text-center">Product not found</div>;
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : (product.image ? [{ url: product.image }] : [{ url: fallbackImage }]);

  const stockValue = product.countInStock || product.stock || 0;

  return (
    <div className="animate-fade-in pb-20">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container-custom py-4">
             <div className="text-sm breadcrumbs text-gray-500">
                <Link to="/" className="hover:text-black">Home</Link> <span className="mx-2">&gt;</span>
                <Link to="/products" className="hover:text-black">Products</Link> <span className="mx-2">&gt;</span>
                <span className="text-gray-900 font-medium truncate">{product.name}</span>
             </div>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Gallery Section */}
          <div className="space-y-4">
             <div className="aspect-square bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 relative group">
                <img 
                    src={getImageUrl(images[selectedImage])} 
                    alt={product.name} 
                    loading={selectedImage === 0 ? "eager" : "lazy"}
                    className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.target.src = fallbackImage; }}
                />
                {stockValue <= 5 && stockValue > 0 && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        Only {stockValue} left!
                    </span>
                )}
                
                {/* Arrow Navigation - Only show if more than 1 image */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {selectedImage + 1} / {images.length}
                    </div>
                  </>
                )}
             </div>
             {images.length > 1 && (
                 <div className="grid grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            className={`aspect-square rounded-xl bg-gray-50 border-2 overflow-hidden transition-all ${selectedImage === idx ? 'border-primary-600 shadow-md transform -translate-y-1' : 'border-transparent hover:border-gray-200'}`}
                        >
                            <img 
                                src={getImageUrl(img)} 
                                alt="" 
                                loading="lazy"
                                className="w-full h-full object-contain p-2"
                                onError={(e) => { e.target.src = fallbackImage; }}
                            />
                        </button>
                    ))}
                 </div>
             )}
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-2 flex items-center gap-2">
                 <span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600 uppercase tracking-widest">
                    {typeof product.category === 'object' ? product.category.name : 'Hardware'}
                 </span>
                 {product.featured && (
                     <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Featured
                     </span>
                 )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={20} fill="currentColor" className="stroke-none" />
                    ))}
                </div>
                <span className="text-sm text-gray-500 font-medium">(4.9/5 Rating)</span>
            </div>

            <div className="text-4xl font-bold text-gray-900 mb-8 flex items-baseline gap-3">
                ₹{product.price?.toLocaleString() || '0'}
                {product.comparePrice && (
                  <span className="text-lg text-gray-400 font-normal line-through">₹{product.comparePrice.toLocaleString()}</span>
                )}
            </div>

            {/* Tabs Header */}
            <div className="flex gap-8 border-b border-gray-100 mb-6">
                 {['overview', 'specs', 'shipping'].map(tab => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-semibold uppercase tracking-wide transition-all border-b-2 ${
                            activeTab === tab 
                            ? 'border-primary-600 text-primary-600' 
                            : 'border-transparent text-gray-400 hover:text-gray-600'
                        }`}
                     >
                        {tab}
                     </button>
                 ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[150px] mb-10 text-gray-600 leading-relaxed">
                 {activeTab === 'overview' && (
                     <div className="animate-fade-in">
                         <p>{product.description}</p>
                         <ul className="mt-4 space-y-2">
                             <li className="flex items-center gap-2"><Activity size={16} className="text-green-500" /> High Performance Architecture</li>
                             <li className="flex items-center gap-2"><Cpu size={16} className="text-primary-500" /> Next-Gen Processing</li>
                             <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-blue-500" /> 2-Year Official Warranty</li>
                         </ul>
                     </div>
                 )}
                 {activeTab === 'specs' && (
                     <div className="animate-fade-in space-y-4">
                         <div className="grid grid-cols-2 gap-4 text-sm border-b border-gray-100 pb-4">
                             <div className="font-semibold text-gray-900">Manufacturer</div>
                             <div>{product.brand || 'BuildOwn Certified'}</div>
                             <div className="font-semibold text-gray-900">Category</div>
                             <div>{typeof product.category === 'object' ? product.category.name : product.category}</div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 text-sm border-b border-gray-100 pb-4">
                             <div className="font-semibold text-gray-900">Availability</div>
                             <div className={stockValue > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                                 {stockValue > 0 ? `In Stock (${stockValue} units)` : 'Out of Stock'}
                             </div>
                             <div className="font-semibold text-gray-900">SKU</div>
                             <div className="font-mono text-xs">{product._id}</div>
                         </div>
                         <div className="grid grid-cols-2 gap-4 text-sm">
                             <div className="font-semibold text-gray-900">Warranty</div>
                             <div>2 Years Manufacturer Warranty</div>
                             <div className="font-semibold text-gray-900">Condition</div>
                             <div>Brand New</div>
                         </div>
                     </div>
                 )}
                 {activeTab === 'shipping' && (
                     <div className="animate-fade-in space-y-4">
                         <div className="flex items-start gap-3">
                             <Truck size={20} className="text-gray-900 mt-1" />
                             <div>
                                 <h4 className="font-bold text-gray-900">Free Express Shipping</h4>
                                 <p className="text-sm">On all orders over ₹50,000. Delivers in 2-3 business days.</p>
                             </div>
                         </div>
                         <div className="flex items-start gap-3">
                             <ShieldCheck size={20} className="text-gray-900 mt-1" />
                             <div>
                                 <h4 className="font-bold text-gray-900">Secure Packaging</h4>
                                 <p className="text-sm">Anti-static, shock-proof packaging for all components.</p>
                             </div>
                         </div>
                     </div>
                 )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={adding || stockValue === 0}
                className="flex-1 btn btn-primary py-4 rounded-xl flex items-center justify-center gap-3 font-bold hover:scale-[1.02] transition-transform shadow-lg shadow-primary-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} />
                {stockValue === 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
              </button>
              
              <button 
                onClick={handleWishlistToggle}
                disabled={togglingWishlist}
                className={`px-4 py-4 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors ${isInWishlist(product._id) ? 'text-red-500 border-red-200' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Heart size={20} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
              </button>
               <button className="px-4 py-4 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-900">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
            <div className="mt-24 border-t border-gray-100 pt-16">
                <div className="flex items-center justify-between mb-8">
                     <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                     <Link to={`/products?category=${typeof product.category === 'object' ? product.category._id : product.category}`} className="text-sm font-semibold text-primary-600 hover:text-primary-800 flex items-center gap-1">
                        View More <ArrowRight size={16} />
                     </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {relatedProducts.map(rp => (
                        <ProductCard key={rp._id} product={rp} />
                    ))}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetail;