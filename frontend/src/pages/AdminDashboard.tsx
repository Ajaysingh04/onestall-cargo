import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  Building2,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Truck,
  Eye,
  EyeOff,
  LogOut,
  Store,
  ExternalLink,
  Search,
  Menu,
  X,
  MapPin,
  Activity,
  BarChart4,
  Wallet,
  UploadCloud,
  FileSpreadsheet,
  Download,
  IndianRupee,
  Clock
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState, AppDispatch } from '../store/store';
import { login, switchDemoRole, logout } from '../slices/authSlice';
import axios from 'axios';

const salesData = [
  { name: 'Mon', gmv: 84000, cargoBookings: 240 },
  { name: 'Tue', gmv: 92000, cargoBookings: 290 },
  { name: 'Wed', gmv: 110000, cargoBookings: 380 },
  { name: 'Thu', gmv: 104000, cargoBookings: 310 },
  { name: 'Fri', gmv: 145000, cargoBookings: 460 },
  { name: 'Sat', gmv: 182000, cargoBookings: 520 },
  { name: 'Sun', gmv: 210000, cargoBookings: 610 },
];

const slaData = [
  { name: 'North', onTime: 95, delayed: 5 },
  { name: 'South', onTime: 88, delayed: 12 },
  { name: 'East', onTime: 92, delayed: 8 },
  { name: 'West', onTime: 97, delayed: 3 },
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading: authLoading } = useSelector((state: RootState) => state.auth);

  // Admin gate state
  const [adminEmail, setAdminEmail] = useState('admin@onestall.com');
  const [adminPass, setAdminPass] = useState('admin@onestallcargo');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'analytics' | 'fleet' | 'slas' | 'products' | 'anomalies' | 'financials' | 'pricing' | 'bulk'>('analytics');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // AI Anomaly alerts
  const [anomalies, setAnomalies] = useState([
    { id: 'ano-1', severity: 'HIGH', title: 'Sudden RTO Spike in Mumbai West Zone', description: 'RTO percentage increased from 3.2% to 11.8% over last 48 hours.', time: '25 mins ago' },
    { id: 'ano-2', severity: 'MEDIUM', title: 'Transit Corridor SLA Delay', description: 'Highway freight vehicle delayed by 2 hours due to rain.', time: '1 hour ago' },
  ]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, franRes] = await Promise.all([
        axios.get('/api/products').catch(() => ({ data: [] })),
        axios.get('/api/franchises').catch(() => ({ data: [] })),
      ]);
      setProducts(prodRes.data || []);
      setFranchises(franRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await dispatch(login({ email: adminEmail, password: adminPass })).unwrap();
    } catch (err: any) {
      setAuthError(err || 'Authentication failed. Please check credentials.');
    }
  };

  const handle1ClickAdmin = () => {
    dispatch(switchDemoRole('super_admin'));
  };

  const isSuperAdmin = userInfo?.isAdmin || userInfo?.role === 'super_admin';

  const menuGroups = [
    {
      title: 'Main Operations',
      items: [
        { id: 'analytics', label: 'GMV & Analytics', icon: LayoutDashboard },
        { id: 'anomalies', label: 'AI Anomaly Radar', icon: Sparkles, badge: anomalies.length, highlight: true },
        { id: 'products', label: 'Catalog Inventory', icon: Package, badge: products.length },
      ]
    },
    {
      title: 'Logistics Network',
      items: [
        { id: 'fleet', label: 'Live Fleet & Heat Map', icon: MapPin },
        { id: 'slas', label: 'Delivery & SLAs', icon: Activity },
      ]
    },
    {
      title: 'Finance & Tools',
      items: [
        { id: 'financials', label: 'Reports & COD', icon: Wallet },
        { id: 'pricing', label: 'Pricing & Incentives', icon: IndianRupee },
        { id: 'bulk', label: 'Bulk Operations', icon: UploadCloud },
      ]
    }
  ];

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-[#050505] flex justify-center items-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative z-10"
        >
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-white/10 flex items-center justify-center text-red-400 mb-4 shadow-inner">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">Admin Portal</h2>
            <p className="text-sm text-slate-400 mt-2">Sign in to access Central Operations</p>
          </div>

          {authError && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center">
              {authError}
            </motion.div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email Address</label>
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
              {authLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button onClick={handle1ClickAdmin} className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2 w-full">
               <Sparkles size={14} className="text-amber-500" /> Bypass with Demo Token
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) => p.name?.toLowerCase().includes(productSearch.toLowerCase()) || p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans flex overflow-hidden">
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ width: 280 }} animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="h-screen bg-white/[0.02] border-r border-white/10 flex flex-col relative z-20 backdrop-blur-xl flex-shrink-0 transition-all duration-300"
      >
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                <ShieldAlert size={16} />
              </div>
              <span className="font-black text-lg tracking-tight text-white">OneStall<span className="text-red-500">.</span></span>
            </motion.div>
          )}
          {!isSidebarOpen && (
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg">
               <ShieldAlert size={16} />
             </div>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-6 w-8 h-8 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer z-50 shadow-xl">
             {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6 no-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              {isSidebarOpen && <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-4 mb-2">{group.title}</h4>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                      isActive ? (item.highlight ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 text-amber-400 border border-amber-500/20' : 'bg-white/10 text-white border border-white/10 shadow-lg') : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon size={18} className={`${isActive && item.highlight ? 'text-amber-400' : ''}`} />
                    {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
                    {isSidebarOpen && item.badge !== undefined && (
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${item.highlight ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{item.badge}</span>
                    )}
                    {isActive && <motion.div layoutId="activeNav" className={`absolute left-0 w-1 h-6 rounded-r-full ${item.highlight ? 'bg-amber-500' : 'bg-blue-500'}`} />}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-2">
           <Link to="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-white/5 hover:text-white transition-all text-sm font-medium border border-transparent">
             <Store size={18} />
             {isSidebarOpen && <span>View Marketplace</span>}
           </Link>
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
               {menuGroups.flatMap(g => g.items).find(m => m.id === activeTab)?.label}
             </h1>
             <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Uptime 99.99%
             </span>
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
               className="max-w-7xl mx-auto space-y-6"
             >
               
               {/* TAB CONTENT: ANALYTICS */}
               {activeTab === 'analytics' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:col-span-2 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
                      <div className="flex items-center justify-between mb-8 relative z-10">
                        <div>
                          <h3 className="font-bold text-white text-lg">GMV Growth Trajectory</h3>
                          <p className="text-xs text-slate-400 mt-1">7-day gross merchandise value trend</p>
                        </div>
                      </div>
                      <div className="h-72 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#64748B" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                            <YAxis stroke="#64748B" tick={{fontSize: 12}} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} itemStyle={{ color: '#fff' }} />
                            <Area type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorGmv)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-lg mb-6">Zone Pincode Coverage</h3>
                        <div className="space-y-4">
                          {[
                            { zone: 'North Zone', count: '11,200', pct: 85 },
                            { zone: 'West Zone', count: '7,800', pct: 60 },
                            { zone: 'South Zone', count: '6,500', pct: 50 },
                            { zone: 'East Zone', count: '2,300', pct: 25 },
                          ].map((item, i) => (
                            <div key={i} className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span className="text-slate-300 font-medium">{item.zone}</span>
                                <span className="text-emerald-400 font-bold">{item.count}</span>
                              </div>
                              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1, delay: 0.2 + (i*0.1) }} className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
               )}

               {/* TAB CONTENT: PRODUCTS */}
               {activeTab === 'products' && (
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[calc(100vh-140px)]">
                   <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02]">
                     <div>
                       <h3 className="font-bold text-white text-lg">Inventory Catalog</h3>
                       <p className="text-xs text-slate-400 mt-1">Manage global product listings and commissions</p>
                     </div>
                     <div className="relative w-full sm:w-72">
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        <input type="text" value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search SKU or Name..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2 pl-10 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all" />
                     </div>
                   </div>
                   
                   <div className="flex-1 overflow-auto no-scrollbar">
                     <table className="w-full text-left text-sm">
                       <thead className="bg-white/[0.02] text-slate-400 uppercase text-[10px] tracking-widest sticky top-0 backdrop-blur-md border-b border-white/10 z-10">
                         <tr>
                           <th className="px-6 py-4 font-semibold">Product Detail</th>
                           <th className="px-6 py-4 font-semibold">Price</th>
                           <th className="px-6 py-4 font-semibold">Stock</th>
                           <th className="px-6 py-4 font-semibold">Seller</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                         {filteredProducts.map((p: any, i) => (
                           <motion.tr initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} key={p._id} className="hover:bg-white/[0.03] transition-colors cursor-pointer">
                             <td className="px-6 py-4">
                               <div className="font-medium text-white truncate max-w-[250px]">{p.name}</div>
                               <div className="text-[10px] text-slate-500 mt-0.5">{p.sku || 'SKU-PENDING'} • {p.category}</div>
                             </td>
                             <td className="px-6 py-4 font-bold text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                             <td className="px-6 py-4"><span className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs">{p.countInStock} units</span></td>
                             <td className="px-6 py-4 text-slate-400 text-xs">{p.sellerName || 'Appario Retail'}</td>
                           </motion.tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
               )}

               {/* TAB CONTENT: AI ANOMALIES */}
               {activeTab === 'anomalies' && (
                 <div className="max-w-4xl mx-auto space-y-4">
                   <h3 className="font-bold text-white text-xl mb-6">Active AI Insights</h3>
                   {anomalies.map((ano, i) => (
                     <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={ano.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:bg-white/[0.08] transition-all cursor-pointer">
                       <div className={`absolute top-0 left-0 w-1 h-full ${ano.severity === 'HIGH' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                       <div className="flex justify-between items-start mb-3">
                         <div className="flex items-center gap-3">
                           <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase ${ano.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>{ano.severity} ALERT</span>
                           <h4 className="font-bold text-white text-base">{ano.title}</h4>
                         </div>
                         <span className="text-xs text-slate-500 font-mono bg-black/40 px-2 py-1 rounded-md">{ano.time}</span>
                       </div>
                       <p className="text-sm text-slate-400">{ano.description}</p>
                     </motion.div>
                   ))}
                 </div>
               )}

               {/* NEW TAB: FLEET & HEAT MAP */}
               {activeTab === 'fleet' && (
                 <div className="space-y-6">
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-96 relative overflow-hidden flex flex-col items-center justify-center text-center">
                     <div className="absolute inset-0 bg-[url('https://maps.gstatic.com/mapfiles/transparent.png')] opacity-10" />
                     <MapPin size={48} className="text-rose-500 mb-4 animate-bounce" />
                     <h3 className="text-2xl font-bold text-white mb-2">Live Rider Map & Delivery Heat Map</h3>
                     <p className="text-slate-400 max-w-lg mb-6">Real-time GPS tracking of active riders and density maps of high-order zones. Awaiting API integration from the mobile rider app.</p>
                     <div className="flex gap-4">
                       <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2 rounded-xl text-sm transition-colors">Configure Zones</button>
                       <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm transition-colors shadow-lg">Connect Map API</button>
                     </div>
                   </div>
                 </div>
               )}

               {/* NEW TAB: SLAs & PERFORMANCE */}
               {activeTab === 'slas' && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                      <h3 className="font-bold text-white text-lg mb-6">Delivery Performance Dashboard</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={slaData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                            <XAxis type="number" stroke="#64748B" />
                            <YAxis dataKey="name" type="category" stroke="#64748B" width={50} />
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
                            <Bar dataKey="onTime" name="On Time SLA %" fill="#10B981" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="delayed" name="Delayed %" fill="#F43F5E" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                      <h3 className="font-bold text-white text-lg mb-2">SLA Monitoring System</h3>
                      <p className="text-sm text-slate-400 mb-6">Real-time alerts for shipments breaching the 48-hour delivery window.</p>
                      <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex items-start gap-4">
                        <AlertTriangle className="text-rose-400 flex-shrink-0" />
                        <div>
                          <h4 className="text-rose-400 font-bold text-sm">Critical: 14 Shipments Delayed</h4>
                          <p className="text-xs text-rose-400/80 mt-1">Delhi-Jaipur corridor experiencing weather delays. SLAs automatically extended.</p>
                        </div>
                      </div>
                    </div>
                 </div>
               )}

               {/* NEW TAB: FINANCIALS & REPORTS */}
               {activeTab === 'financials' && (
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                       <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Franchise Reports</h4>
                       <div className="text-2xl font-black text-white mb-4">4 Active Hubs</div>
                       <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><FileSpreadsheet size={14} /> Download EOD Report</button>
                     </div>
                     <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                       <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Cancelled Orders</h4>
                       <div className="text-2xl font-black text-white mb-4">124 (2.1%)</div>
                       <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><Eye size={14} /> View Audit Logs</button>
                     </div>
                     <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                       <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">COD Reconciliation</h4>
                       <div className="text-2xl font-black text-emerald-400 mb-4">₹4.2L Pending</div>
                       <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><IndianRupee size={14} /> Settle Payments</button>
                     </div>
                   </div>
                 </div>
               )}

               {/* NEW TAB: PRICING & INCENTIVES */}
               {activeTab === 'pricing' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                     <h3 className="font-bold text-white text-lg mb-1">Zone-wise Delivery Charges</h3>
                     <p className="text-xs text-slate-400 mb-6">Manage flat-rate cargo fees based on regional zones.</p>
                     <div className="space-y-4">
                       {['North (Local)', 'South (Inter-state)', 'East (Remote)', 'West (Metro)'].map((zone, i) => (
                         <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                           <span className="text-sm font-medium text-slate-300">{zone}</span>
                           <span className="text-sm font-bold text-white">₹{40 + (i*20)} / kg</span>
                         </div>
                       ))}
                     </div>
                   </div>
                   <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                     <h3 className="font-bold text-white text-lg mb-1">Rider Incentive Management</h3>
                     <p className="text-xs text-slate-400 mb-6">Dynamic bonus multipliers for festive/rainy seasons.</p>
                     <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl mb-4">
                       <h4 className="text-emerald-400 font-bold text-sm">Active Surge: Rain Alert (Mumbai)</h4>
                       <p className="text-xs text-emerald-400/80 mt-1">Riders earning +1.5x per successful delivery.</p>
                     </div>
                     <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl text-sm font-bold transition-colors">Configure Incentive Slabs</button>
                   </div>
                 </div>
               )}

               {/* NEW TAB: BULK OPERATIONS */}
               {activeTab === 'bulk' && (
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                   <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center text-blue-400 mb-6 border border-blue-500/20">
                     <UploadCloud size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-white mb-2">Bulk Order Import</h3>
                   <p className="text-slate-400 max-w-md mb-8">Drag and drop your Excel or CSV files here to instantly create thousands of cargo shipments or update catalog inventory.</p>
                   
                   <div className="flex gap-4">
                     <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2">
                       <Download size={16} /> Download Template
                     </button>
                     <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg transition-colors">
                       Select CSV File
                     </button>
                   </div>
                 </div>
               )}

             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
