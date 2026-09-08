import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  LocateFixed,
  Clock,
  ShieldCheck,
  Truck,
  CreditCard,
  ChevronRight
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { clearCart } from '../slices/cartSlice';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  const [formData, setFormData] = useState({
    name: userInfo?.name || '',
    phone: userInfo?.phone || '',
    email: userInfo?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD',
  });

  const [placingOrder, setPlacingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);
  const [locating, setLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            setFormData(prev => ({
              ...prev,
              street: '123 Main St (Detected from Location)',
              city: 'New Delhi',
              state: 'Delhi',
              pincode: '110001'
            }));
            setLocating(false);
          }, 1000);
        },
        (error) => {
          alert('Error fetching location: ' + error.message);
          setLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setLocating(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    
    if (!formData.name || !formData.street || !formData.city || !formData.pincode) {
      alert("Please fill all required address fields.");
      return;
    }

    setPlacingOrder(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const payload = {
        shipment: { awb: 'ONESTALL' + Math.floor(Math.random() * 1000000), deliveryOtp: '1234' }
      };

      setConfirmedOrder(payload);
      dispatch(clearCart());
    } catch (err: any) {
      alert('Error placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeded] font-sans pb-16">
      
      {/* Checkout Header (Amazon Style) */}
      <div className="bg-white border-b border-slate-200 py-6 mb-8">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <h1 className="text-3xl font-heading font-black text-slate-900 tracking-tight">
            Checkout <span className="text-slate-400 font-normal text-2xl">({items.length} items)</span>
          </h1>
          <div className="flex items-center gap-2 text-slate-600 mt-4 md:mt-0">
            <Lock size={18} />
            <span className="font-semibold text-sm">Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {confirmedOrder ? (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm text-center space-y-6 max-w-2xl mx-auto mt-10">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={56} />
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl font-black text-slate-900 font-heading">Order Placed, Thank You!</h1>
              <p className="text-slate-600 text-lg">
                Confirmation will be sent to your email.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 max-w-md mx-auto p-6 rounded-xl text-left space-y-4 font-medium text-sm mt-8">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-slate-500">Order Number:</span>
                <span className="text-blue-600 font-black">{confirmedOrder.shipment?.awb}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Delivery Guarantee:</span>
                <span className="text-emerald-700 font-black">Arriving Tomorrow</span>
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <Link
                to="/"
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold px-10 py-4 rounded-full shadow-md transition-all inline-block hover:shadow-lg"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 cols: Form */}
            <div className="lg:col-span-8 space-y-6">

              <form onSubmit={handlePlaceOrder} className="space-y-6">
                
                {/* 1. Delivery Address Card */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-black">1</span> 
                      Delivery Address
                    </h2>
                    <button 
                      type="button" 
                      onClick={handleUseCurrentLocation}
                      disabled={locating}
                      className="text-[#007185] hover:text-[#c45500] text-sm font-bold flex items-center gap-1.5 hover:underline disabled:opacity-50 transition-colors"
                    >
                      <LocateFixed size={18} />
                      {locating ? 'Locating...' : 'Use Current Location'}
                    </button>
                  </div>

                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-slate-900 block mb-1.5 font-bold text-sm">Full name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] focus:outline-none transition-shadow placeholder-slate-400"
                          placeholder="First and Last name"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-900 block mb-1.5 font-bold text-sm">Mobile number</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] focus:outline-none transition-shadow placeholder-slate-400"
                          placeholder="10-digit mobile number"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-900 block mb-1.5 font-bold text-sm">Flat, House no., Building, Company, Apartment</label>
                      <input
                        type="text"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] focus:outline-none transition-shadow"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="text-slate-900 block mb-1.5 font-bold text-sm">Town/City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] focus:outline-none transition-shadow"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-slate-900 block mb-1.5 font-bold text-sm">State</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] focus:outline-none transition-shadow"
                          required
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-slate-900 block mb-1.5 font-bold text-sm">Pincode</label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-[#f3a847] focus:border-[#f3a847] focus:outline-none transition-shadow"
                          placeholder="6 digits [0-9]"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Payment Method Card */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-black">2</span> 
                      Payment Method
                    </h2>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'COD' ? 'bg-[#fcf5ee] border-[#f3a847]' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        className="mt-1 w-4 h-4 text-[#f3a847] focus:ring-[#f3a847]"
                        checked={formData.paymentMethod === 'COD'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          Cash on Delivery (COD) <CreditCard size={18} className="text-slate-500" />
                        </div>
                        <div className="text-sm text-slate-600 mt-1">Scan & Pay using Amazon Pay UPI or pay in cash at doorstep.</div>
                      </div>
                    </label>

                    <label className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'UPI' ? 'bg-[#fcf5ee] border-[#f3a847]' : 'border-slate-200 hover:border-slate-300'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        className="mt-1 w-4 h-4 text-[#f3a847] focus:ring-[#f3a847]"
                        checked={formData.paymentMethod === 'UPI'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'UPI' })}
                      />
                      <div className="flex-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          UPI / QR Code
                        </div>
                        <div className="text-sm text-slate-600 mt-1">Google Pay, PhonePe, Paytm or any UPI app.</div>
                      </div>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            {/* Right 4 cols: Summary (Sticky Sidebar) */}
            <div className="lg:col-span-4 relative">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-8">
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder || items.length === 0}
                  className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 rounded-xl flex items-center justify-center gap-2 h-14 font-bold shadow-sm transition-all mb-4 disabled:opacity-50 text-sm border border-[#fcd200]"
                >
                  {placingOrder ? <Clock className="animate-spin" size={20} /> : 'Place your order'}
                </button>
                
                <div className="text-center text-xs text-slate-500 mb-6 px-2 leading-relaxed">
                  By placing your order, you agree to OneStall's privacy notice and conditions of use.
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-4 border-b border-slate-200 pb-3">Order Summary</h3>
                
                <div className="space-y-3 text-sm text-slate-700 mb-4">
                  <div className="flex justify-between">
                    <span>Items:</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span className="text-emerald-700 font-semibold">₹0.00</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center font-black text-xl text-slate-900 border-t border-slate-200 pt-4 mb-6">
                  <span className="text-[#B12704]">Order Total:</span>
                  <span className="text-[#B12704]">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-700 space-y-3">
                  <p className="font-bold text-slate-900 text-sm mb-2">Shipping Details:</p>
                  {items.length > 0 ? items.map(item => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between items-start gap-4">
                      <div className="truncate flex-1">
                        <span className="font-bold text-slate-900">{item.quantity}x</span> {item.name}
                      </div>
                      <span className="font-semibold text-emerald-700 whitespace-nowrap">Tomorrow</span>
                    </div>
                  )) : (
                    <div className="text-slate-400 italic">No items in cart</div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck size={16} className="text-[#007185]" />
                    <span>Safe and Secure Payments. Easy returns.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Truck size={16} className="text-[#007185]" />
                    <span>Fulfilled by OneStall Cargo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
