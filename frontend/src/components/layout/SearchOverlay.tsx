import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  // Mock data for initial view
  const recentSearches = ['Silk Dress', 'Leather Boots', 'Cashmere Coat'];
  const trendingSearches = ['Velvet Wraps', 'Winter Collection 2026', 'Men Suits'];

  // Mock AI suggestions based on typing
  useEffect(() => {
    if (query.length > 2) {
      // Simulate API call for smart suggestions
      const mockDb = ['Silk Evening Gown', 'Silk Scarf', 'Black Leather Jacket', 'Brown Leather Boots', 'Cashmere Scarf', 'Cashmere Blend Coat', 'Velvet Evening Wrap'];
      const results = mockDb.filter(item => item.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchTerm: string) => {
    // In a real app, this would route to search results or fetch
    console.log("Searching for:", searchTerm);
    navigate(`/collections?search=${encodeURIComponent(searchTerm)}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-xl flex flex-col"
        >
          {/* Header of Search Overlay */}
          <div className="container mx-auto px-4 lg:px-8 h-24 flex items-center justify-between border-b border-border/50">
            <div className="flex-1 flex items-center gap-4">
              <Search size={24} className="text-muted" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for products, brands, and categories..."
                className="w-full bg-transparent text-2xl lg:text-4xl font-light focus:outline-none placeholder:text-muted/50"
                autoFocus
              />
            </div>
            <button onClick={onClose} className="p-4 hover:text-accent transition-colors">
              <X size={32} strokeWidth={1.5} />
            </button>
          </div>

          {/* Search Content */}
          <div className="container mx-auto px-4 lg:px-8 py-12 flex-1 overflow-y-auto">
            {query.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Recent Searches */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted mb-6">
                    <Clock size={16} /> Recent Searches
                  </h3>
                  <div className="flex flex-col gap-4">
                    {recentSearches.map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => handleSearch(item)}
                        className="flex items-center justify-between text-lg hover:text-accent transition-colors group"
                      >
                        {item} <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Trending Searches */}
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted mb-6">
                    <TrendingUp size={16} /> Trending Right Now
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {trendingSearches.map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSearch(item)}
                        className="px-4 py-2 border border-border rounded-full text-sm hover:border-accent hover:text-accent transition-colors"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl">
                <h3 className="text-sm font-medium uppercase tracking-widest text-muted mb-6">
                  Suggestions
                </h3>
                {suggestions.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {suggestions.map((item, i) => (
                      <button 
                        key={i}
                        onClick={() => handleSearch(item)}
                        className="text-left py-3 text-xl hover:text-accent border-b border-border/30 transition-colors flex items-center justify-between group"
                      >
                        {item}
                        <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity text-accent" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-lg">No suggestions found for "{query}". Try a different term.</p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
