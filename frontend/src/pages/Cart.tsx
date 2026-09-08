import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { removeFromCart, updateQuantity } from '../slices/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  return (
    <div className="min-h-screen bg-[#eaeded] font-sans py-8">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Cart Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex items-end justify-between border-b border-slate-200 pb-4 mb-6">
                <h1 className="text-3xl font-heading font-black text-slate-900">Shopping Cart</h1>
                <span className="text-slate-500 font-medium text-sm hidden sm:block">Price</span>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center justify-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={48} className="text-slate-300" />
                  </div>
                  <h2 className="text-2xl font-medium text-slate-900 mb-2">Your OneStall Cart is empty</h2>
                  <p className="text-slate-500 mb-6">Explore the marketplace to find deals.</p>
                  <Link to="/" className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold px-8 py-3 rounded-full transition-colors shadow-sm">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-slate-200 relative">
                      <div className="flex-shrink-0 w-32 h-32 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center p-2">
                        <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 hover:text-[#007185] cursor-pointer">
                              {item.name}
                            </h3>
                            <div className="text-xs text-[#007185] font-bold bg-emerald-50 px-2 py-0.5 rounded-sm w-fit mb-2">In Stock</div>
                            <div className="text-sm text-slate-600">
                              <span className="font-bold">Size:</span> {item.size}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              Fulfilled by <span className="font-bold text-[#e47911]">OneStall Cargo</span>
                            </div>
                          </div>
                          
                          <div className="text-right flex-shrink-0">
                            <div className="font-bold text-xl text-slate-900">₹{item.price.toLocaleString('en-IN')}</div>
                          </div>
                        </div>

                        <div className="mt-auto pt-4 flex items-center gap-6">
                          <div className="flex border border-slate-300 rounded-md overflow-hidden h-8 shadow-sm">
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: Math.max(1, item.quantity - 1) }))}
                              className="w-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors font-medium"
                            >-</button>
                            <div className="w-10 flex items-center justify-center text-sm font-bold border-x border-slate-300 bg-white text-slate-900">
                              {item.quantity}
                            </div>
                            <button 
                              onClick={() => dispatch(updateQuantity({ id: item.id, size: item.size, quantity: item.quantity + 1 }))}
                              className="w-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors font-medium"
                            >+</button>
                          </div>
                          
                          <div className="w-px h-5 bg-slate-300 hidden sm:block"></div>
                          
                          <button 
                            onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                            className="text-sm text-[#007185] hover:text-[#c45500] hover:underline font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex justify-end pt-2">
                    <div className="text-lg text-slate-900">
                      Subtotal ({items.length} items): <span className="font-bold text-xl">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Order Summary */}
          {items.length > 0 && (
            <div className="lg:w-1/4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-8">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-4 bg-emerald-50 p-2 rounded border border-emerald-200">
                  <ShieldCheck size={16} />
                  <span>Your order is eligible for FREE Delivery.</span>
                </div>
                
                <h2 className="text-lg text-slate-900 mb-4">
                  Subtotal ({items.length} items): <br/>
                  <span className="font-bold text-2xl mt-1 block">₹{totalPrice.toLocaleString('en-IN')}</span>
                </h2>
                
                <Link to="/checkout" className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 rounded-full flex items-center justify-center gap-2 h-10 text-sm font-medium shadow-sm transition-all mb-4 border border-[#fcd200]">
                  Proceed to Buy
                </Link>
                
                <div className="space-y-3 pt-4 border-t border-slate-200">
                  <h3 className="font-bold text-xs text-slate-900">EMI Available</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Your order qualifies for EMI with valid credit cards. <br/>
                    <a href="#" className="text-[#007185] hover:underline hover:text-[#c45500]">Learn more</a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
