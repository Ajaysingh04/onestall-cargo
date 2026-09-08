import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Building2,
  Bike,
  Package,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  AlertCircle,
  BatteryCharging,
  Wifi,
  Users,
} from 'lucide-react';

const FranchisePortal: React.FC = () => {
  const [franchises, setFranchises] = useState<any[]>([]);
  const [selectedHub, setSelectedHub] = useState('OS-HUB-DEL01');
  const [hubData, setHubData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Riders state
  const [riders, setRiders] = useState([
    {
      id: 'r1',
      name: 'Rahul Sharma',
      phone: '+91 98112 34567',
      assignedArea: 'Connaught Place & Sector 100',
      activeDeliveries: 12,
      completedToday: 24,
      status: 'ON_ROUTE',
      battery: 88,
      rating: 4.9,
    },
    {
      id: 'r2',
      name: 'Vikas Rawat',
      phone: '+91 98111 88990',
      assignedArea: 'Okhla Phase 2 & 3',
      activeDeliveries: 8,
      completedToday: 19,
      status: 'ON_ROUTE',
      battery: 64,
      rating: 4.8,
    },
    {
      id: 'r3',
      name: 'Mohit Negi',
      phone: '+91 98222 11002',
      assignedArea: 'South Extension Hub',
      activeDeliveries: 0,
      completedToday: 28,
      status: 'AVAILABLE_AT_HUB',
      battery: 95,
      rating: 4.9,
    },
  ]);

  useEffect(() => {
    fetchFranchises();
  }, []);

  useEffect(() => {
    if (selectedHub) {
      fetchHubDetails(selectedHub);
    }
  }, [selectedHub]);

  const fetchFranchises = async () => {
    try {
      const { data } = await axios.get('/api/franchises');
      setFranchises(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHubDetails = async (code: string) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/franchises/${code}`);
      setHubData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeFranchise = hubData?.franchise || franchises.find((f) => f.centreCode === selectedHub);

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Franchise Centre Top Header & Hub Switcher */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Building2 size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-black text-white">
                {activeFranchise?.centreName || 'OneStall Delhi Central Logistics Hub'}
              </h1>
              <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {activeFranchise?.centreCode || selectedHub}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manager: {activeFranchise?.managerName || 'Vikram Malhotra'} • Assigned Pincodes:{' '}
              {activeFranchise?.assignedPincodes?.join(', ') || '110001, 110002, 110020'}
            </p>
          </div>
        </div>

        {/* Hub Selector */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-700">
          <span className="text-[11px] text-slate-400 pl-2 font-medium">Switch Hub:</span>
          <select
            value={selectedHub}
            onChange={(e) => setSelectedHub(e.target.value)}
            className="bg-slate-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl border-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="OS-HUB-DEL01">Delhi Central (DL-01)</option>
            <option value="OS-HUB-BOM01">Mumbai Gateway (BOM-01)</option>
            <option value="OS-HUB-BLR01">Bengaluru Tech (BLR-01)</option>
          </select>
        </div>
      </div>

      {/* Centre Metrics Cards (PRD Section 5.9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Today's Total Bookings</span>
            <Package size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            {activeFranchise?.todayBookings || 142}
          </div>
          <div className="text-[11px] text-emerald-400">
            {activeFranchise?.todayDelivered || 118} Delivered today
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>COD Cash Collected Today</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            ₹{(activeFranchise?.codCollectedToday || 48500).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400">Reconciled with 8 delivery riders</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Franchise Margin (15%)</span>
            <TrendingUp size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            ₹{(activeFranchise?.pendingSettlementAmount || 57600).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-400">Pending weekly settlement payout</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Delivery SLA Score</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            {activeFranchise?.performanceScore || 98.4}%
          </div>
          <div className="text-[11px] text-emerald-400">Ranked Top 3 Pan-India</div>
        </div>
      </div>

      {/* Rider Management & Centre Parcel Movement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Delivery Boy / Rider Fleet Management (PRD 5.9) */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Bike className="text-emerald-400" size={18} />
                Franchise Rider Fleet (Live GPS & Battery)
              </h3>
              <p className="text-xs text-slate-400">
                Manage delivery executives, assign manifests, monitor live attendance & battery
              </p>
            </div>
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              3 Riders Active
            </span>
          </div>

          <div className="space-y-3">
            {riders.map((rider) => (
              <div
                key={rider.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold">
                    {rider.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{rider.name}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">
                        {rider.phone}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin size={12} className="text-blue-400" />
                      <span>{rider.assignedArea}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5 text-xs">
                  <div className="text-right">
                    <div className="text-white font-bold">{rider.completedToday} Delivered</div>
                    <div className="text-amber-400 text-[11px]">{rider.activeDeliveries} Pending</div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-300">
                    <BatteryCharging size={14} className="text-emerald-400" />
                    <span className="font-mono text-xs">{rider.battery}%</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    rider.status === 'ON_ROUTE'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {rider.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Rate Card & Margin Config (PRD 5.9) */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-1 space-y-5">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-heading font-bold text-white text-base">Rate Card & Commission</h3>
            <p className="text-xs text-slate-400">Scoped centre rates and margin percentage</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-900 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Customer Base Rate</span>
                <span className="font-bold text-white text-sm">₹65 / 0.5 kg</span>
              </div>
              <span className="text-slate-400 text-[11px]">Forward Run</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Franchise Fixed Margin</span>
                <span className="font-bold text-emerald-400 text-sm">15.0% Guaranteed</span>
              </div>
              <span className="text-emerald-400 text-[11px]">Auto Settled</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">COD Handling Commission</span>
                <span className="font-bold text-amber-400 text-sm">₹15 per order</span>
              </div>
              <span className="text-slate-400 text-[11px]">At Delivery</span>
            </div>

            <div className="bg-slate-900 p-3.5 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-slate-400 text-[11px] block">Reverse Pickup (RTO/Return)</span>
                <span className="font-bold text-purple-400 text-sm">₹45 / piece</span>
              </div>
              <span className="text-slate-400 text-[11px]">Fixed Credit</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FranchisePortal;
