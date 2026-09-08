import React, { useState } from 'react';
import axios from 'axios';
import { Code2, Play, CheckCircle2, Copy, Check, Terminal, ExternalLink } from 'lucide-react';

const ApiDocs: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<'rates' | 'track' | 'create'>('rates');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestApi = async () => {
    setTesting(true);
    setTestResponse(null);
    try {
      if (selectedEndpoint === 'rates') {
        const { data } = await axios.post('/api/cargo/rates', {
          weight: 1.0,
          length: 20,
          width: 15,
          height: 10,
          pickupPincode: '110001',
          deliveryPincode: '400001',
          paymentMode: 'PREPAID',
        });
        setTestResponse(data);
      } else if (selectedEndpoint === 'track') {
        const { data } = await axios.get('/api/cargo/track/OS-882910412');
        setTestResponse(data);
      } else if (selectedEndpoint === 'create') {
        const { data } = await axios.post('/api/cargo/shipments', {
          senderName: 'External Shopify Store',
          senderPhone: '+91 99999 88888',
          pickupAddress: 'Warehouse 4, Okhla, New Delhi',
          pickupPincode: '110001',
          receiverName: 'Rohan Sharma',
          receiverPhone: '+91 98888 77777',
          deliveryAddress: 'Flat 101, Powai, Mumbai',
          deliveryPincode: '400072',
          weight: 0.5,
          paymentMode: 'PREPAID',
          courierPartner: 'OneStall Express',
        });
        setTestResponse(data);
      }
    } catch (err: any) {
      setTestResponse({ error: err.response?.data || err.message });
    } finally {
      setTesting(false);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeSnippets = {
    rates: `curl -X POST https://api.onestall.in/api/cargo/rates \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ONESTALL_API_KEY" \\
  -d '{
    "weight": 1.0,
    "length": 20,
    "width": 15,
    "height": 10,
    "pickupPincode": "110001",
    "deliveryPincode": "400001",
    "paymentMode": "PREPAID"
  }'`,
    track: `curl -X GET https://api.onestall.in/api/cargo/track/OS-882910412 \\
  -H "Authorization: Bearer YOUR_ONESTALL_API_KEY"`,
    create: `curl -X POST https://api.onestall.in/api/cargo/shipments \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ONESTALL_API_KEY" \\
  -d '{
    "senderName": "External Store",
    "pickupPincode": "110001",
    "receiverName": "Customer Name",
    "deliveryPincode": "400001",
    "weight": 0.5,
    "paymentMode": "COD",
    "codAmount": 1499
  }'`,
  };

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="glass-card rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-blue-500/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Code2 size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-black text-white">OneStall Cargo B2B API Simulator</h1>
            <p className="text-xs text-slate-400">
              PRD Section 6: Expose OneStall Cargo as a standalone B2B logistics service via API for outside websites
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-mono">v1.4 REST Endpoints Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Endpoint Selector */}
        <div className="glass-card rounded-3xl p-6 space-y-3 lg:col-span-1">
          <h3 className="font-heading font-bold text-white text-sm pb-2 border-b border-slate-800">
            Available Endpoints
          </h3>

          <button
            onClick={() => setSelectedEndpoint('rates')}
            className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
              selectedEndpoint === 'rates'
                ? 'bg-blue-600/30 border border-blue-500 text-white'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between font-mono">
              <span className="text-emerald-400 font-bold">POST</span>
              <span className="text-[10px] text-slate-500">/rates</span>
            </div>
            <div className="font-sans font-semibold text-white mt-1">Multi-Courier Rate Calculator</div>
          </button>

          <button
            onClick={() => setSelectedEndpoint('track')}
            className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
              selectedEndpoint === 'track'
                ? 'bg-blue-600/30 border border-blue-500 text-white'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between font-mono">
              <span className="text-blue-400 font-bold">GET</span>
              <span className="text-[10px] text-slate-500">/track/:awb</span>
            </div>
            <div className="font-sans font-semibold text-white mt-1">Live 10-Stage Audit Trail</div>
          </button>

          <button
            onClick={() => setSelectedEndpoint('create')}
            className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
              selectedEndpoint === 'create'
                ? 'bg-blue-600/30 border border-blue-500 text-white'
                : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center justify-between font-mono">
              <span className="text-emerald-400 font-bold">POST</span>
              <span className="text-[10px] text-slate-500">/shipments</span>
            </div>
            <div className="font-sans font-semibold text-white mt-1">Create AWB & Dispatch Request</div>
          </button>
        </div>

        {/* Right 2 Columns: Code & Live Playground */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Terminal size={18} className="text-blue-400" />
              <h3 className="font-heading font-bold text-white text-base">Request Preview & Live Runner</h3>
            </div>
            <button
              onClick={handleTestApi}
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30 cursor-pointer"
            >
              <Play size={13} />
              <span>{testing ? 'Executing...' : 'Run Live Request'}</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => copyCode(codeSnippets[selectedEndpoint])}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy cURL'}</span>
            </button>
            <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed border border-slate-800">
              {codeSnippets[selectedEndpoint]}
            </pre>
          </div>

          {testResponse && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} />
                <span>Live Response (Status: 200 OK)</span>
              </span>
              <pre className="bg-slate-950 p-4 rounded-2xl text-xs font-mono text-emerald-300 max-h-64 overflow-y-auto border border-emerald-500/30">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiDocs;
