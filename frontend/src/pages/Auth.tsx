import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError, switchDemoRole } from '../slices/authSlice';
import type { RootState, AppDispatch } from '../store/store';

const Auth: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Determine initial mode based on path
  const isRegisterPath = location.pathname.includes('register') || location.pathname.includes('signup');
  const [isLogin, setIsLogin] = useState(!isRegisterPath);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { loading, error, userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setIsLogin(!isRegisterPath);
  }, [location.pathname, isRegisterPath]);

  useEffect(() => {
    if (userInfo) {
      if (userInfo.role === 'super_admin') {
        navigate('/admin');
      } else if (userInfo.role === 'seller') {
        navigate('/seller');
      } else {
        navigate('/');
      }
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    dispatch(clearError());
    setValidationError(null);
  }, [isLogin, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!isLogin) {
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match. Please re-check.');
        return;
      }
      dispatch(register({ name, email, password }));
    } else {
      dispatch(login({ email, password }));
    }
  };

  const handleQuickLogin = (roleKey: 'customer' | 'seller' | 'super_admin') => {
    dispatch(switchDemoRole(roleKey));
    if (roleKey === 'super_admin') {
      navigate('/admin');
    } else if (roleKey === 'seller') {
      navigate('/seller');
    } else {
      navigate('/');
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!password) return null;
    if (password.length < 6) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-600', width: 'w-1/3' };
    if (password.length < 10) return { label: 'Good', color: 'bg-amber-500', text: 'text-amber-600', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-600', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-[85vh] bg-[#eaeded]/70 flex flex-col justify-center items-center py-12 px-4 sm:px-6 font-sans">
      
      {/* Brand Header with Smile Curve */}
      <Link to="/" className="mb-6 flex flex-col items-center group">
        <div className="flex items-center">
          <span className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-slate-900">
            one<span className="text-[#f3a847]">stall</span>
          </span>
          <span className="text-xs text-slate-500 font-bold ml-0.5">.in</span>
        </div>
        <div className="w-20 h-1.5 bg-gradient-to-r from-transparent via-[#f3a847] to-amber-500 rounded-full mt-1 group-hover:scale-105 transition-transform" />
      </Link>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-white border border-slate-300/80 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-2">
            <Loader2 className="animate-spin text-[#e47911]" size={36} />
            <span className="text-xs font-bold text-slate-700">Verifying credentials...</span>
          </div>
        )}

        {/* Tab Switcher (Sign In vs Create Account) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              isLogin
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              !isLogin
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-heading font-black text-slate-900 tracking-tight">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin
              ? 'Access your orders, wishlist & 2-3 day doorstep delivery'
              : 'Join OneStall.in to get access to exclusive deals and tracking'}
          </p>
        </div>

        {/* Error Alerts */}
        {(error || validationError) && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2.5 animate-in fade-in">
            <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
            <span className="font-medium">{error || validationError}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Your Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f3a847] focus:ring-2 focus:ring-[#f3a847]/20 transition-all font-medium"
                  placeholder="First and last name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Email or Mobile Phone Number
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f3a847] focus:ring-2 focus:ring-[#f3a847]/20 transition-all font-medium"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={() => alert('For testing, use password: password123 or select 1-Click demo below.')}
                  className="text-xs text-[#007185] hover:text-[#c45500] font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f3a847] focus:ring-2 focus:ring-[#f3a847]/20 transition-all font-medium"
                placeholder={isLogin ? '••••••••' : 'At least 6 characters'}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password strength meter for registration */}
            {!isLogin && strength && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Password strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Re-enter Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 text-slate-400" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f3a847] focus:ring-2 focus:ring-[#f3a847]/20 transition-all font-medium"
                  placeholder="Re-type password"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          {isLogin && (
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 pt-0.5">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#f3a847] focus:ring-[#f3a847] w-4 h-4"
              />
              <span>Keep me signed in on this device</span>
            </label>
          )}

          {/* Primary Action Button (Amazon Golden Button) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffd814] hover:bg-[#f7ca00] active:bg-[#f2ba00] text-slate-950 font-bold py-3 rounded-xl text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isLogin ? 'Sign In to OneStall' : 'Create your OneStall account'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-slate-500 leading-relaxed text-center">
          By continuing, you agree to OneStall's{' '}
          <span className="text-[#007185] hover:underline cursor-pointer">Conditions of Use</span> and{' '}
          <span className="text-[#007185] hover:underline cursor-pointer">Privacy Notice</span>.
        </p>

        {/* Quick 1-Click Demo Profiles */}
        <div className="pt-4 border-t border-slate-200/80">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Sparkles size={14} className="text-[#e47911]" />
            <span className="text-xs font-bold text-slate-800">
              Quick 1-Click Demo Logins
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('customer')}
              className="px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs transition-colors cursor-pointer"
            >
              <p className="font-bold text-slate-900 truncate">👤 Customer</p>
              <p className="text-[10px] text-slate-500 truncate">Ajay Sharma</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('seller')}
              className="px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left text-xs transition-colors cursor-pointer"
            >
              <p className="font-bold text-slate-900 truncate">🏢 Seller</p>
              <p className="text-[10px] text-slate-500 truncate">Appario Retail</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('super_admin')}
              className="px-2.5 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-left text-xs transition-colors cursor-pointer"
            >
              <p className="font-bold text-red-800 truncate">🛡️ Admin</p>
              <p className="text-[10px] text-red-600 truncate">Super Console</p>
            </button>
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <div className="flex items-center justify-center gap-4 text-[11px] text-[#007185]">
          <span className="hover:underline cursor-pointer">Conditions of Use</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Privacy Notice</span>
          <span>•</span>
          <span className="hover:underline cursor-pointer">Help &amp; FAQs</span>
        </div>
        <p className="text-[10px] text-slate-400 pt-1">
          © 2026 OneStall.in, Inc. or its affiliates. All rights reserved.
        </p>
      </div>

    </div>
  );
};

export default Auth;
