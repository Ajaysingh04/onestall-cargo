import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Share2, Check, Heart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeFromWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import { Link } from 'react-router-dom';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const moveToCart = (item: any) => {
    dispatch(addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: 'Standard'
    }));
    dispatch(removeFromWishlist(item.id));
  };

  const removeItem = (id: string) => {
    dispatch(removeFromWishlist(id));
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12 max-w-6xl font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          Your Wish List
        </h1>
        
        {wishlistItems.length > 0 && (
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 text-sm text-[#007185] hover:text-[#c45500] font-medium"
          >
            {shared ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} />}
            {shared ? 'Link Copied!' : 'Share Wishlist'}
          </button>
        )}
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(5px)' }}
                transition={{ duration: 0.4 }}
                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative overflow-hidden bg-slate-50 p-4">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors z-20 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-medium text-slate-900 line-clamp-2 hover:text-[#c45500] cursor-pointer transition-colors">{item.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl text-[#B12704]">₹{item.price.toFixed(2)}</span>
                    <span className="text-[11px] text-[#007185] bg-emerald-50 px-2 py-0.5 rounded-sm font-bold">In Stock</span>
                  </div>
                  <button 
                    onClick={() => moveToCart(item)}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={16} /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="py-20 text-center flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-slate-300" />
          </div>
          <h2 className="text-2xl font-medium text-slate-900 mb-2">Your Wish List is empty</h2>
          <p className="text-slate-500 mb-8 max-w-sm mx-auto">
            Save items that you like in your Wish List. Review them anytime and easily move them to cart.
          </p>
          <Link 
            to="/"
            className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3 rounded-full font-medium transition-colors"
          >
            Explore Marketplace
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Wishlist;
