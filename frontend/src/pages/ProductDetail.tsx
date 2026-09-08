import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Heart, Share2, ChevronRight, Truck, RotateCcw, Check } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';
import type { RootState } from '../store/store';
import { useNavigate } from 'react-router-dom';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const wishlistItems = useSelector((state: RootState) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some(item => item.id === (id || 'prod_1'));

  const product = {
    id: id || 'prod_1',
    name: 'Premium Silk Midi Dress',
    price: 450,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first.");
      return;
    }
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      size: selectedSize
    }));
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

  const handleToggleWishlist = () => {
    dispatch(toggleWishlist(product));
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted mb-8">
        <span>Home</span> <ChevronRight size={14} /> <span>Women</span> <ChevronRight size={14} /> <span className="text-foreground">Premium Silk Dress</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Images */}
        <div className="lg:w-1/2 flex gap-4">
          <div className="hidden sm:flex flex-col gap-4 w-24">
            {[1, 2, 3, 4].map((img) => (
              <img 
                key={img} 
                src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop`} 
                alt="Thumbnail" 
                className="w-full h-auto cursor-pointer border border-transparent hover:border-accent"
              />
            ))}
          </div>
          <div className="flex-1 bg-surface aspect-[3/4]">
            <img 
              src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop`} 
              alt="Main Product" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2">
          <h1 className="text-4xl font-serif font-bold mb-2">Premium Silk Midi Dress</h1>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-medium">?450.00</span>
            <div className="flex items-center text-yellow-500">
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <Star size={16} fill="currentColor" />
              <span className="text-muted text-sm ml-2">(128 Reviews)</span>
            </div>
          </div>
          
          <p className="text-muted mb-8 leading-relaxed">
            Crafted from the finest Mulberry silk, this midi dress features a fluid silhouette that drapes elegantly. 
            Perfect for evening events or sophisticated daytime wear. Includes a hidden side zipper and subtle side slit.
          </p>

          {/* Size Selector */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Size</h3>
              <button className="text-sm text-accent underline">Size Guide</button>
            </div>
            <div className="flex gap-3">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <button 
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border flex items-center justify-center transition-colors
                    ${selectedSize === size ? 'border-accent bg-accent text-white' : 'border-border hover:border-foreground'}
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="flex border border-border w-32 h-12">
              <button 
                className="flex-1 flex items-center justify-center hover:bg-surface transition-colors"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >-</button>
              <div className="flex-1 flex items-center justify-center font-medium">{quantity}</div>
              <button 
                className="flex-1 flex items-center justify-center hover:bg-surface transition-colors"
                onClick={() => setQuantity(quantity + 1)}
              >+</button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className={`flex-1 flex items-center justify-center gap-2 h-12 font-medium transition-colors ${added ? 'bg-green-600 text-white' : 'bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950'} rounded-full`}
            >
              {added ? <><Check size={20} /> ADDED</> : <><ShoppingBag size={20} /> ADD TO CART</>}
            </button>
            
            <button 
              onClick={handleToggleWishlist}
              className={`w-12 h-12 border flex items-center justify-center transition-colors rounded-full ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-border hover:border-foreground'}`}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-4 border-t border-border pt-8 text-sm">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-muted" />
              <span>Free standard shipping on orders over ?200</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-muted" />
              <span>Free returns within 30 days</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
