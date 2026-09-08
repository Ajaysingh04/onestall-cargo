import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Truck,
  Check,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { switchDemoRole, userLogout } from '../../slices/authSlice';

interface HeaderProps {
  onOpenSearch?: () => void;
}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pincode, setPincode] = useState('110001');
  const [pincodeModal, setPincodeModal] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const cartCount = useSelector((state: RootState) => state.cart?.totalQuantity || 0);
  const wishlistCount = useSelector((state: RootState) => state.wishlist?.items?.length || 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}&cat=${searchCategory}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 font-sans shadow-md">
      {/* 1. AMAZON MAIN TOP BAR (#131921) */}
      <div className="bg-[#131921] text-white px-3 sm:px-4 py-2 flex items-center justify-between gap-3 text-xs">
        
        {/* Amazon-style OneStall Logo */}
        <Link
          to="/"
          className="flex items-center gap-1 p-1.5 rounded hover:ring-1 hover:ring-white transition-all flex-shrink-0"
        >
          <div className="flex flex-col leading-none">
            <div className="flex items-center">
              <span className="text-2xl sm:text-[26px] font-heading font-black tracking-tight text-white">
                one<span className="text-[#f3a847]">stall</span>
              </span>
              <span className="text-[11px] text-slate-300 font-bold ml-0.5">.in</span>
            </div>
            {/* Amazon-style smile curve accent */}
            <div className="w-14 h-1 bg-gradient-to-r from-transparent via-[#f3a847] to-amber-500 rounded-full mt-0.5" />
          </div>
        </Link>

        {/* Deliver to Ajay - New Delhi (Amazon Location Selector) */}
        <button
          onClick={() => setPincodeModal(true)}
          className="hidden md:flex items-center gap-1.5 p-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left cursor-pointer flex-shrink-0"
        >
          <MapPin size={16} className="text-[#f3a847] flex-shrink-0 mt-1" />
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] text-slate-300">
              Deliver to {userInfo?.name ? userInfo.name.split(' ')[0] : 'India'}
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              New Delhi {pincode}
            </span>
          </div>
        </button>

        {/* 2. AMAZON SEARCH BAR (Category Selector + Input + Amber Search Button) */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl flex items-center mx-1 sm:mx-2">
          <div className="w-full flex rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#f3a847] bg-white text-slate-900 shadow-inner">
            
            {/* Category Dropdown */}
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-2.5 border-r border-slate-300 focus:outline-none cursor-pointer hidden sm:block font-medium"
            >
              <option value="All">All Departments</option>
              <option value="Electronics">Electronics &amp; Mobiles</option>
              <option value="Laptops">Laptops &amp; Computing</option>
              <option value="Audio">Audio &amp; Wearables</option>
              <option value="Fashion">Fashion &amp; Footwear</option>
              <option value="Home & Kitchen">Home &amp; Kitchen</option>
            </select>

            {/* Search Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OneStall.in, iPhone 16 Pro, MacBook Air M3, Nike Jordans, Sony XM5..."
              className="w-full px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none placeholder:text-slate-500"
            />

            {/* Amazon Orange Search Button */}
            <button
              type="submit"
              className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 px-4 sm:px-5 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
              title="Search"
            >
              <Search size={19} strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* Right Section: EN, Account & Lists, Returns & Orders, Cart */}
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 text-white">
          
          {/* Language Flag (Amazon Style) */}
          <div className="hidden xl:flex items-center gap-1 p-1.5 rounded hover:ring-1 hover:ring-white transition-all cursor-pointer font-bold text-xs">
            <span>🇮🇳</span>
            <span>EN</span>
            <ChevronDown size={10} className="text-slate-400" />
          </div>

          {/* Accounts & Lists Dropdown */}
          <div
            className="relative"
            onMouseLeave={() => setAccountDropdownOpen(false)}
          >
            <button
              onClick={() => {
                if (!userInfo) {
                  navigate('/login');
                } else {
                  setAccountDropdownOpen(!accountDropdownOpen);
                }
              }}
              onMouseEnter={() => setAccountDropdownOpen(true)}
              className="flex flex-col p-1.5 rounded hover:ring-1 hover:ring-white transition-all text-left leading-tight cursor-pointer"
            >
              <span className="text-[11px] text-slate-300">
                Hello, {userInfo?.name ? userInfo.name.split(' ')[0] : 'Sign in'}
              </span>
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <span>Account &amp; Lists</span>
                <ChevronDown size={10} className="text-slate-400" />
              </span>
            </button>

            {accountDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl p-4 z-50 text-xs animate-in fade-in">
                {userInfo ? (
                  <>
                    <div className="pb-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900 text-sm">{userInfo.name}</p>
                      <p className="text-[11px] text-slate-500">{userInfo.email}</p>
                      <span className="inline-block mt-1 bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded text-[10px] uppercase">
                        {userInfo.role}
                      </span>
                    </div>
                    <div className="space-y-2.5 py-3">
                      <Link to="/dashboard" onClick={() => setAccountDropdownOpen(false)} className="block hover:text-[#c45500] font-medium hover:underline">
                        Your Orders &amp; Account
                      </Link>
                      <Link to="/wishlist" onClick={() => setAccountDropdownOpen(false)} className="block hover:text-[#c45500] font-medium hover:underline">
                        Your Wish List
                      </Link>
                      {userInfo.role === 'super_admin' && (
                        <Link to="/admin" onClick={() => setAccountDropdownOpen(false)} className="block text-red-600 font-bold hover:underline">
                          🛡️ Super Admin Console
                        </Link>
                      )}
                    </div>
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          dispatch(userLogout());
                          setAccountDropdownOpen(false);
                          navigate('/login');
                        }}
                        className="w-full text-left text-slate-600 hover:text-red-600 font-semibold cursor-pointer text-xs flex items-center justify-between"
                      >
                        <span>Sign Out</span>
                        <span className="text-[10px] text-slate-400">Exit</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3 py-1">
                    <div className="text-center pb-2 border-b border-slate-100">
                      <Link
                        to="/login"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="block w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold py-2 rounded-lg text-center shadow-sm text-xs"
                      >
                        Sign in
                      </Link>
                      <p className="text-[11px] text-slate-500 mt-2">
                        New customer?{' '}
                        <Link
                          to="/register"
                          onClick={() => setAccountDropdownOpen(false)}
                          className="text-[#007185] hover:text-[#c45500] font-bold hover:underline"
                        >
                          Start here.
                        </Link>
                      </p>
                    </div>
                    <div className="pt-1">
                      <Link
                        to="/admin"
                        onClick={() => setAccountDropdownOpen(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-900 block"
                      >
                        Admin Portal Login →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Returns & Orders */}
          <Link
            to={userInfo ? "/dashboard" : "/login"}
            className="hidden sm:flex flex-col p-1.5 rounded hover:ring-1 hover:ring-white transition-all leading-tight text-left"
          >
            <span className="text-[11px] text-slate-300">Returns</span>
            <span className="text-xs font-bold text-white">&amp; Orders</span>
          </Link>

          {/* Amazon Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-1 p-1.5 rounded hover:ring-1 hover:ring-white transition-all relative text-white"
          >
            <div className="relative">
              <ShoppingBag size={24} className="text-white" />
              <span className="absolute -top-1 left-3 bg-[#f3a847] text-slate-950 text-[11px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <span className="hidden sm:inline font-bold text-xs mt-1">Cart</span>
          </Link>
        </div>
      </div>

      {/* 2. AMAZON SECONDARY NAVIGATION BAR (#232f3e) - Customer Friendly */}
      <div className="bg-[#232f3e] text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-xs overflow-x-auto scrollbar-none border-t border-slate-700/50">
        <div className="flex items-center gap-4 sm:gap-5 whitespace-nowrap">
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center gap-1.5 font-bold hover:ring-1 hover:ring-white p-1 rounded cursor-pointer"
          >
            <Menu size={16} />
            <span>All</span>
          </button>

          {/* Computing & Laptops Highlight */}
          <Link
            to="/?category=Laptops"
            className="font-bold text-[#f3a847] hover:text-white flex items-center gap-1.5 p-1 rounded hover:ring-1 hover:ring-white transition-colors"
          >
            <span>💻 Laptops &amp; Computing</span>
            <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">M3 Deals</span>
          </Link>

          <Link to="/?category=Electronics" className="text-slate-200 hover:text-white p-1 rounded hover:ring-1 hover:ring-white transition-colors font-medium">
            Mobiles &amp; Electronics
          </Link>

          <Link to="/?category=Audio" className="text-slate-200 hover:text-white p-1 rounded hover:ring-1 hover:ring-white transition-colors font-medium">
            Audio &amp; Wearables
          </Link>

          <Link to="/?category=Fashion" className="text-slate-200 hover:text-white p-1 rounded hover:ring-1 hover:ring-white transition-colors font-medium">
            Fashion &amp; Shoes
          </Link>

          <Link to="/?category=Home%20%26%20Kitchen" className="text-slate-200 hover:text-white p-1 rounded hover:ring-1 hover:ring-white transition-colors font-medium">
            Home &amp; Kitchen
          </Link>

          <Link to="/?category=Electronics" className="text-slate-200 hover:text-white p-1 rounded hover:ring-1 hover:ring-white transition-colors font-medium">
            Today's Deals
          </Link>

          <Link to="/dashboard" className="text-slate-200 hover:text-white p-1 rounded hover:ring-1 hover:ring-white transition-colors font-medium">
            Customer Service
          </Link>
        </div>

        {/* Customer Assurance Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 font-medium pl-4">
          <span className="text-blue-400 font-black italic">✓prime</span>
          <span>FREE Fast Delivery on eligible orders</span>
        </div>
      </div>

      {/* Pincode Selector Modal */}
      {pincodeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-heading font-bold text-base flex items-center gap-2">
                <MapPin className="text-[#f3a847]" size={18} />
                Choose your delivery location
              </h3>
              <button onClick={() => setPincodeModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Delivery speeds and items vary based on your local OneStall Cargo franchise hub.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit pincode (e.g. 110001)"
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#f3a847] font-mono"
              />
              <button
                onClick={() => setPincodeModal(false)}
                className="bg-[#febd69] hover:bg-[#f3a847] text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Apply
              </button>
            </div>
            <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl font-medium">
              ✓ Pincode {pincode} eligible for FREE 2-Day Delivery via OneStall Central Hub.
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
