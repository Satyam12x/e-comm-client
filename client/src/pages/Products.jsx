import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
// import { ChevronDown, FilterList, ChevronLeft, ChevronRight } from '@material-symbols/outlined'; // You'll need to install @material-symbols/outlined or use span
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { dummyProducts, dummyCategories, filterAndSortProducts } from '../data/dummyData';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Filter states
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 200000 });
  const [sortBy, setSortBy] = useState('recommended');
  const [inStockOnly, setInStockOnly] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    const params = new URLSearchParams();
    if (selectedCategory) params.set('category', selectedCategory);
    if (searchParam) params.set('search', searchParam);
    if (page > 1) params.set('page', page);
    setSearchParams(params);
  }, [selectedCategory, sortBy, searchParam, priceRange, inStockOnly, page]);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      const categoriesList = data?.data?.categories || data?.categories || [];
      setCategories(categoriesList.length > 0 ? categoriesList : dummyCategories);
    } catch (error) {
      console.error('Error fetching categories, using dummy data:', error);
      setCategories(dummyCategories);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory || undefined,
        sort: sortBy,
        search: searchParam || undefined,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        page,
        limit: 12
      };

      const { data } = await api.get('/products', { params });
      const productsList = data?.data?.products || data?.products || data || [];
      
      if (data?.data?.pagination) {
        setTotalPages(data.data.pagination.pages);
      }

      if (Array.isArray(productsList) && productsList.length > 0) {
        setProducts(productsList);
      } else {
        const filtered = filterAndSortProducts({
          category: selectedCategory,
          search: searchParam,
          minPrice: priceRange.min,
          maxPrice: priceRange.max,
          sort: sortBy,
        });
        setProducts(Array.isArray(filtered) ? filtered : []);
      }
    } catch (error) {
      console.error('Error fetching products, using dummy data:', error);
      const filtered = filterAndSortProducts({
        category: selectedCategory,
        search: searchParam,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sort: sortBy,
      });
      setProducts(Array.isArray(filtered) ? filtered : []);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 200000 });
    setSortBy('recommended');
    setInStockOnly(true);
    setPage(1);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const visibleCategories = showAllCategories ? categories : categories.slice(0, 4);

  return (
    <>
      {/* Font & Tailwind CDN (only needed if not already in index.html) */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />

      <div className="font-sans antialiased text-primary bg-background-light">
        {/* Main Layout */}
        <div className="flex min-h-screen flex-col lg:flex-row">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex w-72 flex-col gap-8 border-r border-[#e5e5e5] bg-white p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Categories */}
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#757575]">Categories</h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition-colors w-full text-left ${
                      selectedCategory === '' ? 'bg-surface text-primary' : 'text-[#525252] hover:bg-surface hover:text-primary'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">checkroom</span>
                      All Products
                    </span>
                    <span className="text-xs text-[#757575]">
                      {categories.reduce((acc, cat) => acc + (cat.productCount || 0), 0)}
                    </span>
                  </button>
                </li>
                {visibleCategories.map((cat) => (
                  <li key={cat._id}>
                    <button
                      onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full text-left ${
                        selectedCategory === cat.slug
                          ? 'bg-surface text-primary'
                          : 'text-[#525252] hover:bg-surface hover:text-primary'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[20px]">styler</span>
                        {cat.name}
                      </span>
                      <span className="text-xs text-[#757575]">{cat.productCount || 0}</span>
                    </button>
                  </li>
                ))}
                {categories.length > 4 && (
                  <li>
                    <button
                      onClick={() => setShowAllCategories(!showAllCategories)}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-primary hover:underline"
                    >
                      {showAllCategories ? 'Show Less' : 'Show More'} ({categories.length - 4} more)
                    </button>
                  </li>
                )}
              </ul>
            </div>

            {/* Filters */}
            <div className="border-t border-[#e5e5e5] pt-6">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#757575]">Filter By</h3>
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-primary">Price Range</p>
                <div className="flex items-center gap-2 text-sm">
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]">₹</span>
                    <input
                      className="w-full rounded border border-[#e5e5e5] py-1.5 pl-6 pr-2 text-sm focus:border-primary"
                      type="text"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                    />
                  </div>
                  <span className="text-[#757575]">-</span>
                  <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]">₹</span>
                    <input
                      className="w-full rounded border border-[#e5e5e5] py-1.5 pl-6 pr-2 text-sm focus:border-primary"
                      type="text"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 500 })}
                    />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-primary">Availability</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-[#e5e5e5] text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-[#525252]">In Stock</span>
                </label>
              </div>
              {(selectedCategory || priceRange.max < 200000 || !inStockOnly) && (
                <button
                  onClick={clearFilters}
                  className="w-full rounded bg-primary py-2 text-sm font-bold text-white hover:bg-black/90"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-[#e5e5e5]">
              {/* Desktop Header */}
              <div className="hidden lg:block px-10 py-6">
                <nav className="flex mb-4 text-xs font-medium text-[#757575]">
                  <a href="#" className="hover:text-primary">Home</a>
                  <span className="mx-2">&gt;</span>
                  <span className="text-primary">Shop</span>
                </nav>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-primary">
                      {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name || 'All Products' : 'All Products'}
                    </h1>
                    <p className="mt-1 text-sm text-[#757575]">
                      Showing {products.length} results
                      {searchParam && ` for "${searchParam}"`}
                    </p>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-primary focus:outline-none cursor-pointer hover:border-primary"
                  >
                    <option value="recommended">Sort by: Recommended</option>
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Mobile Header & Toolbar */}
              <div className="lg:hidden">
                <div className="px-4 py-3 flex items-center justify-between border-b border-[#f1f1f1]">
                   <h1 className="text-lg font-bold text-primary truncate">
                      {selectedCategory ? categories.find(c => c.slug === selectedCategory)?.name : 'All Products'}
                   </h1>
                   <span className="text-xs text-[#757575]">{products.length} Items</span>
                </div>
                
                {/* Mobile Toolbar */}
                <div className="grid grid-cols-2 divide-x divide-[#f1f1f1]">
                  <button 
                    onClick={() => setShowFilters(true)}
                    className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary active:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter
                  </button>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-full absolute inset-0 opacity-0 z-10"
                    />
                    <button className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-primary active:bg-gray-50">
                      <span className="material-symbols-outlined text-[18px]">sort</span>
                      Sort
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Categories */}
            <div className="lg:hidden w-full overflow-x-auto px-6 pb-4 scrollbar-none">
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === '' ? 'bg-primary text-white' : 'border border-[#e5e5e5] bg-white text-primary'
                  }`}
                >
                  All
                </button>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-primary text-white'
                        : 'border border-[#e5e5e5] bg-white text-primary'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 px-6 lg:px-10 pb-20 pt-2 flex-1">
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/5] bg-surface rounded-lg" />
                    <div className="mt-3 space-y-2">
                      <div className="h-5 bg-surface rounded w-3/4" />
                      <div className="h-4 bg-surface rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <p className="text-lg text-[#757575]">No products found. Try adjusting your filters.</p>
                  <button onClick={clearFilters} className="mt-4 text-primary underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center pb-20 pt-8 border-t border-[#e5e5e5] mx-6 lg:mx-10">
                <nav className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e5e5] text-primary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        page === i + 1
                          ? 'bg-primary text-white font-bold'
                          : 'border border-[#e5e5e5] text-primary hover:bg-surface'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button 
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#e5e5e5] text-primary hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>

        {/* Mobile Filter Drawer (simplified) */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end bg-black/50" onClick={() => setShowFilters(false)}>
            <div className="w-80 bg-white h-full p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {/* Reuse desktop filter content here if needed */}
              <button
                onClick={() => setShowFilters(false)}
                className="w-full mt-8 rounded bg-primary py-3 text-white font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;