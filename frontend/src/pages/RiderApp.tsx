import React, { useState, useRef, useEffect } from 'react';
import {
  Bike,
  Navigation,
  Phone,
  CheckCircle2,
  ShieldCheck,
  Wallet,
  Clock,
  MapPin,
  Camera,
  RotateCcw,
  Check,
  ListTodo,
  Map as MapIcon,
  AlertOctagon,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RiderApp: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [isDelivered, setIsDelivered] = useState(false);

  // Digital POD state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [podSubmitting, setPodSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (activeTab === 'pod') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.strokeStyle = '#F59E0B'; // Amber-500
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
        }
      }
    }
  }, [activeTab]);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleSubmitPod = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp !== '7492') {
      alert('Invalid OTP. Use demo OTP 7492');
      return;
    }
    setPodSubmitting(true);
    setTimeout(() => {
      setPodSubmitting(false);
      setIsDelivered(true);
    }, 1500);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-4 pb-24">
            <h2 className="text-xl font-bold text-white mb-4">Today's Assignments</h2>
            {[
              { id: 'OS-882910412', type: 'DELIVERY', name: 'Priya Verma', address: 'Flat 402, Lotus Boulevard, Sector 100, New Delhi', cod: 2499, status: 'PENDING' },
              { id: 'OS-882910413', type: 'PICKUP', name: 'Apex Retailers', address: 'Shop 12, Main Market, Lajpat Nagar', cod: 0, status: 'COMPLETED' }
            ].map((task, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-5 space-y-3 relative overflow-hidden">
                {task.status === 'COMPLETED' && <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-emerald-400 font-bold"><CheckCircle2 size={32} className="mb-2" /> TASK COMPLETED</div>}
                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${task.type === 'DELIVERY' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{task.type}</span>
                  <span className="text-[10px] font-mono text-slate-400">{task.id}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{task.name}</h3>
                  <div className="flex items-start gap-2 text-slate-300 text-xs mt-1">
                    <MapPin size={14} className="text-amber-400 flex-shrink-0 mt-0.5" />
                    <p>{task.address}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"><Navigation size={14} /> Navigate</button>
                  <button onClick={() => setActiveTab('pod')} className="flex-1 bg-white/10 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1"><ShieldCheck size={14} /> Verify POD</button>
                </div>
              </div>
            ))}
          </div>
        );
      case 'map':
        return (
          <div className="h-full pb-24 flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Live GPS Navigation</h2>
            <div className="flex-1 bg-slate-900 border border-white/10 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#F59E0B 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               <Navigation size={48} className="text-amber-500 mb-4 animate-pulse relative z-10" />
               <p className="text-amber-400 font-bold relative z-10">Tracking Active Route...</p>
               <p className="text-slate-400 text-xs mt-2 relative z-10 max-w-xs text-center">Google Maps / Mapbox integration placeholder for live turn-by-turn routing.</p>
            </div>
          </div>
        );
      case 'pod':
        if (isDelivered) {
          return (
            <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-3xl p-6 text-center space-y-3 mt-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="font-black text-white text-2xl">Delivery Successful!</h3>
              <p className="text-xs text-emerald-300">Digital POD verified with OTP and signature. COD ₹2,499 collected.</p>
              <button onClick={() => {setIsDelivered(false); setActiveTab('tasks');}} className="mt-4 w-full bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm">Back to Tasks</button>
            </div>
          );
        }
        return (
          <form onSubmit={handleSubmitPod} className="space-y-4 pb-24">
            <h2 className="text-xl font-bold text-white mb-2">Digital POD</h2>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-bold flex justify-between mb-2"><span>Enter Delivery OTP</span><span className="text-amber-400">Demo: 7492</span></label>
                <input type="text" maxLength={4} value={enteredOtp} onChange={(e) => setEnteredOtp(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-widest text-white focus:outline-none focus:border-amber-500" required />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold mb-2"><span>Customer Signature</span><button type="button" onClick={clearSignature} className="text-amber-400 flex items-center gap-1"><RotateCcw size={12} /> Clear</button></div>
                <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40 touch-none">
                  <canvas ref={canvasRef} width={360} height={120} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full cursor-crosshair" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="bg-white/5 border border-white/10 py-3 rounded-xl flex flex-col items-center gap-1 text-slate-300 text-xs"><Camera size={20} className="text-amber-400"/> Take Photo Proof</button>
                <button type="button" className="bg-white/5 border border-white/10 py-3 rounded-xl flex flex-col items-center gap-1 text-slate-300 text-xs"><ImageIcon size={20} className="text-amber-400"/> Upload from Gallery</button>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3">
                <input type="checkbox" id="codCheck" defaultChecked required className="w-5 h-5 rounded text-amber-500 accent-amber-500" />
                <label htmlFor="codCheck" className="text-xs text-amber-200">I confirm I have collected <strong>₹2,499</strong> in COD cash.</label>
              </div>

              <button type="submit" disabled={podSubmitting} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2">
                {podSubmitting ? <Clock className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                <span>Verify & Complete Delivery</span>
              </button>
            </div>
          </form>
        );
      case 'wallet':
        return (
          <div className="space-y-4 pb-24">
            <h2 className="text-xl font-bold text-white mb-4">Earnings & COD Wallet</h2>
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-slate-950 shadow-lg shadow-amber-500/20">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2"><Wallet size={16} /> Total Earnings (Week)</div>
              <h3 className="text-4xl font-black mb-4">₹4,250</h3>
              <div className="bg-white/20 rounded-xl p-3 flex justify-between text-sm font-bold"><span>Pending Payout</span><span>₹1,200</span></div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><CheckCircle2 className="text-emerald-400" size={16}/> COD Cash to Deposit</h4>
              <p className="text-3xl font-black text-white">₹12,499</p>
              <p className="text-xs text-slate-400">Please deposit this cash at the Hub manager desk by end of day.</p>
              <button className="w-full mt-2 bg-white/10 border border-white/20 py-2.5 rounded-xl text-sm font-bold text-white">View Collection History</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans flex justify-center">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md h-screen relative flex flex-col bg-gradient-to-b from-[#0A0F1A] to-[#050505] shadow-2xl overflow-hidden border-x border-white/5">
        
        {/* Top App Bar */}
        <div className="h-16 px-4 flex items-center justify-between bg-white/[0.02] border-b border-white/10 backdrop-blur-xl flex-shrink-0 z-20 relative">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white"><Bike size={18} /></div>
            <div>
              <h1 className="font-bold text-white text-sm leading-tight">Rahul Sharma</h1>
              <span className="text-[10px] text-amber-400 font-mono">ID: OS-R-492</span>
            </div>
          </div>
          <button onClick={() => setIsOnline(!isOnline)} className={`px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 relative z-10 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 z-30 flex items-center justify-around px-2 pb-2">
          {[
            { id: 'tasks', label: 'Tasks', icon: ListTodo },
            { id: 'map', label: 'Map', icon: MapIcon },
            { id: 'pod', label: 'POD', icon: ShieldCheck },
            { id: 'wallet', label: 'Wallet', icon: Wallet },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all relative ${isActive ? 'text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}>
                {isActive && <motion.div layoutId="navIndicator" className="absolute -top-3 w-10 h-1 bg-amber-500 rounded-b-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                <tab.icon size={22} className={`mb-1 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] font-bold">{tab.label}</span>
              </button>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

export default RiderApp;
