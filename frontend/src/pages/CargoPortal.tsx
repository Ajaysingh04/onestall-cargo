import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Truck,
  Package,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  ShieldCheck,
  CalendarDays,
  Map,
  Bell,
  Edit3,
  BadgeCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CargoPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialAwb = searchParams.get('awb') || '';

  const [awbQuery, setAwbQuery] = useState(initialAwb);
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  useEffect(() => {
    if (initialAwb) {
      handleTrack(initialAwb);
    }
  }, [initialAwb]);

  const handleTrack = async (awbToSearch: string) => {
    if (!awbToSearch.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/cargo/track/${awbToSearch.trim()}`);
      setShipmentData(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'AWB not found on OneStall Cargo network.');
      setShipmentData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoTrack = () => {
    setAwbQuery('OS-719382014');
    handleTrack('OS-719382014');
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 font-sans py-8 px-4 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Tracker Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-blue-400 text-sm font-semibold">
            <Truck size={16} />
            <span>OneStall Cargo Tracking</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Track Your Shipment</h1>
          <p className="text-slate-400">Enter your Airway Bill (AWB) number to get live status updates.</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={awbQuery}
              onChange={(e) => setAwbQuery(e.target.value)}
              placeholder="e.g. OS-882910412"
              className="w-full bg-black/60 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-lg text-white font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
            />
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => handleTrack(awbQuery)} disabled={loading} className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2">
              {loading ? <Clock className="animate-spin" size={18} /> : <Search size={18} />}
              <span>Track</span>
            </button>
            <button onClick={handleDemoTrack} className="bg-white/10 hover:bg-white/20 text-slate-300 px-6 py-4 rounded-xl font-bold whitespace-nowrap transition-colors">Demo</button>
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-xl flex items-center justify-center gap-2">
            <AlertCircle size={18} /><span>{error}</span>
          </motion.div>
        )}

        <AnimatePresence>
          {shipmentData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Shipment Details & Rider Info */}
              <div className="space-y-6 md:col-span-1">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">AWB Number</p>
                      <h3 className="text-xl font-mono font-black text-white flex items-center gap-2">{shipmentData.awb} <BadgeCheck size={18} className="text-blue-400"/></h3>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-xl p-4 border border-white/5 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Status</span><span className="font-bold text-emerald-400">{shipmentData.currentStatus.replace(/_/g, ' ')}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Payment</span><span className="font-bold text-white">{shipmentData.paymentMode}</span></div>
                    {shipmentData.codAmount > 0 && <div className="flex justify-between text-sm"><span className="text-slate-400">COD Amount</span><span className="font-bold text-amber-400">₹{shipmentData.codAmount}</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Weight</span><span className="font-bold text-white">{shipmentData.weight} kg</span></div>
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Est. Delivery</span><span className="font-bold text-white">Tomorrow, 9 PM</span></div>
                  </div>

                  {/* SMS / WhatsApp Toggle mockup */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2"><Bell size={16} className="text-blue-400"/><span className="text-xs font-bold text-slate-300">WhatsApp Updates</span></div>
                    <div className="w-8 h-4 bg-blue-500 rounded-full relative"><div className="absolute right-1 top-0.5 w-3 h-3 bg-white rounded-full"></div></div>
                  </div>
                </div>

                {/* Rider Details (If assigned) */}
                {shipmentData.assignedRiderName && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-4">Assigned Rider</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xl border border-blue-500/30">
                        {shipmentData.assignedRiderName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{shipmentData.assignedRiderName}</h4>
                        <p className="text-xs text-slate-400">{shipmentData.assignedRiderPhone}</p>
                      </div>
                      <a href={`tel:${shipmentData.assignedRiderPhone}`} className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-colors">
                        <Phone size={18} />
                      </a>
                    </div>
                    {shipmentData.deliveryOtp && shipmentData.currentStatus !== 'DELIVERED' && (
                      <div className="mt-4 bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-center">
                        <p className="text-xs text-amber-200 mb-1">Delivery OTP</p>
                        <p className="text-3xl font-mono font-black text-amber-400 tracking-[0.2em]">{shipmentData.deliveryOtp}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Tracking Timeline & Actions */}
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 lg:p-8">
                  <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2"><Map size={20} className="text-blue-400"/> Live Tracking Timeline</h3>
                  
                  <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-white/10 pl-10">
                    {shipmentData.timeline?.map((item: any, index: number) => {
                      const isLatest = index === shipmentData.timeline.length - 1;
                      return (
                        <div key={index} className="relative">
                          <div className={`absolute -left-10 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 ${isLatest ? 'bg-blue-600 border-white text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-[#07090E] border-white/20 text-slate-500'}`}>
                            {isLatest ? <Truck size={14} /> : <CheckCircle2 size={14} />}
                          </div>
                          <div>
                            <h4 className={`font-bold ${isLatest ? 'text-white text-lg' : 'text-slate-300 text-md'}`}>{item.stage.replace(/_/g, ' ')}</h4>
                            <p className="text-sm text-slate-400 mt-1">{item.statusText}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs font-mono text-slate-500">
                              <span className="flex items-center gap-1"><Clock size={12}/> {new Date(item.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                              <span className="flex items-center gap-1"><MapPin size={12}/> {item.location}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Customer Actions (NDR/RTO Management) */}
                {shipmentData.currentStatus !== 'DELIVERED' && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <button className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all">
                      <Edit3 size={20} className="text-blue-400" />
                      <span className="text-xs font-bold text-white">Correct Address</span>
                    </button>
                    <button className="bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all">
                      <CalendarDays size={20} className="text-blue-400" />
                      <span className="text-xs font-bold text-white">Reschedule</span>
                    </button>
                    <button className="col-span-2 md:col-span-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center gap-2 transition-all">
                      <AlertCircle size={20} className="text-rose-400" />
                      <span className="text-xs font-bold text-white">Cancel & Return</span>
                    </button>
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CargoPortal;
