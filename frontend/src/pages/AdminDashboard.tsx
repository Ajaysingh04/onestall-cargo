import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  DollarSign,
  Package,
  Plus,
  X,
  Trash2,
  Building2,
  Bike,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Truck,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Store,
  ExternalLink,
  Search,
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

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading: authLoading } = useSelector((state: RootState) => state.auth);

  // Admin gate state
  const [adminEmail, setAdminEmail] = useState('admin@onestall.in');
  const [adminPass, setAdminPass] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'analytics' | 'franchises' | 'couriers' | 'products' | 'anomalies' | 'commission'>('analytics');
  const [products, setProducts] = useState<any[]>([]);
  const [franchises, setFranchises] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Category commission settings (PRD Section 5.7)
  const [commissions, setCommissions] = useState({
    Electronics: 10,
    Laptops: 8,
    Fashion: 12,
    'Home & Kitchen': 10,
    Audio: 10,
    Beauty: 12,
  });

  // AI Anomaly alerts (PRD Section 5.20)
  const [anomalies, setAnomalies] = useState([
    {
      id: 'ano-1',
      severity: 'HIGH',
      title: 'Sudden RTO Spike in Mumbai West Zone (Pincode 400050)',
      description: 'RTO percentage increased from 3.2% to 11.8% over last 48 hours. Auto NDR follow-up triggered.',
      time: '25 mins ago',
    },
    {
      id: 'ano-2',
      severity: 'MEDIUM',
      title: 'Transit Corridor SLA Delay on Delhi-Jaipur Route',
      description: 'Highway freight vehicle DL-1L-4421 delayed by 2 hours due to rain. Recalculating customer delivery ETAs.',
      time: '1 hour ago',
    },
    {
      id: 'ano-3',
      severity: 'LOW',
      title: 'High Seller Demand: Electronics & Laptops Category',
      description: 'Stock ageing velocity index +45%. Recommended inventory reorder alerts dispatched to Appario Retail.',
      time: '3 hours ago',
    },
  ]);

  // Courier comparison data (PRD 5.8)
  const courierPerformance = [
    {
      name: 'OneStall Express (In-House Hubs)',
      deliveredPercent: 98.4,
      onTimeSla: 99.1,
      rtoPercent: 1.8,
      avgDeliveryHours: 18.5,
      marketShare: '62%',
    },
    {
      name: 'Blue Dart Air Express',
      deliveredPercent: 96.2,
      onTimeSla: 95.8,
      rtoPercent: 3.4,
      avgDeliveryHours: 24.0,
      marketShare: '18%',
    },
    {
      name: 'Delhivery Surface Pro',
      deliveredPercent: 93.8,
      onTimeSla: 91.5,
      rtoPercent: 5.2,
      avgDeliveryHours: 42.0,
      marketShare: '14%',
    },
    {
      name: 'Shadowfax Hyperlocal',
      deliveredPercent: 94.5,
      onTimeSla: 93.0,
      rtoPercent: 4.8,
      avgDeliveryHours: 12.0,
      marketShare: '6%',
    },
  ];

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
      // Fallback for offline demo
      dispatch(switchDemoRole('super_admin'));
    }
  };

  const handle1ClickAdmin = () => {
    dispatch(switchDemoRole('super_admin'));
  };

  const isSuperAdmin = userInfo?.role === 'super_admin';

  // ==========================================
  // VIEW 1: ADMIN SECURITY LOCK SCREEN
  // ==========================================
  if (!isSuperAdmin) {
    return (
      <div className="min-h-[85vh] bg-[#0b1120] text-white flex flex-col justify-center items-center py-16 px-4">
        <div className="w-full max-w-md bg-[#131d33] border border-slate-700/80 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-36 h-36 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert size={26} />
            </div>
            <div>
              <h2 className="text-xl font-heading font-black text-white">OneStall Operations</h2>
              <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Restricted Admin Gate
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Authorized personnel only. Central hub logistics, seller payouts, network commission engine &amp; PRD audit telemetry.
          </p>

          {authError && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs">
              {authError}
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Master Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white focus:outline-none focus:border-red-500 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-red-600/20"
            >
              Sign In to Admin Console
            </button>
          </form>

          {/* 1-Click Fast Unlock */}
          <div className="pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handle1ClickAdmin}
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>1-Click Instant Demo: Unlock as Super Admin</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1">
              <Store size={14} />
              <span>Back to Customer Marketplace</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN COMMAND CENTER
  // ==========================================
  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070d19] text-slate-100 font-sans py-8 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <ShieldAlert size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-heading font-black text-white">OneStall Central Operations</h1>
                <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Super Admin
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Live Uptime: 99.98%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                PRD Central Command: Network GMV, In-House Cargo Hubs, Multi-Courier Aggregation &amp; AI Radar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Store size={15} className="text-amber-400" />
              <span>View Customer Store</span>
            </Link>

            <button
              onClick={() => {
                dispatch(switchDemoRole('customer'));
                navigate('/');
              }}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut size={15} />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex flex-wrap gap-2 bg-[#0e172a] p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 GMV &amp; Logistics Overview
          </button>
          <button
            onClick={() => setActiveTab('franchises')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'franchises' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏢 Franchise Hubs ({franchises.length || 3})
          </button>
          <button
            onClick={() => setActiveTab('couriers')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'couriers' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            🚚 Courier Matrix &amp; Aggregator
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 Catalog Inventory ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('anomalies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'anomalies' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles size={14} />
            <span>AI Anomaly Radar ({anomalies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'commission' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚙️ Commission Engine
          </button>
        </div>

        {/* High-Level Overview Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#111c33] rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Network Weekly GMV</span>
              <DollarSign size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-heading font-black text-white">₹9,27,000</div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1">
              <ArrowUpRight size={13} />
              <span>+24.5% vs last week</span>
            </div>
          </div>

          <div className="bg-[#111c33] rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Cargo Parcels Dispatched</span>
              <Truck size={16} className="text-blue-400" />
            </div>
            <div className="text-3xl font-heading font-black text-white">2,810</div>
            <div className="text-[11px] text-slate-400">98.4% delivered within 2-3 day SLA</div>
          </div>

          <div className="bg-[#111c33] rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Active Franchise Hubs</span>
              <Building2 size={16} className="text-amber-400" />
            </div>
            <div className="text-3xl font-heading font-black text-white">
              {franchises.length || 3} Centres
            </div>
            <div className="text-[11px] text-amber-400">Delhi, Mumbai, Bengaluru</div>
          </div>

          <div className="bg-[#111c33] rounded-2xl p-5 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Global RTO / Return Rate</span>
              <AlertTriangle size={16} className="text-rose-400" />
            </div>
            <div className="text-3xl font-heading font-black text-white">2.4%</div>
            <div className="text-[11px] text-emerald-400">Well below 5% industry target</div>
          </div>
        </div>

        {/* TAB 1: GMV & LOGISTICS ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-white text-base">
                    GMV vs OneStall Cargo Delivery Volume (7 Days)
                  </h3>
                  <p className="text-xs text-slate-400">Daily gross merchandise value and door deliveries</p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                  Peak Velocity
                </span>
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                    <XAxis dataKey="name" stroke="#64748B" textAnchor="middle" />
                    <YAxis stroke="#64748B" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderColor: '#334155',
                        borderRadius: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="gmv"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#gmvGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 lg:col-span-1 space-y-4">
              <h3 className="font-heading font-bold text-white text-base">Network Pincode Coverage</h3>
              <div className="space-y-3 text-xs">
                <div className="bg-[#0b1120] p-3 rounded-xl flex items-center justify-between border border-slate-800">
                  <span>North Zone (Delhi NCR, UP, Rajasthan)</span>
                  <span className="font-bold text-emerald-400">11,200 Pincodes</span>
                </div>
                <div className="bg-[#0b1120] p-3 rounded-xl flex items-center justify-between border border-slate-800">
                  <span>West Zone (Maharashtra, Gujarat)</span>
                  <span className="font-bold text-emerald-400">7,800 Pincodes</span>
                </div>
                <div className="bg-[#0b1120] p-3 rounded-xl flex items-center justify-between border border-slate-800">
                  <span>South Zone (Karnataka, TN, Telangana)</span>
                  <span className="font-bold text-emerald-400">6,500 Pincodes</span>
                </div>
                <div className="bg-[#0b1120] p-3 rounded-xl flex items-center justify-between border border-slate-800">
                  <span>East &amp; North-East</span>
                  <span className="font-bold text-emerald-400">2,300 Pincodes</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/cargo"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Open Full Cargo Dispatch Portal</span>
                  <ExternalLink size={14} />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FRANCHISE HUB CONTROLS */}
        {activeTab === 'franchises' && (
          <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  Franchise Logistics Hubs Management (PRD Section 3.2)
                </h3>
                <p className="text-xs text-slate-400">
                  Live telemetry from scoped franchise distribution centres across Tier 1 corridors
                </p>
              </div>
              <Link
                to="/franchise"
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
              >
                <span>Franchise Console</span>
                <ExternalLink size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {franchises.map((hub: any) => (
                <div key={hub._id || hub.centreCode} className="bg-[#0b1120] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {hub.centreCode}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                      {hub.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-white text-sm">{hub.centreName}</h4>
                  <p className="text-xs text-slate-400">{hub.address}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Today Bookings</span>
                      <span className="font-bold text-white">{hub.todayBookings} pkgs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Delivered</span>
                      <span className="font-bold text-emerald-400">{hub.todayDelivered} pkgs</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">COD Collected</span>
                      <span className="font-bold text-white">₹{hub.codCollectedToday?.toLocaleString('en-IN')}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Hub Score</span>
                      <span className="font-bold text-amber-400">{hub.performanceScore}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COURIER BENCHMARKS (PRD 5.8) */}
        {activeTab === 'couriers' && (
          <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="font-heading font-bold text-white text-base">
                Multi-Courier Partner Performance Matrix
              </h3>
              <p className="text-xs text-slate-400">
                PRD 5.8: Compare Delivered %, Delayed %, RTO %, and Average Delivery SLA across aggregated courier partners.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1120] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Courier Partner</th>
                    <th className="p-3">Delivered %</th>
                    <th className="p-3">On-Time SLA %</th>
                    <th className="p-3">RTO %</th>
                    <th className="p-3">Avg Hours to Door</th>
                    <th className="p-3">Routing Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {courierPerformance.map((c, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        <Truck size={15} className={i === 0 ? 'text-blue-400' : 'text-slate-400'} />
                        <span>{c.name}</span>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">{c.deliveredPercent}%</td>
                      <td className="p-3 text-slate-200">{c.onTimeSla}%</td>
                      <td className="p-3 font-medium text-rose-400">{c.rtoPercent}%</td>
                      <td className="p-3 text-slate-300">{c.avgDeliveryHours} hrs</td>
                      <td className="p-3">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px] font-mono text-white">
                          {c.marketShare}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATALOG INVENTORY */}
        {activeTab === 'products' && (
          <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-heading font-bold text-white text-base">
                  Marketplace Products &amp; Stock Velocity
                </h3>
                <p className="text-xs text-slate-400">Approved catalog items fulfilled via 2-3 day delivery</p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter products..."
                  className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-3 py-2 pl-9 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1120] text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-3">Product Name</th>
                    <th className="p-3">SKU / HSN</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Seller</th>
                    <th className="p-3">Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p: any) => (
                    <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white max-w-xs truncate">
                        {p.name}
                      </td>
                      <td className="p-3 font-mono text-slate-400">{p.sku || 'OS-SKU'}</td>
                      <td className="p-3 text-slate-300">{p.category}</td>
                      <td className="p-3 font-bold text-white">₹{p.price?.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          p.countInStock > 10 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {p.countInStock} units
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{p.sellerName || 'Appario Retail'}</td>
                      <td className="p-3 font-bold text-emerald-400">{p.commissionRate || 10}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AI RADAR & ANOMALY ALERTS (PRD 5.20) */}
        {activeTab === 'anomalies' && (
          <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <Sparkles className="text-amber-400" size={20} />
                  AI Dashboard Insights &amp; Anomaly Radar
                </h3>
                <p className="text-xs text-slate-400">
                  PRD 5.20: Automated pattern analysis detecting sudden RTO spikes, courier delays, and NDR issues.
                </p>
              </div>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                Autonomous Radar Active
              </span>
            </div>

            <div className="space-y-3">
              {anomalies.map((ano) => (
                <div
                  key={ano.id}
                  className="bg-[#0b1120] border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ano.severity === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {ano.severity} ALERT
                      </span>
                      <span className="font-bold text-white text-sm">{ano.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{ano.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ano.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: COMMISSION CONFIG (PRD 5.7) */}
        {activeTab === 'commission' && (
          <div className="bg-[#111c33] border border-slate-800 rounded-3xl p-6 max-w-2xl space-y-5">
            <div className="pb-3 border-b border-slate-800">
              <h3 className="font-heading font-bold text-white text-base">
                Commission &amp; Settlement Rules Engine
              </h3>
              <p className="text-xs text-slate-400">
                PRD Section 5.7: Admin configures marketplace commission by category with auto-split at settlement.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {Object.entries(commissions).map(([cat, rate]) => (
                <div
                  key={cat}
                  className="bg-[#0b1120] p-4 rounded-xl flex items-center justify-between border border-slate-800"
                >
                  <div>
                    <div className="font-bold text-white text-sm">{cat}</div>
                    <div className="text-[11px] text-slate-400">Automated deduction on order payout</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black font-heading text-emerald-400">{rate}%</span>
                    <span className="text-slate-400 text-[11px]">per sale</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
