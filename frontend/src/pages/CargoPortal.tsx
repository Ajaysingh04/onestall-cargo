import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  Truck,
  Package,
  Calculator,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  User,
  Phone,
  ShieldCheck,
  ArrowRight,
  Printer,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  FileText,
  BadgeCheck,
} from 'lucide-react';

const CargoPortal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'track';

  const [activeTab, setActiveTab] = useState<'track' | 'rates' | 'book' | 'api'>(
    initialTab as any
  );

  // Tracking state
  const [awbQuery, setAwbQuery] = useState('OS-882910412');
  const [shipmentData, setShipmentData] = useState<any>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState<string | null>(null);

  // Rate Calculator state
  const [pickupPin, setPickupPin] = useState('110001');
  const [deliveryPin, setDeliveryPin] = useState('400001');
  const [weight, setWeight] = useState(0.85);
  const [length, setLength] = useState(25);
  const [width, setWidth] = useState(18);
  const [height, setHeight] = useState(8);
  const [paymentMode, setPaymentMode] = useState<'PREPAID' | 'COD'>('PREPAID');
  const [codValue, setCodValue] = useState(1500);
  const [ratesResult, setRatesResult] = useState<any>(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Booking state
  const [bookingForm, setBookingForm] = useState({
    senderName: 'Apex Brands Hub',
    senderPhone: '+91 98111 22334',
    pickupAddress: 'Sector 62, Electronic City, Noida',
    pickupPincode: '110001',
    receiverName: 'Sanjay Kapoor',
    receiverPhone: '+91 98200 11223',
    deliveryAddress: 'Flat 801, Sea Breeze Apartments, Worli',
    deliveryPincode: '400001',
    packageType: 'Electronics Cargo Box',
    declaredValue: 3500,
    weight: 1.2,
    paymentMode: 'PREPAID',
    codAmount: 0,
    courierPartner: 'OneStall Express',
  });
  const [createdShipment, setCreatedShipment] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'track' && awbQuery) {
      handleTrack(awbQuery);
    }
  }, [activeTab]);

  const handleTrack = async (awbToSearch: string) => {
    if (!awbToSearch.trim()) return;
    setTrackingLoading(true);
    setTrackingError(null);
    try {
      const { data } = await axios.get(`/api/cargo/track/${awbToSearch.trim()}`);
      setShipmentData(data);
    } catch (err: any) {
      setTrackingError(err.response?.data?.message || 'AWB not found on OneStall Cargo network.');
      setShipmentData(null);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCalculateRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setRatesLoading(true);
    try {
      const { data } = await axios.post('/api/cargo/rates', {
        weight,
        length,
        width,
        height,
        pickupPincode: pickupPin,
        deliveryPincode: deliveryPin,
        paymentMode,
        codAmount: codValue,
      });
      setRatesResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRatesLoading(false);
    }
  };

  const handleBookShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    try {
      const { data } = await axios.post('/api/cargo/shipments', bookingForm);
      setCreatedShipment(data);
      setAwbQuery(data.awb);
    } catch (err: any) {
      alert('Error creating shipment: ' + (err.response?.data?.message || err.message));
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-800/40 p-6 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold">
              <Truck size={14} />
              <span>OneStall Cargo Logistics & Courier Aggregator</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-heading font-black text-white tracking-tight">
              Next-Gen Logistics Engine
            </h1>
            <p className="text-slate-300 text-sm lg:text-base max-w-2xl leading-relaxed">
              Powering end-to-end fulfillment for the OneStall marketplace, standalone B2B parcel booking,
              franchise-based last mile delivery, and multi-courier aggregation with a 100% digital audit trail.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-3 gap-3 bg-slate-900/80 border border-slate-700/80 p-4 rounded-2xl backdrop-blur-md">
            <div className="text-center px-2">
              <div className="text-xl font-bold font-heading text-blue-400">27,000+</div>
              <div className="text-[10px] text-slate-400 uppercase">Pincodes</div>
            </div>
            <div className="text-center px-2 border-x border-slate-800">
              <div className="text-xl font-bold font-heading text-amber-400">&lt;24 Hrs</div>
              <div className="text-[10px] text-slate-400 uppercase">Metro SLA</div>
            </div>
            <div className="text-center px-2">
              <div className="text-xl font-bold font-heading text-emerald-400">99.2%</div>
              <div className="text-[10px] text-slate-400 uppercase">On-Time</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Search size={15} />
            <span>Digital Audit Trail Tracker</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('rates');
              if (!ratesResult) handleCalculateRates({ preventDefault: () => {} } as any);
            }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'rates'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Calculator size={15} />
            <span>Multi-Courier Rate Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('book')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'book'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Package size={15} />
            <span>Standalone Parcel Booking</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'api'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText size={15} />
            <span>B2B API & Integration Layer</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DIGITAL AUDIT TRAIL TRACKER */}
      {activeTab === 'track' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Search Bar */}
          <div className="glass-card rounded-2xl p-4 lg:p-6 flex flex-col md:flex-row gap-3 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={awbQuery}
                onChange={(e) => setAwbQuery(e.target.value)}
                placeholder="Enter OneStall AWB Number (e.g. OS-882910412 or OS-719382014)"
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => handleTrack(awbQuery)}
                disabled={trackingLoading}
                className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                {trackingLoading ? <Clock className="animate-spin" size={16} /> : <Search size={16} />}
                <span>Track Parcel</span>
              </button>

              <button
                onClick={() => {
                  setAwbQuery('OS-719382014');
                  handleTrack('OS-719382014');
                }}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-3 rounded-xl font-mono whitespace-nowrap"
              >
                Sample Delivered AWB
              </button>
            </div>
          </div>

          {trackingError && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl flex items-center gap-3 text-xs">
              <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
              <span>{trackingError}</span>
            </div>
          )}

          {shipmentData && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Shipment Overview & Rider Info */}
              <div className="space-y-6 lg:col-span-1">
                {/* Status Summary Card */}
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                      Tracking Summary
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      shipmentData.currentStatus === 'DELIVERED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {shipmentData.currentStatus.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400">Airway Bill (AWB)</div>
                    <div className="text-lg font-mono font-bold text-white flex items-center gap-2">
                      {shipmentData.awb}
                      <BadgeCheck size={18} className="text-blue-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <div className="text-slate-400 text-[11px]">Courier Network</div>
                      <div className="font-semibold text-white">{shipmentData.courierPartner}</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Payment Mode</div>
                      <div className="font-semibold text-white">
                        {shipmentData.paymentMode} {shipmentData.codAmount > 0 && `(₹${shipmentData.codAmount})`}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Package Weight</div>
                      <div className="font-semibold text-white">{shipmentData.weight} kg</div>
                    </div>
                    <div>
                      <div className="text-slate-400 text-[11px]">Delivery Pincode</div>
                      <div className="font-semibold text-white font-mono">{shipmentData.deliveryPincode}</div>
                    </div>
                  </div>
                </div>

                {/* Assigned Rider & Delivery Console Card */}
                <div className="glass-card rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                      <User size={16} className="text-blue-400" />
                      Assigned Delivery Rider
                    </h4>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      LIVE ON ROUTE
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {shipmentData.assignedRiderName ? shipmentData.assignedRiderName.charAt(0) : 'R'}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">
                        {shipmentData.assignedRiderName || 'Rahul Sharma'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {shipmentData.assignedRiderPhone || '+91 98112 34567'}
                      </div>
                      <div className="text-[11px] text-blue-400 mt-0.5">Rating: 4.9 ★ (1,240 Deliveries)</div>
                    </div>
                    <a
                      href={`tel:${shipmentData.assignedRiderPhone || '9811234567'}`}
                      className="p-2.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl transition-colors"
                      title="Call Rider"
                    >
                      <Phone size={16} />
                    </a>
                  </div>

                  {/* Delivery OTP card for customer */}
                  {shipmentData.deliveryOtp && shipmentData.currentStatus !== 'DELIVERED' && (
                    <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-400">Your Delivery OTP:</span>
                        <span className="text-[10px] text-slate-400">Share with rider only at door</span>
                      </div>
                      <div className="text-2xl font-mono font-black tracking-widest text-amber-300">
                        {shipmentData.deliveryOtp}
                      </div>
                    </div>
                  )}

                  {/* Digital Proof of Delivery (POD) Preview */}
                  {shipmentData.digitalSignature && (
                    <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <ShieldCheck size={16} />
                        <span>Verified Digital Proof of Delivery (POD)</span>
                      </div>
                      <div className="bg-white p-2 rounded-lg flex items-center justify-center">
                        <img
                          src={shipmentData.digitalSignature}
                          alt="Customer Digital Signature"
                          className="h-12 object-contain"
                        />
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Signature captured at GPS ({shipmentData.gpsLocation?.lat}, {shipmentData.gpsLocation?.lng})
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right 2 Columns: Complete 10-Stage Digital Audit Trail */}
              <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                      <ShieldCheck className="text-blue-400" size={20} />
                      Complete Digital Audit Trail
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      PRD Core Principle: Every parcel carries an auditable timeline with responsible person & timestamps.
                    </p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Printer size={14} />
                    <span>Print Manifest</span>
                  </button>
                </div>

                {/* Timeline visualizer */}
                <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-blue-500 before:to-emerald-500 pl-8">
                  {shipmentData.timeline?.map((item: any, index: number) => {
                    const isLatest = index === shipmentData.timeline.length - 1;
                    return (
                      <div key={index} className="relative space-y-1 group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-8 top-1 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                            isLatest
                              ? 'bg-blue-600 border-white text-white shadow-lg shadow-blue-500/50 scale-110'
                              : 'bg-slate-900 border-blue-500/60 text-blue-400'
                          }`}
                        >
                          <CheckCircle2 size={14} />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-sm text-white tracking-wide">
                            {item.stage.replace(/_/g, ' ')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {new Date(item.timestamp).toLocaleString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{item.statusText}</p>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin size={12} className="text-blue-400" />
                            <span>{item.location}</span>
                          </span>

                          {item.responsiblePerson && (
                            <span className="flex items-center gap-1">
                              <User size={12} className="text-amber-400" />
                              <span>{item.responsiblePerson}</span>
                            </span>
                          )}

                          {item.notes && (
                            <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-300">
                              {item.notes}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 2: MULTI-COURIER RATE CALCULATOR */}
      {activeTab === 'rates' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          {/* Calculator Input Form */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-1 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Calculator className="text-blue-400" size={20} />
              <h3 className="font-heading font-bold text-white text-base">Rate Calculator</h3>
            </div>

            <form onSubmit={handleCalculateRates} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Pickup Pincode</label>
                  <input
                    type="text"
                    value={pickupPin}
                    onChange={(e) => setPickupPin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Delivery Pincode</label>
                  <input
                    type="text"
                    value={deliveryPin}
                    onChange={(e) => setDeliveryPin(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Actual Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Dimensions (L x W x H in cm)</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    placeholder="L"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-mono text-center"
                  />
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(Number(e.target.value))}
                    placeholder="W"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-mono text-center"
                  />
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    placeholder="H"
                    className="bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e: any) => setPaymentMode(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="PREPAID">Prepaid</option>
                    <option value="COD">Cash on Delivery (COD)</option>
                  </select>
                </div>
                {paymentMode === 'COD' && (
                  <div>
                    <label className="text-slate-400 block mb-1">COD Value (₹)</label>
                    <input
                      type="number"
                      value={codValue}
                      onChange={(e) => setCodValue(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={ratesLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                {ratesLoading ? <Clock className="animate-spin" size={16} /> : <Calculator size={16} />}
                <span>Calculate & Compare Couriers</span>
              </button>
            </form>
          </div>

          {/* Courier Comparison Table */}
          <div className="glass-card rounded-2xl p-6 lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-heading font-bold text-white text-base">Multi-Courier Rate Matrix</h3>
                <p className="text-xs text-slate-400">
                  Billable Weight:{' '}
                  <strong className="text-white">{ratesResult?.billableWeight || weight} kg</strong> | Volumetric:{' '}
                  <span className="text-slate-300">{ratesResult?.volumetricWeight || 0.6} kg</span>
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-semibold">
                Instant Auto-Picker Ready
              </span>
            </div>

            <div className="space-y-3">
              {ratesResult?.couriers?.map((courier: any) => {
                const isOneStall = courier.id === 'onestall-express';
                return (
                  <div
                    key={courier.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isOneStall
                        ? 'bg-blue-900/30 border-blue-500/60 shadow-lg shadow-blue-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{courier.name}</span>
                        {isOneStall && (
                          <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                            In-House Preferred
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{courier.type}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">SLA: {courier.sla}</span>
                        <span>•</span>
                        <span className="text-amber-400">★ {courier.rating}</span>
                      </div>
                      <div className="text-[11px] text-blue-300">{courier.badge}</div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-black font-heading text-white">₹{courier.rate}</div>
                        <div className="text-[10px] text-slate-400">All taxes included</div>
                      </div>

                      <button
                        onClick={() => {
                          setBookingForm({
                            ...bookingForm,
                            courierPartner: courier.name.includes('OneStall') ? 'OneStall Express' : courier.name,
                            pickupPincode: pickupPin,
                            deliveryPincode: deliveryPin,
                            weight,
                          });
                          setActiveTab('book');
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isOneStall
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span>Book</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STANDALONE PARCEL BOOKING */}
      {activeTab === 'book' && (
        <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-black text-white text-xl flex items-center gap-2">
                <Package className="text-amber-400" size={22} />
                Standalone B2B Parcel Booking
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ship packages directly via OneStall Cargo or aggregated couriers without marketplace cart.
              </p>
            </div>
          </div>

          <form onSubmit={handleBookShipment} className="space-y-6 text-xs">
            {/* Sender Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 text-blue-400">
                <span>1. Pickup / Sender Details</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Sender / Company Name"
                  value={bookingForm.senderName}
                  onChange={(e) => setBookingForm({ ...bookingForm, senderName: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Sender Phone"
                  value={bookingForm.senderPhone}
                  onChange={(e) => setBookingForm({ ...bookingForm, senderPhone: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Pickup Address"
                  value={bookingForm.pickupAddress}
                  onChange={(e) => setBookingForm({ ...bookingForm, pickupAddress: e.target.value })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Pickup Pincode"
                  value={bookingForm.pickupPincode}
                  onChange={(e) => setBookingForm({ ...bookingForm, pickupPincode: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Receiver Section */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 text-emerald-400">
                <span>2. Delivery / Receiver Details</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Receiver Full Name"
                  value={bookingForm.receiverName}
                  onChange={(e) => setBookingForm({ ...bookingForm, receiverName: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Receiver Phone Number"
                  value={bookingForm.receiverPhone}
                  onChange={(e) => setBookingForm({ ...bookingForm, receiverPhone: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={bookingForm.deliveryAddress}
                  onChange={(e) => setBookingForm({ ...bookingForm, deliveryAddress: e.target.value })}
                  className="sm:col-span-2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                  required
                />
                <input
                  type="text"
                  placeholder="Delivery Pincode"
                  value={bookingForm.deliveryPincode}
                  onChange={(e) => setBookingForm({ ...bookingForm, deliveryPincode: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  required
                />
              </div>
            </div>

            {/* Package & Payment */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <h4 className="font-bold text-white text-sm flex items-center gap-2 text-amber-400">
                <span>3. Package & Courier Partner</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight (kg)"
                  value={bookingForm.weight}
                  onChange={(e) => setBookingForm({ ...bookingForm, weight: Number(e.target.value) })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white font-mono"
                  required
                />
                <select
                  value={bookingForm.courierPartner}
                  onChange={(e) => setBookingForm({ ...bookingForm, courierPartner: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="OneStall Express">OneStall Express (Direct In-House)</option>
                  <option value="Delhivery">Delhivery Surface Pro</option>
                  <option value="Bluedart">Blue Dart Air Express</option>
                  <option value="Shadowfax">Shadowfax Local</option>
                </select>
                <select
                  value={bookingForm.paymentMode}
                  onChange={(e: any) => setBookingForm({ ...bookingForm, paymentMode: e.target.value })}
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="PREPAID">Prepaid</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={bookingLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {bookingLoading ? <Clock className="animate-spin" size={18} /> : <Zap size={18} />}
              <span>Generate AWB & Confirm OneStall Cargo Dispatch</span>
            </button>
          </form>

          {/* Created Shipment Success Modal / Banner */}
          {createdShipment && (
            <div className="bg-emerald-950/60 border border-emerald-500/50 p-6 rounded-2xl space-y-4 animate-in zoom-in-95">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <div>
                  <h4 className="font-heading font-bold text-white text-base">
                    Shipment Booked Successfully!
                  </h4>
                  <p className="text-xs text-emerald-300">
                    AWB registered and assigned to OneStall Franchise for pickup.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-xl flex items-center justify-between font-mono text-sm">
                <div>
                  <span className="text-slate-400 text-xs block">Assigned AWB Number:</span>
                  <strong className="text-blue-400 text-lg">{createdShipment.awb}</strong>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('track');
                    handleTrack(createdShipment.awb);
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2 rounded-lg font-sans font-semibold transition-colors"
                >
                  Track in Audit Timeline
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: B2B API INTEGRATION LAYER */}
      {activeTab === 'api' && (
        <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="space-y-2 pb-4 border-b border-slate-800">
            <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-bold uppercase">
              PRD Section 6
            </span>
            <h3 className="font-heading font-black text-white text-2xl">
              OneStall Cargo B2B API & Webhook Layer
            </h3>
            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              External e-commerce businesses, Shopify stores, and WooCommerce merchants can integrate OneStall Cargo
              programmatically the same way they integrate Delhivery, Xpressbees, or Ekart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-blue-400 font-bold">POST /api/cargo/rates</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Public</span>
              </div>
              <p className="text-xs text-slate-400">Calculate shipping rates & courier comparison for given pincodes & weight.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">POST /api/cargo/shipments</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Auth Token</span>
              </div>
              <p className="text-xs text-slate-400">Generate AWB and schedule immediate franchise pickup.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-amber-400 font-bold">GET /api/cargo/track/:awb</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Public</span>
              </div>
              <p className="text-xs text-slate-400">Query complete 10-stage digital audit trail with rider details & POD.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-purple-400 font-bold">POST /api/cargo/track/:awb/pod</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">Rider App</span>
              </div>
              <p className="text-xs text-slate-400">Submit OTP verification, digital signature image & GPS proof of delivery.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CargoPortal;
