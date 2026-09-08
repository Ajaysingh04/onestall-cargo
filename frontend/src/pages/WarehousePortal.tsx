import React, { useState } from 'react';
import {
  Layers,
  Truck,
  Scan,
  PackageCheck,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  FileText,
  Clock,
} from 'lucide-react';

const WarehousePortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'manifest' | 'scan' | 'hubs'>('manifest');
  const [scanAwb, setScanAwb] = useState('');
  const [scannedList, setScannedList] = useState<string[]>([
    'OS-882910412',
    'OS-719382014',
    'OS-391024519',
  ]);

  const [manifests, setManifests] = useState([
    {
      id: 'OS-BAG-DEL092',
      origin: 'Delhi Okhla Hub',
      destination: 'Mumbai Gateway Hub',
      vehicle: 'DL-1L-4421 (Express Line-Haul)',
      driver: 'Ramesh Yadav',
      totalParcels: 48,
      status: 'IN_TRANSIT',
      departureTime: '10:30 AM Today',
      estArrival: '06:00 AM Tomorrow',
    },
    {
      id: 'OS-BAG-BLR118',
      origin: 'Delhi Central Hub',
      destination: 'Bengaluru Silicon Hub',
      vehicle: 'DL-2S-8820 (Air Container)',
      driver: 'Airways Cargo 402',
      totalParcels: 32,
      status: 'DISPATCHED',
      departureTime: '01:15 PM Today',
      estArrival: '09:00 PM Today',
    },
  ]);

  const handleAddScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanAwb.trim()) return;
    setScannedList([scanAwb.trim().toUpperCase(), ...scannedList]);
    setScanAwb('');
  };

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-purple-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-black text-white">Warehouse & Hub Movement (WMS)</h1>
              <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Hub Ops
              </span>
            </div>
            <p className="text-xs text-slate-400">
              PRD 5.10 & 5.21: Franchise → Origin Hub → Main Hub → Destination Hub → Franchise → Delivery Boy
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'manifest' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Line-Haul Manifests
          </button>
          <button
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'scan' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            Barcode / QR Scanner
          </button>
        </div>
      </div>

      {/* Hub Movement Network Flow (PRD Section 5.21 Visualized) */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <h3 className="font-heading font-bold text-white text-base">OneStall Multi-Hub Transit Route</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="text-amber-400 font-bold">1. Franchise</div>
            <p className="text-[10px] text-slate-400">Local Pickup</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="text-blue-400 font-bold">2. Origin Hub</div>
            <p className="text-[10px] text-slate-400">Inward & Bagging</p>
          </div>
          <div className="bg-slate-900 border border-purple-500/40 p-3 rounded-xl space-y-1 bg-purple-950/20">
            <div className="text-purple-400 font-bold">3. Main Sorting</div>
            <p className="text-[10px] text-slate-300 font-medium">Line-Haul Transit</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="text-blue-400 font-bold">4. Dest. Hub</div>
            <p className="text-[10px] text-slate-400">De-bagging</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="text-amber-400 font-bold">5. Franchise</div>
            <p className="text-[10px] text-slate-400">Last-Mile Sort</p>
          </div>
          <div className="bg-slate-900 border border-emerald-500/40 p-3 rounded-xl space-y-1 bg-emerald-950/20">
            <div className="text-emerald-400 font-bold">6. Delivery Rider</div>
            <p className="text-[10px] text-emerald-300 font-medium">Digital POD OTP</p>
          </div>
        </div>
      </div>

      {/* Manifests & Scanners */}
      {activeTab === 'manifest' ? (
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-heading font-bold text-white text-base">Active Hub Transfer Manifests</h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl">2 Active Line-Hauls</span>
          </div>

          <div className="space-y-4">
            {manifests.map((m) => (
              <div
                key={m.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-purple-400 text-sm">{m.id}</span>
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      {m.status}
                    </span>
                  </div>
                  <div className="text-xs text-white font-semibold flex items-center gap-2">
                    <span>{m.origin}</span>
                    <ArrowRight size={13} className="text-slate-500" />
                    <span>{m.destination}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Vehicle: <strong className="text-slate-200">{m.vehicle}</strong> • Driver:{' '}
                    <span className="text-slate-300">{m.driver}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 text-xs">
                  <div className="text-right">
                    <div className="text-white font-bold">{m.totalParcels} Parcels Inside</div>
                    <div className="text-slate-400 text-[11px]">ETA: {m.estArrival}</div>
                  </div>

                  <button
                    onClick={() => alert(`Manifest ${m.id} scanned and inwarded into destination hub.`)}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Receive & Inward
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-3xl p-6 space-y-4">
            <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
              <Scan className="text-purple-400" size={18} />
              Simulate Barcode / QR Scanner
            </h3>
            <form onSubmit={handleAddScan} className="space-y-3">
              <input
                type="text"
                placeholder="Scan or Enter AWB (e.g. OS-882910412)"
                value={scanAwb}
                onChange={(e) => setScanAwb(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm font-mono text-white"
              />
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl transition-colors cursor-pointer text-xs"
              >
                Scan & Verify Packet Weight
              </button>
            </form>
          </div>

          <div className="glass-card rounded-3xl p-6 space-y-3">
            <h3 className="font-heading font-bold text-white text-base">Recently Inwarded AWBs</h3>
            <div className="space-y-2">
              {scannedList.map((awb, i) => (
                <div key={i} className="bg-slate-900 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-white">{awb}</span>
                  <span className="text-emerald-400 flex items-center gap-1 font-sans text-[11px]">
                    <PackageCheck size={14} />
                    Verified & Bagged
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePortal;
