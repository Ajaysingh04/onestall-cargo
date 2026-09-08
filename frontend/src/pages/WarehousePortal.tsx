import React, { useState } from 'react';
import {
  Building2,
  PackageCheck,
  PackageOpen,
  ScanBarcode,
  Truck,
  ArrowRightLeft,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  LogOut,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  ClipboardList
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const volumeData = [
  { name: '08:00', volume: 120 }, { name: '10:00', volume: 450 }, { name: '12:00', volume: 820 },
  { name: '14:00', volume: 1100 }, { name: '16:00', volume: 950 }, { name: '18:00', volume: 500 }, { name: '20:00', volume: 150 },
];

const WarehousePortal: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  // Scanner State
  const [scanAwb, setScanAwb] = useState('');
  const [scannedList, setScannedList] = useState<string[]>([]);

  const menuItems = [
    { id: 'dashboard', label: 'Hub Dashboard', icon: LayoutDashboard },
    { id: 'inbound', label: 'Inbound Operations', icon: PackageCheck, subItems: [
        { id: 'inward', label: 'Inward Scanning' },
        { id: 'rto', label: 'RTO & Returns Receiving' }
    ]},
    { id: 'inventory', label: 'Inventory & Stock', icon: ScanBarcode, subItems: [
        { id: 'sku', label: 'SKU & Barcode Check' },
        { id: 'bin', label: 'Bin & Location Mapping' }
    ]},
    { id: 'outbound', label: 'Outbound Operations', icon: PackageOpen, subItems: [
        { id: 'pickpack', label: 'Pick & Pack Lists' },
        { id: 'dispatch', label: 'Dispatch & Sorting' }
    ]},
    { id: 'transfers', label: 'Network Transfers', icon: ArrowRightLeft, subItems: [
        { id: 'manifests', label: 'Line-haul Manifests' },
        { id: 'hub', label: 'Hub-to-Hub Transfers' }
    ]},
  ];

  const toggleMenu = (menuId: string) => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const handleAddScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanAwb.trim()) return;
    setScannedList([{ id: scanAwb.toUpperCase(), time: new Date().toLocaleTimeString() }, ...scannedList] as any);
    setScanAwb('');
  };

  const renderTabContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Inward (Today)', value: '4,250', icon: PackageCheck, color: 'purple' },
              { label: 'Pending Outward', value: '1,840', icon: PackageOpen, color: 'amber' },
              { label: 'Active Line-hauls', value: '12', icon: Truck, color: 'blue' },
              { label: 'RTO Returns', value: '45', icon: AlertTriangle, color: 'rose' },
            ].map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.07] transition-all">
                <div className={`w-10 h-10 rounded-xl bg-${m.color}-500/10 flex items-center justify-center text-${m.color}-400 mb-4`}><m.icon size={18} /></div>
                <h4 className="text-3xl font-black text-white tracking-tight mb-1">{m.value}</h4>
                <p className="text-xs text-slate-400 font-medium">{m.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-72">
             <h3 className="font-bold text-white mb-4">Hub Processing Volume (Hourly)</h3>
             <ResponsiveContainer width="100%" height="100%"><AreaChart data={volumeData} margin={{top:0,right:0,left:-20,bottom:20}}><defs><linearGradient id="vol" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A855F7" stopOpacity={0.5}/><stop offset="95%" stopColor="#A855F7" stopOpacity={0}/></linearGradient></defs><XAxis dataKey="name" stroke="#64748B" axisLine={false} tickLine={false}/><YAxis stroke="#64748B" axisLine={false} tickLine={false}/><Tooltip contentStyle={{backgroundColor:'#0f172a',border:'none',borderRadius:'8px',color:'#fff'}}/><Area type="monotone" dataKey="volume" stroke="#A855F7" strokeWidth={3} fillOpacity={1} fill="url(#vol)" /></AreaChart></ResponsiveContainer>
          </div>
        </div>
      );
    }

    if (activeTab === 'inbound-inward') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col h-[600px]">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><ScanBarcode className="text-purple-400" /> High-Speed Inward Scanner</h2>
             <form onSubmit={handleAddScan} className="space-y-4 mb-8">
               <div>
                 <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Scan Barcode / Enter AWB</label>
                 <input autoFocus type="text" value={scanAwb} onChange={(e) => setScanAwb(e.target.value)} className="w-full bg-black/60 border border-purple-500/50 rounded-xl px-4 py-4 text-2xl font-mono text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-inner" placeholder="OS-..." />
               </div>
               <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all">Record Inward Entry</button>
             </form>
             <div className="flex-1 overflow-auto bg-black/20 rounded-2xl p-4 border border-white/5 space-y-2 no-scrollbar">
                <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 sticky top-0 bg-[#0A0F1A] pb-2 z-10">Recent Scans ({scannedList.length})</h3>
                {scannedList.map((item: any, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 animate-in slide-in-from-top-2">
                    <span className="font-mono text-white font-bold text-sm">{item.id}</span>
                    <span className="text-xs text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12}/> {item.time}</span>
                  </div>
                ))}
                {scannedList.length === 0 && <div className="text-center text-slate-500 text-sm mt-10">Waiting for barcode scan...</div>}
             </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center border-dashed border-2">
             <ClipboardList size={64} className="text-slate-500 mb-6 opacity-50" />
             <h3 className="text-xl font-bold text-white mb-2">Inward Verification</h3>
             <p className="text-slate-400 text-sm max-w-sm">Weight and dimensional checks happen automatically upon barcode scan using the integrated weighing scale API.</p>
          </div>
        </div>
      );
    }

    if (activeTab === 'outbound-pickpack') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Active Pick & Pack Lists</h2>
            <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-xs font-bold text-white">Generate New List</button>
          </div>
          <div className="flex-1 overflow-auto no-scrollbar">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 uppercase text-[10px] tracking-widest border-b border-white/10">
                <tr><th className="pb-4">Pick ID</th><th className="pb-4">Zone / Bin</th><th className="pb-4">SKU Count</th><th className="pb-4">Status</th><th className="pb-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[1,2,3,4].map((i) => (
                  <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                    <td className="py-4 font-mono text-white text-xs">#PICK-10{i}</td>
                    <td className="py-4 text-slate-300 font-bold">Aisle {i} - Rack B</td>
                    <td className="py-4 text-slate-400">24 Items</td>
                    <td className="py-4"><span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-[10px] font-bold">Pending</span></td>
                    <td className="py-4"><button className="text-purple-400 text-xs hover:text-purple-300 font-bold">Assign to Picker</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === 'transfers-manifests') {
      return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Line-Haul Manifests</h2>
          <div className="grid grid-cols-1 gap-4">
             {[
               { id: 'OS-BAG-DEL092', origin: 'Delhi Hub', dest: 'Mumbai Hub', bags: 48, status: 'DISPATCHED' },
               { id: 'OS-BAG-BLR118', origin: 'Delhi Hub', dest: 'BLR Hub', bags: 32, status: 'LOADING' }
             ].map((m, i) => (
               <div key={i} className="bg-black/40 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                 <div>
                   <div className="flex items-center gap-2 mb-1">
                     <span className="font-mono text-purple-400 font-bold">{m.id}</span>
                     <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${m.status === 'LOADING' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{m.status}</span>
                   </div>
                   <div className="text-xs text-white font-bold flex items-center gap-2"><span>{m.origin}</span><ArrowRightLeft size={12} className="text-slate-500"/><span>{m.dest}</span></div>
                 </div>
                 <div className="text-right">
                   <div className="text-white font-bold text-sm">{m.bags} Master Bags</div>
                   <button className="mt-2 bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-colors">View Details</button>
                 </div>
               </div>
             ))}
          </div>
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
        {currentItem?.icon && <currentItem.icon size={64} className="text-purple-500 opacity-50 mb-6" />}
        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm max-w-md">This WMS module is structured and ready for backend API integration.</p>
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
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white"><Building2 size={16} /></div>
              <span className="font-black text-lg tracking-tight text-white">HubManager</span>
            </motion.div>
          )}
          {!isSidebarOpen && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white mx-auto"><Building2 size={16} /></div>}
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
                <button onClick={() => hasSub ? toggleMenu(item.id) : setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${isActive && !hasSub ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <item.icon size={18} className={`${isActive ? 'text-purple-400' : ''}`} />
                  {isSidebarOpen && <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>}
                  {isSidebarOpen && hasSub && <ChevronDown size={14} className={`ml-auto transition-transform duration-300 ${isExpanded ? 'rotate-180 text-purple-400' : ''}`} />}
                  {isActive && !hasSub && <motion.div layoutId="activeNavWMS" className="absolute left-0 w-1 h-6 bg-purple-500 rounded-r-full" />}
                </button>
                <AnimatePresence>
                  {isSidebarOpen && hasSub && isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ml-9 border-l border-white/10 mt-1 space-y-1">
                      {item.subItems.map(sub => {
                        const subId = `${item.id}-${sub.id}`;
                        const isSubActive = activeTab === subId;
                        return (
                          <button key={subId} onClick={() => setActiveTab(subId)} className={`w-full text-left pl-4 pr-3 py-2 text-xs font-medium rounded-r-xl transition-all relative ${isSubActive ? 'text-white bg-purple-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}>
                            {isSubActive && <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-purple-500" />}
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

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#07090E] to-[#0A0F1A]">
        <header className="h-20 px-8 flex items-center justify-between bg-white/[0.01] border-b border-white/5 backdrop-blur-md flex-shrink-0 z-10">
          <h1 className="text-xl font-bold text-white tracking-tight">WMS Operations</h1>
          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end hidden sm:flex">
               <span className="text-sm font-bold text-purple-400">Delhi Central Hub</span>
             </div>
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold border-2 border-[#07090E] shadow-lg">HM</div>
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

export default WarehousePortal;
