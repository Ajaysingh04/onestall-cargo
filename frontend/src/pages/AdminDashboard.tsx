import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Store as StoreIcon,
  Bike,
  Truck,
  Building2,
  PackageCheck,
  Wallet,
  BarChart4,
  ShieldAlert,
  Sparkles,
  Eye,
  EyeOff,
  LogOut,
  Search,
  Menu,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState, AppDispatch } from '../store/store';
import { login, switchDemoRole, logout } from '../slices/authSlice';

const salesData = [
  { name: 'Mon', gmv: 84000, bookings: 240 },
  { name: 'Tue', gmv: 92000, bookings: 290 },
  { name: 'Wed', gmv: 110000, bookings: 380 },
  { name: 'Thu', gmv: 104000, bookings: 310 },
  { name: 'Fri', gmv: 145000, bookings: 460 },
  { name: 'Sat', gmv: 182000, bookings: 520 },
  { name: 'Sun', gmv: 210000, bookings: 610 },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading: authLoading } = useSelector((state: RootState) => state.auth);

  const [adminEmail, setAdminEmail] = useState('admin@onestall.com');
  const [adminPass, setAdminPass] = useState('admin@onestallcargo');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await dispatch(login({ email: adminEmail, password: adminPass })).unwrap();
    } catch (err: any) {
      setAuthError(err || 'Authentication failed. Please check credentials.');
    }
  };

  const isSuperAdmin = userInfo?.isAdmin || userInfo?.role === 'super_admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sellers', label: 'Seller Management', icon: StoreIcon },
    { id: 'customers', label: 'Customer Management', icon: Users },
    { id: 'riders', label: 'Rider Management', icon: Bike },
    { id: 'couriers', label: 'Courier Partner', icon: Truck },
    { id: 'warehouse', label: 'Warehouse Management', icon: Building2 },
    { id: 'bookings', label: 'Booking Management', icon: PackageCheck },
    { id: 'payments', label: 'Payment & COD', icon: Wallet },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart4 },
  ];

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center text-red-400 mb-4 shadow-inner">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">OneStall Admin</h2>
          </div>

          {authError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {authError}
            </motion.div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-red-500/50" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300"><Eye size={18} /></button>
              </div>
            </div>
            <button type="submit" disabled={authLoading} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              {authLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button onClick={() => dispatch(switchDemoRole('super_admin'))} className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2 w-full">
               <Sparkles size={14} className="text-amber-500" /> Bypass with Demo
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Network GMV', value: '₹14,50,000', icon: LayoutDashboard, color: 'blue' },
                { label: 'Active Cargo Bookings', value: '1,240', icon: PackageCheck, color: 'emerald' },
                { label: 'Registered Sellers', value: '342', icon: StoreIcon, color: 'amber' },
                { label: 'Active Riders', value: '89', icon: Bike, color: 'rose' },
              ].map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-10 h-10 rounded-xl bg-${metric.color}-500/10 flex items-center justify-center text-${metric.color}-400 group-hover:scale-110 transition-transform`}><Icon size={18} /></div>
                    </div>
                    <h4 className="text-3xl font-black text-white tracking-tight mb-1">{metric.value}</h4>
                    <p className="text-xs text-slate-400 font-medium">{metric.label}</p>
                  </motion.div>
                )
              })}
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
              <h3 className="font-bold text-white text-lg mb-6 relative z-10">Network Growth (7 Days)</h3>
              <div className="h-72 w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#64748B" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748B" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'sellers':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-white text-lg">Seller Management</h3>
                <p className="text-xs text-slate-400">Approve KYC and manage catalogs</p>
              </div>
              <div className="relative w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input type="text" placeholder="Search sellers..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:border-blue-500/50" />
              </div>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400 uppercase text-[10px] tracking-widest border-b border-white/10">
                  <tr><th className="pb-4">Seller Name</th><th className="pb-4">KYC Status</th><th className="pb-4">Active Listings</th><th className="pb-4">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[1,2,3].map((i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4"><div className="font-bold text-white">Appario Retail {i}</div><div className="text-xs text-slate-500">appario{i}@seller.com</div></td>
                      <td className="py-4"><span className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-xs">Verified</span></td>
                      <td className="py-4 text-white">124 Items</td>
                      <td className="py-4"><button className="text-blue-400 text-xs hover:text-blue-300">Manage Catalog</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'customers':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <Users size={48} className="text-blue-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Customer Management</h3>
             <p className="text-slate-400 text-sm max-w-md">View registered customers, their order history, and handle support tickets here.</p>
          </div>
        );
      case 'riders':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <Bike size={48} className="text-amber-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Rider Management</h3>
             <p className="text-slate-400 text-sm max-w-md">Assign delivery zones, track active riders on map, and process rider payouts.</p>
          </div>
        );
      case 'couriers':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <Truck size={48} className="text-indigo-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Courier Partner Management</h3>
             <p className="text-slate-400 text-sm max-w-md">Manage aggregators (Delhivery, BlueDart), set routing rules, and monitor courier SLAs.</p>
          </div>
        );
      case 'warehouse':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <Building2 size={48} className="text-emerald-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Warehouse Management</h3>
             <p className="text-slate-400 text-sm max-w-md">Control franchise logistics hubs, track inward/outward inventory, and dispatch cargo.</p>
          </div>
        );
      case 'bookings':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <PackageCheck size={48} className="text-rose-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Booking Management</h3>
             <p className="text-slate-400 text-sm max-w-md">Track active AWB shipments, manage NDRs (Non-Delivery Reports), and handle RTOs.</p>
          </div>
        );
      case 'payments':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <Wallet size={48} className="text-green-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Payment & COD Settlement</h3>
             <p className="text-slate-400 text-sm max-w-md">Reconcile COD cash from riders and hubs, and process automatic seller payouts minus commission.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
             <BarChart4 size={48} className="text-cyan-400 mb-4 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Reports & Analytics</h3>
             <p className="text-slate-400 text-sm max-w-md">Export Excel/CSV reports for finance, monitor AI anomaly radar, and track overall network health.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: 260 }} animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="h-screen bg-white/[0.02] border-r border-white/10 flex flex-col relative z-20 backdrop-blur-xl flex-shrink-0 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg"><ShieldAlert size={16} /></div>
              <span className="font-black text-lg tracking-tight text-white">Admin<span className="text-red-500">Panel</span></span>
            </motion.div>
          )}
          {!isSidebarOpen && (
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg"><ShieldAlert size={16} /></div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-6 w-8 h-8 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer z-50 shadow-xl">
             {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  isActive ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon size={18} className={`${isActive ? 'text-blue-400' : ''}`} />
                {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                {isActive && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/5">
           <button onClick={() => { dispatch(logout()); navigate('/'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium border border-transparent">
             <LogOut size={18} />
             {isSidebarOpen && <span>Sign Out</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#07090E] to-[#0A0F1A]">
        
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between bg-white/[0.01] border-b border-white/5 backdrop-blur-md flex-shrink-0 z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-white tracking-tight">
               {menuItems.find(m => m.id === activeTab)?.label}
             </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-sm font-bold text-white">{userInfo?.name || 'Super Admin'}</span>
               <span className="text-[10px] text-slate-400">{userInfo?.email || 'admin@onestall.com'}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-[#07090E] shadow-lg">SA</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar relative">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
               className="max-w-7xl mx-auto h-[calc(100vh-140px)]"
             >
               {renderTabContent()}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
