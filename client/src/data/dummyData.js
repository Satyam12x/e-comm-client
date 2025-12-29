// Centralized dummy data for the entire application
// All components should import from this file for consistency

export const dummyCategories = [
  { 
    _id: 'cat1', 
    name: 'Graphics Cards', 
    slug: 'gpu', 
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat2', 
    name: 'Processors', 
    slug: 'cpu', 
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat3', 
    name: 'Motherboards', 
    slug: 'motherboard', 
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat4', 
    name: 'Memory', 
    slug: 'ram', 
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat5', 
    name: 'Storage', 
    slug: 'storage', 
    image: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat6', 
    name: 'Cases', 
    slug: 'case', 
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat7', 
    name: 'Power Supply', 
    slug: 'psu', 
    image: 'https://images.unsplash.com/photo-1555618254-71280caa7fb7?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    _id: 'cat8', 
    name: 'Cooling', 
    slug: 'cooling', 
    image: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80&w=400' 
  }
];

export const dummyProducts = [
  {
    _id: 'd1',
    name: 'GeForce RTX 4090 Gaming OC',
    description: 'Experience unparalleled gaming performance with the NVIDIA GeForce RTX 4090. Featuring 24GB GDDR6X memory and Ada Lovelace architecture, this powerhouse GPU delivers exceptional ray tracing and AI-powered graphics. Perfect for 4K gaming, content creation, and professional workloads.',
    price: 159999,
    comparePrice: 179999,
    category: dummyCategories[0], // Graphics Cards
    brand: 'NVIDIA',
    images: [
      { url: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 5,
    countInStock: 5,
    isNew: true,
    featured: true
  },
  {
    _id: 'd2',
    name: 'Intel Core i9-14900K',
    description: 'The Intel Core i9-14900K is a high-performance processor featuring 24 cores (8 P-cores + 16 E-cores) and 32 threads. With a max turbo frequency of 6.0 GHz, it delivers exceptional performance for gaming, content creation, and multitasking. Unlocked for overclocking.',
    price: 55999,
    comparePrice: 62999,
    category: dummyCategories[1], // Processors
    brand: 'Intel',
    images: [
      { url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 10,
    countInStock: 10,
    featured: true
  },
  {
    _id: 'd3',
    name: 'ROG Maximus Z790 Hero',
    description: 'The ASUS ROG Maximus Z790 Hero is a premium ATX motherboard designed for Intel 13th and 14th Gen processors. Features PCIe 5.0, DDR5 support, WiFi 6E, and comprehensive cooling solutions. Perfect for enthusiast builds and overclocking.',
    price: 65999,
    comparePrice: 72999,
    category: dummyCategories[2], // Motherboards
    brand: 'ASUS',
    images: [
      { url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 8,
    countInStock: 8,
    featured: true
  },
  {
    _id: 'd4',
    name: 'Corsair Vengeance RGB 32GB DDR5',
    description: 'Corsair Vengeance RGB DDR5 RAM delivers cutting-edge performance with speeds up to 6000MHz. 32GB (2x16GB) kit with dynamic RGB lighting, optimized for Intel and AMD platforms. Low-latency timings ensure responsive system performance.',
    price: 12999,
    comparePrice: 15999,
    category: dummyCategories[3], // Memory
    brand: 'Corsair',
    images: [
      { url: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 15,
    countInStock: 15,
    featured: false
  },
  {
    _id: 'd5',
    name: 'Samsung 990 PRO 2TB NVMe SSD',
    description: 'Samsung 990 PRO delivers exceptional speed with PCIe 4.0 interface, reaching sequential read speeds up to 7,450 MB/s. 2TB capacity with advanced thermal control and power efficiency. Ideal for gaming, professional workloads, and heavy multitasking.',
    price: 16999,
    comparePrice: 21999,
    category: dummyCategories[4], // Storage
    brand: 'Samsung',
    images: [
      { url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 20,
    countInStock: 20,
    featured: false
  },
  {
    _id: 'd6',
    name: 'NZXT H9 Flow Elite',
    description: 'The NZXT H9 Flow is a premium mid-tower case featuring a panoramic tempered glass side panel and optimized airflow design. Supports up to E-ATX motherboards, 360mm radiators, and includes RGB lighting strips. Cable management system for clean builds.',
    price: 18999,
    comparePrice: 20999,
    category: dummyCategories[5], // Cases
    brand: 'NZXT',
    images: [
      { url: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 25,
    countInStock: 25,
    featured: true
  },
  {
    _id: 'd7',
    name: 'Corsair RM1000x 80+ Gold Modular PSU',
    description: 'Corsair RM1000x is a fully modular 1000W power supply with 80 PLUS Gold certification. Zero RPM fan mode for silent operation, Japanese capacitors for reliability, and flat ribbon cables for easy cable management. 10-year warranty included.',
    price: 14999,
    comparePrice: 16999,
    category: dummyCategories[6], // Power Supply
    brand: 'Corsair',
    images: [
      { url: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1555618254-71280caa7fb7?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 12,
    countInStock: 12,
    featured: false
  },
  {
    _id: 'd8',
    name: 'NZXT Kraken Elite 360 RGB AIO',
    description: 'NZXT Kraken Elite 360mm AIO liquid cooler features a customizable LCD display, powerful pump, and three 120mm RGB fans. Whisper-quiet operation with exceptional cooling performance. Compatible with all modern CPU sockets.',
    price: 24999,
    comparePrice: 28999,
    category: dummyCategories[7], // Cooling
    brand: 'NZXT',
    images: [
      { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800' },
      { url: 'https://images.unsplash.com/photo-1527219525722-f9767a7f2884?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 7,
    countInStock: 7,
    featured: true
  },
  {
    _id: 'd9',
    name: 'AMD Ryzen 9 7950X',
    description: 'AMD Ryzen 9 7950X features 16 cores and 32 threads with Zen 4 architecture. Boost clocks up to 5.7 GHz deliver exceptional multi-threaded performance. Includes AMD 3D V-Cache technology for gaming excellence.',
    price: 58999,
    comparePrice: 64999,
    category: dummyCategories[1], // Processors
    brand: 'AMD',
    images: [
      { url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 12,
    countInStock: 12,
    featured: true
  },
  {
    _id: 'd10',
    name: 'Radeon RX 7900 XTX',
    description: 'AMD Radeon RX 7900 XTX graphics card with RDNA 3 architecture. 24GB GDDR6 memory and chiplet design deliver incredible 4K gaming performance. Advanced cooling solution keeps temperatures in check.',
    price: 89999,
    comparePrice: 99999,
    category: dummyCategories[0], // Graphics Cards
    brand: 'AMD',
    images: [
      { url: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800' }
    ],
    stock: 6,
    countInStock: 6,
    featured: false
  }
];

// Helper function to get product by ID
export const getProductById = (id) => {
  return dummyProducts.find(product => product._id === id);
};

// Helper function to get products by category
export const getProductsByCategory = (categorySlug) => {
  if (!categorySlug) return dummyProducts;
  return dummyProducts.filter(product => 
    product.category.slug === categorySlug
  );
};

// Helper function to get featured products
export const getFeaturedProducts = () => {
  return dummyProducts.filter(product => product.featured);
};

// Helper function to filter and sort products
export const filterAndSortProducts = ({ category, search, minPrice, maxPrice, sort }) => {
  let filtered = [...dummyProducts];

  // Filter by category
  if (category) {
    filtered = filtered.filter(p => p.category.slug === category);
  }

  // Filter by search
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.brand.toLowerCase().includes(searchLower)
    );
  }

  // Filter by price range
  if (minPrice !== undefined) {
    filtered = filtered.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price <= maxPrice);
  }

  // Sort
  switch (sort) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      // For now, shuffle for demonstration
      filtered.sort(() => Math.random() - 0.5);
      break;
    case 'newest':
    default:
      // Keep original order (newest first)
      break;
  }

  return filtered;
};

// Helper to get category by slug
export const getCategoryBySlug = (slug) => {
  return dummyCategories.find(cat => cat.slug === slug);
};
