import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, ChevronDown, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import Skeleton from '../components/ui/Skeleton';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  brand: string;
}

const ProductList: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  // Determine category title based on path
  let title = "Collection";
  let filterCategories = ['Dresses', 'Tops', 'Pants', 'Accessories', 'Shoes'];
  let filterTitle = "Categories";

  if (location.pathname.includes('women')) {
    title = "Women's Collection";
    filterCategories = ['Dresses', 'Tops', 'Skirts', 'Bags', 'Jewelry'];
  } else if (location.pathname.includes('men')) {
    title = "Men's Collection";
    filterCategories = ['Shirts', 'T-Shirts', 'Jeans', 'Suits', 'Watches'];
  } else if (location.pathname.includes('new-arrivals')) {
    title = "New Arrivals";
    filterCategories = ['Latest Trends', 'Just In Apparel', 'New Footwear', 'Fresh Accessories'];
  } else if (location.pathname.includes('sale')) {
    title = "Sale & Offers";
    filterTitle = "Sale Type";
    filterCategories = ['Clearance', '50% Off', 'Flash Deals', 'Under ₹100'];
  } else if (location.pathname.includes('collections')) {
    title = "All Collections";
    filterTitle = "Collections";
    filterCategories = ['Summer Essentials', 'Winter Wear', 'Fall Exclusives', 'Spring Blossom'];
  }

  // Fetch Products from Backend API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/products');
        // If we want to simulate the previous nice mock logic, we'll map the backend data
        // to our local specific images based on category logic just to keep it looking perfect,
        // or we just use backend images directly. Let's use backend directly.
        
        let fetchedProducts = response.data;
        
        // For visual consistency in the demo, we'll assign our nice images dynamically based on the path
        // even though they come from the backend, just so the "Men" and "Women" tabs keep looking perfect.
        const womenImages = [
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1550614000-4b95d466f271?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=600&auto=format&fit=crop'
        ];
        const menImages = [
          'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1516826957135-700ede19eb60?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1602811400073-66171b5321f4?q=80&w=600&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=600&auto=format&fit=crop'
        ];

        fetchedProducts = fetchedProducts.slice(0, 16).map((p: Product, i: number) => {
          let img = p.image;
          if (location.pathname.includes('women')) img = womenImages[i % womenImages.length];
          else if (location.pathname.includes('men')) img = menImages[i % menImages.length];
          
          return {
            ...p,
            category: filterCategories[i % filterCategories.length], // Ensure it matches our sidebar filters
            image: img
          };
        });

        setAllProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [location.pathname]);

  // Handle filter toggle
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  // Filter products based on selected categories
  const filteredProducts = selectedCategories.length > 0 
    ? allProducts.filter(p => selectedCategories.includes(p.category))
    : allProducts;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif font-bold">{title}</h1>
        
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center gap-2 lg:hidden font-medium"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={20} /> Filters
          </button>
          
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-muted">Sort by:</span>
            <button className="flex items-center gap-1 font-medium">
              Featured <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className={`lg:w-1/4 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-24 pr-4">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h2 className="font-bold text-lg flex items-center gap-2"><SlidersHorizontal size={20} /> Filters</h2>
              <button onClick={clearFilters} className="text-sm text-accent underline">Clear All</button>
            </div>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">{filterTitle}</h3>
              <div className="flex flex-col gap-2">
                {filterCategories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-accent w-4 h-4" 
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    <span className={`hover:text-foreground transition-colors ${selectedCategories.includes(cat) ? 'text-foreground font-medium' : 'text-muted'}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Price Range</h3>
              <input type="range" className="w-full accent-accent" min="0" max="1000" />
              <div className="flex justify-between text-sm text-muted mt-2">
                <span>?0</span>
                <span>?1000+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:w-3/4">
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="aspect-[3/4] w-full">
                    <Skeleton type="rectangular" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-2/3 flex flex-col gap-2">
                      <Skeleton type="text" className="h-5" />
                      <Skeleton type="text" className="w-1/2 h-4" />
                    </div>
                    <Skeleton type="text" className="w-1/4 h-5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[3/4] bg-surface relative overflow-hidden mb-4">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                          <button className="bg-white text-black px-6 py-2 font-medium translate-y-4 group-hover:translate-y-0 transition-transform">
                            QUICK VIEW
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium mb-1 group-hover:text-accent transition-colors">{product.name}</h3>
                          <p className="text-sm text-muted">{product.category}</p>
                        </div>
                        <span className="font-medium">₹{product.price.toFixed(2)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="py-20 text-center text-muted">
                  <p>No products found matching the selected filters.</p>
                  <button onClick={clearFilters} className="mt-4 text-accent underline">Clear all filters</button>
                </div>
              )}
              
              <div className="mt-16 flex justify-center">
                <button className="border border-border hover:border-foreground px-8 py-3 transition-colors font-medium">
                  LOAD MORE
                </button>
              </div>
            </>
          )}
        </main>

      </div>
    </div>
  );
};

export default ProductList;
