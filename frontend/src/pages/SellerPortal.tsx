import React, { useState } from 'react';
import {
  Store,
  Package,
  FileText,
  Calculator,
  UploadCloud,
  FileCheck,
  CreditCard,
  ShieldAlert,
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MapPin,
  CheckCircle2,
  Printer,
  Download
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const salesData = [
  { name: 'Mon', sales: 12000 }, { name: 'Tue', sales: 15000 }, { name: 'Wed', sales: 22000 },
  { name: 'Thu', sales: 18000 }, { name: 'Fri', sales: 25000 }, { name: 'Sat', sales: 32000 }, { name: 'Sun', sales: 28000 },
];

const SellerPortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Order Management', icon: Package, subItems: [
        { id: 'import', label: 'Bulk Order Import' },
        { id: 'awb', label: 'AWB Generation' },
        { id: 'labels', label: 'Print Shipping Labels' }
    ]},
    { id: 'booking', label: 'Shipment Booking', icon: FileCheck },
    { id: 'rates', label: 'Rate Calculator', icon: Calculator },
    { id: 'billing', label: 'Billing & Invoice', icon: CreditCard, subItems: [
        { id: 'invoices', label: 'Tax Invoices' },
        { id: 'cod', label: 'COD Settlements' }
    ]},
    { id: 'kyc', label: 'Registration/KYC', icon: ShieldAlert },
  ];

  const toggleMenu = (menuId: string) => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Sales (7d)', value: '₹1,52,000', icon: CreditCard, color: 'emerald' },
              { label: 'Pending Shipments', value: '45', icon: Package, color: 'amber' },
              { label: 'Delivered (7d)', value: '182', icon: CheckCircle2, color: 'blue' },
              { label: 'RTO Returns', value: '3', icon: FileText, color: 'rose' },
            ].map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${m.color}-500/10 flex items-center justify-center text-${m.color}-400 mb-4`}><m.icon size={18} /></div>
                <h4 className="text-3xl font-black text-white tracking-tight mb-1">{m.value}</h4>
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-72">
             <h3 className="font-bold text-white mb-4">Sales Performance</h3>
             <ResponsiveContainer width="100%" height="100%"><AreaChart data={salesData} margin={{top:0,right:0,left:-20,bottom:20}}><defs><linearGradient id="sales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.5}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false}/><YAxis stroke="#64748B" axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'none',borderRadius:'8px',color:'#fff'}}/><Area type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#sales)" /></AreaChart></ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (activeTab === 'orders-import') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-6 border-2 border-dashed border-blue-500/30">
            <UploadCloud size={40} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Bulk Order Import</h2>
          <p className="text-slate-400 max-w-md mb-8">Drag and drop your Excel or CSV file containing order details to automatically generate AWBs.</p>
          <div className="flex gap-4">
             <button className="bg-white/10 hover:bg-white/20 border border-white/10 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors text-white">Download Template</button>
             <button className="bg-blue-600 hover:bg-blue-500 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors text-white">Select File</button>
          </div>
        </div>
      );
    }

    if (activeTab === 'orders-awb') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">AWB Generation</h2>
            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-xs font-bold text-white">Generate All Pendings</button>
          </div>
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 uppercase text-[10px] tracking-widest border-b border-white/10">
                <tr><th className="pb-4">Order ID</th><th className="pb-4">Customer</th><th className="pb-4">Destination</th><th className="pb-4">AWB Status</th><th className="pb-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1,2,3,4].map((i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 font-mono text-white text-xs">#ORD-99{i}2</td>
                    <td className="py-4 text-slate-300">Rahul Sharma</td>
                    <td className="py-4 text-slate-400">Delhi, 110020</td>
                    <td className="py-4"><span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-[10px] font-bold">Pending AWB</span></td>
                    <td className="py-4"><button className="text-blue-400 text-xs hover:text-blue-300 font-bold">Generate AWB</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'rates') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-2xl mx-auto mt-10">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Calculator className="text-emerald-400" /> Rate Calculator</h2>
          <div className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Pickup Pincode</label>
                 <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" placeholder="110020" />
               </div>
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Delivery Pincode</label>
                 <input type="text" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" placeholder="400001" />
               </div>
             </div>
             <div>
               <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Weight (KG)</label>
               <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none" placeholder="1.5" />
             </div>
             <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all mt-4">
               Calculate Lowest Shipping Rate
             </button>
          </div>
        </div>
      );
    }

    if (activeTab === 'kyc') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col items-center justify-center text-center">
           <ShieldAlert size={64} className="text-emerald-500 mb-6" />
           <h2 className="text-2xl font-bold text-white mb-2">KYC Verified</h2>
           <p className="text-slate-400 max-w-md">Your seller account (GSTIN: 07AAAAA0000A1Z5) is fully verified. You have access to all logistics tools.</p>
        </div>
      );
    }

    // Generic Placeholder
    const [mainPart, subPart] = activeTab.split('-');
    const currentItem = menuItems.find(m => m.id === mainPart);
    const subItem = currentItem?.subItems?.find(s => s.id === subPart);
    const title = subItem ? subItem.label : currentItem?.label;

    return (
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center">
        {currentItem?.icon && <currentItem.icon size={64} className="text-blue-500 opacity-50 mb-6" />}
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm max-w-md">This seller tool is currently being developed. The UI framework is ready for backend integration.</p>
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white"><Store size={16} /></div>
              <span className="font-black text-lg tracking-tight text-white">SellerPanel</span>
            </motion.div>
          )}
          {!isSidebarOpen && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mx-auto"><Store size={16} /></div>}
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
                  <item.icon size={18} className={`${isActive ? 'text-emerald-400' : ''}`} />
                  {isSidebarOpen && <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>}
                  {isSidebarOpen && hasSub && (
                    <ChevronDown size={14} className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180 text-emerald-400' : ''}`} />
                  )}
                  {isActive && !hasSub && <motion.div layoutId="activeNavSeller" className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" />}
                </button>
                
                <AnimatePresence>
                  {isSidebarOpen && hasSub && isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-9 border-l border-white/10 mt-1 space-y-1">
                      {item.subItems.map(sub => {
                        const subId = `${item.id}-${sub.id}`;
                        const isSubActive = activeTab === subId;
                        return (
                          <button key={subId} onClick={() => setActiveTab(subId)} className={`w-full text-left pl-4 pr-3 py-2 text-xs font-medium rounded-r-xl transition-all relative ${isSubActive ? 'text-white bg-emerald-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                            {isSubActive && <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-emerald-500" />}
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
        <div className="p-4 border-t border-white/5">
           <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all text-sm font-medium border border-transparent">
             <LogOut size={18} />
             {isSidebarOpen && <span>Back to Home</span>}
           </button>
        </div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#07090E] to-[#0A0F1A]">
        <header className="h-20 px-8 flex items-center justify-between bg-white/[0.01] border-b border-white/5 backdrop-blur-md flex-shrink-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-tight">Seller Operations</h1>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-sm font-bold text-emerald-400">KYC Verified Seller</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold border-2 border-[#07090E] shadow-lg">SP</div>
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

export default SellerPortal;
