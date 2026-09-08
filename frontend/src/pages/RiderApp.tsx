import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Bike,
  Navigation,
  Phone,
  CheckCircle2,
  ShieldCheck,
  AlertOctagon,
  Wallet,
  Clock,
  Sparkles,
  MapPin,
  Camera,
  RotateCcw,
  Check,
} from 'lucide-react';

const RiderApp: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>({
    awb: 'OS-882910412',
    customerName: 'Priya Verma',
    customerPhone: '+91 98765 43210',
    address: 'Flat 402, Lotus Boulevard, Sector 100, New Delhi',
    orderType: 'COD',
    codAmount: 2499,
    itemDescription: 'AeroGlide Pro Active Runners',
    status: 'OUT_FOR_DELIVERY',
    expectedOtp: '7492',
  });

  // Digital POD state
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [isDelivered, setIsDelivered] = useState(false);
  const [podSubmitting, setPodSubmitting] = useState(false);
  const [sosAlert, setSosAlert] = useState(false);

  // Canvas Signature state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [selectedTask]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = 'clientX' in e ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = 'clientY' in e ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleSubmitPod = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() !== selectedTask.expectedOtp && enteredOtp.trim() !== '7492') {
      setOtpError('Incorrect OTP! Please ask customer for correct 4-digit OneStall delivery OTP.');
      return;
    }
    setOtpError(null);
    setPodSubmitting(true);

    try {
      const canvas = canvasRef.current;
      const signatureData = canvas ? canvas.toDataURL() : '';

      await axios.post(`/api/cargo/track/${selectedTask.awb}/pod`, {
        enteredOtp: enteredOtp.trim(),
        signature: signatureData,
        photoProof: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        receiverName: selectedTask.customerName,
        gpsCoords: { lat: 28.6139, lng: 77.2090 },
      });

      setIsDelivered(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting POD');
    } finally {
      setPodSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-4 max-w-lg mx-auto space-y-5">
      {/* Rider Mobile App Top Bar */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-emerald-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
            <Bike size={20} />
          </div>
          <div>
            <h1 className="font-heading font-bold text-white text-base">Rahul Sharma</h1>
            <p className="text-[11px] text-slate-400">OneStall Rider #OS-R-492 • DL-01</p>
          </div>
        </div>

        {/* Online / Offline Status Toggle (PRD 5.5) */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            isOnline
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
        </button>
      </div>

      {/* Quick Earnings & SOS Strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Today's Cash (COD)</span>
            <span className="text-lg font-bold font-heading text-white">₹4,998</span>
          </div>
          <Wallet className="text-emerald-400" size={20} />
        </div>

        <button
          onClick={() => {
            setSosAlert(true);
            setTimeout(() => setSosAlert(false), 3000);
          }}
          className="bg-rose-950/40 border border-rose-500/50 hover:bg-rose-900/60 rounded-2xl p-3 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div>
            <span className="text-[10px] text-rose-400 uppercase font-bold block">Emergency Assist</span>
            <span className="text-xs font-bold text-rose-200">
              {sosAlert ? 'SOS ALERT SENT!' : 'Rider SOS Alert'}
            </span>
          </div>
          <AlertOctagon className="text-rose-500 animate-bounce" size={22} />
        </button>
      </div>

      {/* Assigned Delivery Card with Navigation */}
      <div className="glass-card rounded-3xl p-5 space-y-4 border-blue-500/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">
              Current Stop 1 of 4
            </span>
            <h3 className="font-heading font-bold text-white text-base mt-1">
              Deliver Parcel to Customer
            </h3>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 block">{selectedTask.awb}</span>
            <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              COD ₹{selectedTask.codAmount}
            </span>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="font-bold text-white text-sm">{selectedTask.customerName}</div>
            <a
              href={`tel:${selectedTask.customerPhone}`}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 transition-colors"
            >
              <Phone size={13} />
              <span>Call Customer</span>
            </a>
          </div>

          <div className="flex items-start gap-2 text-slate-300">
            <MapPin size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{selectedTask.address}</p>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl">
            Package: <strong className="text-white">{selectedTask.itemDescription}</strong>
          </div>
        </div>

        {/* Simulated Route Navigation Button */}
        <button
          onClick={() => alert(`Starting turn-by-turn navigation to ${selectedTask.address}`)}
          className="w-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Navigation size={15} />
          <span>Open Turn-by-Turn GPS Navigation</span>
        </button>
      </div>

      {/* DIGITAL PROOF OF DELIVERY (POD) CONSOLE (PRD 5.5 & 5.15) */}
      {!isDelivered ? (
        <form onSubmit={handleSubmitPod} className="glass-card rounded-3xl p-5 space-y-4 border-emerald-500/30">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <ShieldCheck className="text-emerald-400" size={20} />
            <div>
              <h3 className="font-heading font-bold text-white text-sm">
                Digital Proof of Delivery (POD)
              </h3>
              <p className="text-[10px] text-slate-400">
                PRD 5.15: Verify OTP + capture digital signature + GPS timestamp
              </p>
            </div>
          </div>

          {/* OTP Verification Input */}
          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
              <span>Enter Customer Delivery OTP</span>
              <span className="text-[10px] text-amber-400 font-normal">
                (Demo OTP is <strong>7492</strong>)
              </span>
            </label>
            <input
              type="text"
              maxLength={4}
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="e.g. 7492"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-emerald-500"
              required
            />
            {otpError && <p className="text-rose-400 text-[11px]">{otpError}</p>}
          </div>

          {/* Interactive HTML5 Canvas Signature Pad (PRD 5.15) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Customer Signature Pad</span>
              <button
                type="button"
                onClick={clearSignature}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>Clear</span>
              </button>
            </div>
            <div className="border border-slate-700 rounded-2xl overflow-hidden bg-white touch-none">
              <canvas
                ref={canvasRef}
                width={360}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full cursor-crosshair"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Customer can sign above using finger (mobile) or mouse.
            </p>
          </div>

          {/* COD Cash Collection checkbox */}
          {selectedTask.orderType === 'COD' && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl flex items-center gap-3">
              <input type="checkbox" id="codCheck" defaultChecked required className="w-4 h-4 rounded text-amber-500" />
              <label htmlFor="codCheck" className="text-xs text-amber-200">
                I have collected <strong>₹{selectedTask.codAmount}</strong> in cash from customer.
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={podSubmitting}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-600/30 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            {podSubmitting ? <Clock className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
            <span>Complete Delivery & Verify Digital POD</span>
          </button>
        </form>
      ) : (
        /* Delivered Success View */
        <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-3xl p-6 text-center space-y-3 animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-heading font-black text-white text-xl">Parcel Delivered!</h3>
          <p className="text-xs text-emerald-300">
            Digital POD verified with OTP <strong>7492</strong> and customer signature. COD ₹2,499 added to rider wallet.
          </p>
          <div className="text-[11px] text-slate-400 font-mono">
            Shipment {selectedTask.awb} status updated to DELIVERED in OneStall Cargo Audit Trail.
          </div>
        </div>
      )}
    </div>
  );
};

export default RiderApp;
