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
  ChevronDown,
  ChevronRight,
  Code2,
  MapPin,
  Settings,
  ShoppingBag,
  Tag,
  Image as ImageIcon,
  ShoppingCart
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import type { RootState, AppDispatch } from '../store/store';
import { login, switchDemoRole, logout } from '../slices/authSlice';
import axios from 'axios';


const salesData = [
  { name: 'Mon', gmv: 84000 }, { name: 'Tue', gmv: 92000 }, { name: 'Wed', gmv: 110000 },
  { name: 'Thu', gmv: 104000 }, { name: 'Fri', gmv: 145000 }, { name: 'Sat', gmv: 182000 }, { name: 'Sun', gmv: 210000 },
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
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await dispatch(login({ email: adminEmail, password: adminPass })).unwrap();
    } catch (err: any) {
      setAuthError(err || 'Authentication failed. Please check credentials.');
    }
  };

  // --- E-Commerce Product State ---
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: '',
    price: '',
    mrp: '',
    countInStock: '',
    description: '',
    brand: '',
    image: '',
  });
  const [imageUploadType, setImageUploadType] = useState<'url' | 'file'>('url');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (activeTab === 'marketplace-catalog') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      };
      
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        mrp: Number(productForm.mrp),
        countInStock: Number(productForm.countInStock)
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, payload, config);
      } else {
        await axios.post('/api/products', payload, config);
      }
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product', error);
      alert('Error saving product. Check console.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo?.token}` }
      };
      await axios.delete(`/api/products/${id}`, config);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setProductForm({ name: '', category: '', price: '', mrp: '', countInStock: '', description: '', brand: '', image: '' });
    setImageUploadType('url');
    setIsProductModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      category: p.category,
      price: p.price,
      mrp: p.mrp || p.price,
      countInStock: p.countInStock,
      description: p.description,
      brand: p.brand,
      image: p.image,
    });
    setImageUploadType(p.image.startsWith('http') || p.image.startsWith('/') ? 'url' : 'file'); // Best guess
    setIsProductModalOpen(true);
  };

  const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const { data } = await axios.post('/api/upload', formData, config);
      setProductForm({ ...productForm, image: data.imagePath || data });
    } catch (error) {
      console.error(error);
      alert('Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };
  // --------------------------------


  const isSuperAdmin = userInfo?.isAdmin || userInfo?.role === 'super_admin';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'marketplace', label: 'E-Commerce Suite', icon: ShoppingCart, subItems: [
        { id: 'catalog', label: 'Catalog & Products' },
        { id: 'offers', label: 'Offers & Marketing' },
        { id: 'siteui', label: 'Site UI & Images' },
        { id: 'orders', label: 'Marketplace Orders' }
    ]},
    { id: 'sellers', label: 'Seller Management', icon: StoreIcon, subItems: [
        { id: 'kyc', label: 'Registration/KYC' },
        { id: 'import', label: 'Order Import' },
        { id: 'catalog', label: 'Catalog & Inventory' }
    ]},
    { id: 'customers', label: 'Customer Management', icon: Users, subItems: [
        { id: 'list', label: 'Customer Directory' },
        { id: 'tracking', label: 'Customer Tracking Page' },
        { id: 'notifications', label: 'SMS/WhatsApp Config' }
    ]},
    { id: 'riders', label: 'Rider Management', icon: Bike, subItems: [
        { id: 'live', label: 'GPS Live Location' },
        { id: 'assign', label: 'Pickup/Delivery Assignment' },
        { id: 'proof', label: 'Delivery Proof (OTP/Video)' },
        { id: 'earnings', label: 'Rider Earnings & Cash' }
    ]},
    { id: 'couriers', label: 'Courier Partners', icon: Truck, subItems: [
        { id: 'rates', label: 'Courier Rate Engine' },
        { id: 'calc', label: 'Weight/Pincode/Zone Rates' },
        { id: 'compare', label: 'Multi-Courier Comparison' },
        { id: 'slas', label: 'Cheapest/Fastest Selection' }
    ]},
    { id: 'warehouse', label: 'Warehouse & WMS', icon: Building2, subItems: [
        { id: 'inward', label: 'Inward & Outward' },
        { id: 'inventory', label: 'SKU, Barcode & Bin Mapping' },
        { id: 'pickpack', label: 'Pick, Pack & Dispatch' },
        { id: 'transfer', label: 'Warehouse Transfers' }
    ]},
    { id: 'bookings', label: 'Booking & Tracking', icon: PackageCheck, subItems: [
        { id: 'requests', label: 'Pickup Requests' },
        { id: 'tracking', label: 'AWB & Live Tracking' },
        { id: 'ndr', label: 'NDR & Re-attempt Mgmt' },
        { id: 'rto', label: 'RTO & Return Tracking' }
    ]},
    { id: 'payments', label: 'Payment & COD', icon: Wallet, subItems: [
        { id: 'cod', label: 'COD Collection & Recon' },
        { id: 'settlement', label: 'Seller Settlements' },
        { id: 'history', label: 'Payment History & Reports' }
    ]},
    { id: 'api', label: 'API & Integrations', icon: Code2, subItems: [
        { id: 'core', label: 'Order/Rate/Shipment APIs' },
        { id: 'tracking', label: 'AWB & Tracking API' },
        { id: 'webhooks', label: 'Developer Webhooks' },
        { id: 'plugins', label: 'Shopify/WooCommerce' }
    ]},
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart4 },
  ];

  const toggleMenu = (menuId: string) => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

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
          {authError && <div className="mb-6 bg-red-500/10 text-red-400 p-3 rounded-xl text-sm text-center border border-red-500/20">{authError}</div>}
          <form onSubmit={handleAdminSignIn} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm text-white focus:outline-none focus:border-red-500/50" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-slate-500"><Eye size={18} /></button>
              </div>
            </div>
            <button type="submit" disabled={authLoading} className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]">
              {authLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button onClick={() => dispatch(switchDemoRole('super_admin'))} className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center justify-center gap-2 w-full"><Sparkles size={14} className="text-amber-500" /> Bypass with Demo</button>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Network GMV', value: '₹14,50,000', icon: LayoutDashboard, color: 'blue' },
              { label: 'Active Cargo Bookings', value: '1,240', icon: PackageCheck, color: 'emerald' },
              { label: 'Registered Sellers', value: '342', icon: StoreIcon, color: 'amber' },
              { label: 'Active Riders', value: '89', icon: Bike, color: 'rose' },
            ].map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${m.color}-500/10 flex items-center justify-center text-${m.color}-400 mb-4`}><m.icon size={18} /></div>
                <h4 className="text-3xl font-black text-white tracking-tight mb-1">{m.value}</h4>
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-72">
             <h3 className="font-bold text-white mb-4">Network Growth</h3>
             <ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData} margin={{top:0,right:0,left:-20,bottom:20}}><defs><linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.5}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false}/><YAxis stroke="#64748B" axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'none',borderRadius:'8px',color:'#fff'}}/><Area type="monotone" dataKey="gmv" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#gmv)" /></AreaChart></ResponsiveContainer>
          </div>
        </div>
      );
    }
    
    if (activeTab === 'riders-live') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col items-center justify-center text-center">
          <MapPin size={64} className="text-amber-500 animate-bounce mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">GPS Live Location Tracker</h2>
          <p className="text-slate-400 max-w-md">Real-time telemetry showing active riders, their routes, and current ETA drops. Waiting for mobile app location socket API.</p>
        </div>
      );
    }

    if (activeTab === 'couriers-rates') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full">
          <h2 className="text-2xl font-bold text-white mb-6">Courier Rate Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-4">
              <h3 className="font-bold text-slate-300">Weight & Pincode Matrix</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-slate-400">0-500g (Metro)</span><span className="text-white font-bold">₹40.00</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-slate-400">500g-1kg (Metro)</span><span className="text-white font-bold">₹65.00</span></div>
                <div className="flex justify-between border-b border-white/10 pb-2"><span className="text-slate-400">0-500g (Rest of India)</span><span className="text-white font-bold">₹60.00</span></div>
                <div className="flex justify-between pt-2"><span className="text-slate-400">COD Surcharge</span><span className="text-emerald-400 font-bold">₹25 or 1.5%</span></div>
              </div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center">
              <Settings size={32} className="text-blue-500 animate-spin-slow mb-4" />
              <h3 className="font-bold text-white mb-2">Automated Selection Algorithm</h3>
              <p className="text-slate-400 text-xs">Engine is configured to automatically select the Cheapest vs Fastest courier based on seller preference.</p>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'api-core') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Code2 className="text-emerald-400" /> Developer APIs</h2>
          <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-x-auto border border-emerald-500/20">
            <div className="text-slate-500 mb-2">// Generate AWB & Create Shipment</div>
            <div>POST https://api.onestall.com/v1/shipments/create</div>
            <div className="mt-4 text-slate-500 mb-2">// Webhook Response</div>
            <div className="text-blue-300">
              {`{
  "status": "success",
  "awb_number": "OS-18294719",
  "courier_partner": "Delhivery Surface",
  "routing_code": "DEL-BOM-01"
}`}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'bookings-ndr') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">Customer Action Requests (NDR)</h2>
              <p className="text-xs text-slate-400 mt-1">Manage address corrections, reschedule requests, and cancellations raised by customers.</p>
            </div>
            <div className="flex gap-2">
               <span className="bg-rose-500/20 text-rose-400 px-3 py-1 rounded-full text-xs font-bold">12 Action Required</span>
            </div>
          </div>
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 uppercase text-[10px] tracking-widest border-b border-white/10">
                <tr><th className="pb-4">AWB / Customer</th><th className="pb-4">Issue Type</th><th className="pb-4">Customer Request Details</th><th className="pb-4">Status</th><th className="pb-4 text-right">Admin Action</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { awb: 'OS-882910412', name: 'Priya Verma', type: 'ADDRESS_CORRECTION', details: 'Added missing landmark: Near Blue Bell School.', status: 'PENDING' },
                  { awb: 'OS-719382014', name: 'Rahul Gupta', type: 'RESCHEDULE', details: 'Deliver on Monday instead of today.', status: 'PENDING' },
                  { awb: 'OS-551029381', name: 'Sneha Patel', type: 'CANCEL_RETURN', details: 'Not required anymore, please RTO.', status: 'PENDING' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4">
                      <div className="font-mono text-white text-xs font-bold">{item.awb}</div>
                      <div className="text-slate-400 text-[11px]">{item.name}</div>
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        item.type === 'ADDRESS_CORRECTION' ? 'bg-blue-500/20 text-blue-400' : 
                        item.type === 'RESCHEDULE' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {item.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 text-slate-300 text-xs">{item.details}</td>
                    <td className="py-4"><span className="text-amber-400 text-xs font-bold">Requires Approval</span></td>
                    <td className="py-4 text-right flex justify-end gap-2">
                      <button className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Approve</button>
                      <button className="bg-white/5 text-slate-300 hover:bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'customers-tracking') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Search size={20} className="text-blue-400" /> Admin Master Tracking Console</h2>
          
          <div className="flex gap-3 mb-6">
            <input type="text" placeholder="Enter AWB (e.g. OS-882910412)" className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500" />
            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30">
              <Search size={16} /> Track Globally
            </button>
          </div>

          <div className="flex-1 bg-black/20 rounded-2xl border border-white/5 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-mono font-bold text-white">OS-882910412</h3>
                <p className="text-xs text-slate-400 mt-1">Customer Tracking View vs Internal View</p>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">OUT FOR DELIVERY</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-300 border-b border-white/10 pb-2">Customer Facing Data</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="text-white">Out for Delivery</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">ETA</span><span className="text-white">Today, 9 PM</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Assigned Rider</span><span className="text-white">Rahul Sharma</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-rose-400 border-b border-white/10 pb-2">Internal Hidden Data (Admin Only)</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Actual Courier Cost</span><span className="text-rose-400 font-bold">₹42.50</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Vendor Billed</span><span className="text-white">₹65.00</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Delivery Boy App Status</span><span className="text-amber-400">Offline since 20 mins</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Rider Real-Time GPS</span><span className="text-blue-400 underline cursor-pointer">Lat: 28.61, Lng: 77.20</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'marketplace-catalog') {
      const activeCategories = Array.from(new Set(products.map(p => p.category))).length;
      const outOfStock = products.filter(p => p.countInStock === 0).length;

      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col relative">
          
          {/* PRODUCT MODAL OVERLAY */}
          {isProductModalOpen && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 rounded-3xl flex items-center justify-center p-4">
              <div className="bg-[#111827] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-full overflow-hidden">
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
                  <h3 className="text-xl font-bold text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleProductSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Product Name</label>
                      <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Category</label>
                      <input type="text" required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" placeholder="e.g. Fashion, Electronics" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Selling Price (₹)</label>
                      <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">MRP (₹)</label>
                      <input type="number" required value={productForm.mrp} onChange={e => setProductForm({...productForm, mrp: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Stock Count</label>
                      <input type="number" required value={productForm.countInStock} onChange={e => setProductForm({...productForm, countInStock: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1">Brand</label>
                      <input type="text" required value={productForm.brand} onChange={e => setProductForm({...productForm, brand: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                    </div>
                  </div>
                  
                  {/* Image Upload Block */}
                  <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                    <label className="block text-xs font-bold text-slate-400 mb-3">Product Image</label>
                    <div className="flex gap-4 mb-3">
                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input type="radio" checked={imageUploadType === 'url'} onChange={() => setImageUploadType('url')} name="imgType" className="accent-cyan-500" /> Use Image URL
                      </label>
                      <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                        <input type="radio" checked={imageUploadType === 'file'} onChange={() => setImageUploadType('file')} name="imgType" className="accent-cyan-500" /> Upload File
                      </label>
                    </div>

                    {imageUploadType === 'url' ? (
                      <input type="text" placeholder="https://..." value={productForm.image} onChange={e => setProductForm({...productForm, image: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                    ) : (
                      <div className="relative">
                         <input type="file" onChange={uploadFileHandler} className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30 transition-colors" />
                         {uploadingImage && <span className="absolute right-4 top-2 text-xs text-cyan-400 font-bold animate-pulse">Uploading...</span>}
                         {productForm.image && imageUploadType === 'file' && <p className="text-xs text-emerald-400 mt-2 truncate">Current File: {productForm.image}</p>}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Description</label>
                    <textarea rows={3} required value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500" />
                  </div>

                  <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 hover:bg-white/10 transition-colors">Cancel</button>
                    <button type="submit" disabled={uploadingImage} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors disabled:opacity-50">
                      {editingProduct ? 'Update Product' : 'Save Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* END MODAL */}

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><ShoppingBag className="text-cyan-400" /> Catalog & Products</h2>
            <button onClick={openAddModal} className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2 rounded-xl transition-all text-sm shadow-lg shadow-cyan-600/20">+ Add New Product</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400">Total Products</p>
              <p className="text-2xl font-bold text-white">{products.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400">Active Categories</p>
              <p className="text-2xl font-bold text-white">{activeCategories}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <p className="text-xs text-slate-400">Out of Stock</p>
              <p className="text-2xl font-bold text-rose-400">{outOfStock}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-center">
              <button className="text-cyan-400 hover:text-cyan-300 text-sm font-bold flex items-center gap-1"><Settings size={16}/> Manage Categories</button>
            </div>
          </div>

          <div className="flex-1 overflow-auto no-scrollbar bg-black/20 rounded-xl border border-white/5 p-4">
            {loadingProducts ? (
              <div className="flex justify-center items-center h-full text-cyan-400">Loading products...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="text-slate-400 border-b border-white/10">
                  <tr>
                    <th className="pb-3 font-medium">Product Details</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.length === 0 ? (
                    <tr><td colSpan={5} className="py-8 text-center text-slate-500">No products found. Click "Add New Product" to start.</td></tr>
                  ) : (
                    products.map((p) => (
                      <tr key={p._id} className="hover:bg-white/5 transition-colors group">
                        <td className="py-3 flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 bg-white/10 rounded-md object-cover" />
                          <div>
                            <p className="text-white font-bold line-clamp-1">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono">SKU: {p.sku || p._id.substring(0,8)}</p>
                          </div>
                        </td>
                        <td className="py-3 text-slate-300"><span className="bg-white/10 px-2 py-1 rounded text-xs">{p.category}</span></td>
                        <td className="py-3 text-white font-bold">₹{p.price} <span className="text-xs text-slate-500 line-through font-normal ml-1">₹{p.mrp}</span></td>
                        <td className="py-3">
                          {p.countInStock > 0 ? (
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">{p.countInStock} in stock</span>
                          ) : (
                            <span className="bg-rose-500/20 text-rose-400 px-2 py-1 rounded text-xs">Out of Stock</span>
                          )}
                        </td>
                        <td className="py-3 text-right space-x-2">
                          <button onClick={() => openEditModal(p)} className="text-cyan-400 hover:text-cyan-300 text-xs font-bold px-2 py-1 border border-cyan-500/30 rounded bg-cyan-500/10">Edit</button>
                          <button onClick={() => handleDeleteProduct(p._id)} className="text-rose-400 hover:text-rose-300 text-xs font-bold px-2 py-1 border border-rose-500/30 rounded bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity">Del</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === 'marketplace-offers') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Tag className="text-indigo-400" /> Offers & Marketing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Active Promo Codes</h3>
                <button className="text-indigo-400 text-xs font-bold">+ Create Code</button>
              </div>
              <div className="space-y-3">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="font-mono text-indigo-400 font-bold text-lg">DIWALI50</p>
                    <p className="text-xs text-slate-400">Flat 50% Off up to ₹500</p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">Active</span>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex justify-between items-center">
                  <div>
                    <p className="font-mono text-indigo-400 font-bold text-lg">FREESHIP</p>
                    <p className="text-xs text-slate-400">Free Shipping on orders &gt; ₹999</p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">Active</span>
                </div>
              </div>
            </div>
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4">Flash Sales & Deals</h3>
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-6 rounded-xl border border-indigo-500/30 text-center space-y-4">
                <Tag size={48} className="mx-auto text-indigo-400" />
                <div>
                  <p className="font-bold text-white text-lg">Weekend Mega Sale</p>
                  <p className="text-xs text-slate-300">Starts in 2 days. 45 products enrolled.</p>
                </div>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2 rounded-xl text-sm transition-all">Manage Sale Items</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'marketplace-siteui') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ImageIcon className="text-fuchsia-400" /> Site UI & Image Banners</h2>
          <div className="flex-1 overflow-auto no-scrollbar space-y-6">
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4">Homepage Sliders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="aspect-video bg-white/5 border-2 border-dashed border-white/20 rounded-xl flex items-center justify-center group hover:border-fuchsia-400 transition-colors cursor-pointer">
                  <div className="text-center">
                    <ImageIcon size={32} className="mx-auto text-slate-500 group-hover:text-fuchsia-400 mb-2 transition-colors" />
                    <p className="text-sm font-bold text-slate-400 group-hover:text-fuchsia-300">Upload Banner 1</p>
                  </div>
                </div>
                <div className="aspect-video bg-white/10 border border-white/20 rounded-xl flex items-end p-4 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=600')] bg-cover bg-center">
                   <button className="bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/20 hover:bg-black/80">Change Image</button>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold text-white mb-4">Promotional Blocks</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center space-y-2">
                  <div className="h-24 bg-white/10 rounded-lg"></div>
                  <p className="text-xs text-slate-400">Left Promo Block</p>
                  <button className="text-fuchsia-400 text-xs font-bold">Edit</button>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center space-y-2">
                  <div className="h-24 bg-white/10 rounded-lg"></div>
                  <p className="text-xs text-slate-400">Center Promo Block</p>
                  <button className="text-fuchsia-400 text-xs font-bold">Edit</button>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center space-y-2">
                  <div className="h-24 bg-white/10 rounded-lg"></div>
                  <p className="text-xs text-slate-400">Right Promo Block</p>
                  <button className="text-fuchsia-400 text-xs font-bold">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Generic Placeholder for other 45+ sub-tabs
    const [mainPart, subPart] = activeTab.split('-');
    const currentItem = menuItems.find(m => m.id === mainPart);
    const subItem = currentItem?.subItems?.find(s => s.id === subPart);
    const title = subItem ? subItem.label : currentItem?.label;

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
        {currentItem?.icon && <currentItem.icon size={64} className="text-blue-500 opacity-50 mb-6" />}
        <h3 className="text-2xl font-bold text-white mb-2">{title} Module</h3>
        <p className="text-slate-400 text-sm max-w-md">This advanced PRD module structure has been created. The nested UI flow is ready to be connected to the backend database endpoints.</p>
        <button className="mt-6 bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2 rounded-xl text-sm font-medium transition-colors">Configure Settings</button>
      </div>
    );
  };

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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white"><ShieldAlert size={16} /></div>
              <span className="font-black text-lg tracking-tight text-white">OneStall</span>
            </motion.div>
          )}
          {!isSidebarOpen && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white mx-auto"><ShieldAlert size={16} /></div>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-6 w-8 h-8 bg-[#111] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white cursor-pointer z-50">
             {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 no-scrollbar">
          {menuItems.map((item) => {
            const hasSub = item.subItems && item.subItems.length > 0;
            const isExpanded = expandedMenus[item.id];
            const isActive = activeTab === item.id || activeTab.startsWith(item.id + '-');
            
            return (
              <div key={item.id} className="flex flex-col">
                <button
                  onClick={() => hasSub ? toggleMenu(item.id) : setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive && !hasSub ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className={`${isActive ? 'text-blue-400' : ''}`} />
                  {isSidebarOpen && <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>}
                  {isSidebarOpen && hasSub && (
                    <ChevronDown size={14} className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180 text-blue-400' : ''}`} />
                  )}
                  {isActive && !hasSub && <motion.div layoutId="activeNav" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />}
                </button>
                
                {/* SUB ITEMS ACCORDION */}
                <AnimatePresence>
                  {isSidebarOpen && hasSub && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden ml-9 border-l border-white/10 mt-1 space-y-1"
                    >
                      {item.subItems.map(sub => {
                        const subId = `${item.id}-${sub.id}`;
                        const isSubActive = activeTab === subId;
                        return (
                          <button
                            key={subId}
                            onClick={() => setActiveTab(subId)}
                            className={`w-full text-left pl-4 pr-3 py-2 text-xs font-medium rounded-r-xl transition-all relative ${
                              isSubActive ? 'text-white bg-blue-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                          >
                            {isSubActive && <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-blue-500" />}
                            {sub.label}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#07090E] to-[#0A0F1A]">
        <header className="h-20 px-8 flex items-center justify-between bg-white/[0.01] border-b border-white/5 backdrop-blur-md flex-shrink-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Operations</h1>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-sm font-bold text-white">{userInfo?.name || 'Super Admin'}</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-[#07090E] shadow-lg">SA</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 no-scrollbar relative">
           <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="max-w-7xl mx-auto h-full">
               {renderTabContent()}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
