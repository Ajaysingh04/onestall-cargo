import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Store,
  TrendingUp,
  Package,
  Clock,
  Sparkles,
  Plus,
  ArrowUpRight,
  AlertTriangle,
  Truck,
  CheckCircle2,
  DollarSign,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

const SellerPortal: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // AI Listing Form State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('Fashion');
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [productSaved, setProductSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes] = await Promise.all([
        axios.get('/api/sellers/stats'),
        axios.get('/api/products'),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const { data } = await axios.post('/api/sellers/ai-generate', {
        keyword: aiPrompt,
        category: aiCategory,
      });
      setGeneratedForm(data);
      setProductSaved(false);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublishListing = async () => {
    if (!generatedForm) return;
    try {
      await axios.post('/api/products', {
        name: generatedForm.title,
        brand: 'Apex Craft',
        category: generatedForm.category,
        description: generatedForm.description,
        price: generatedForm.suggestedPrice,
        countInStock: 25,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
        sku: generatedForm.sku,
        hsn: generatedForm.hsn,
        gstRate: generatedForm.gstRate,
        weight: generatedForm.weight,
        dimensions: generatedForm.dimensions,
        commissionRate: generatedForm.category === 'FMCG' ? 5 : 10,
        sellerName: 'Apex Retailers Private Limited',
      });
      setProductSaved(true);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Seller Header */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-amber-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Store size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-heading font-black text-white">Apex Retailers Mini-Store</h1>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                KYC Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">
              GSTIN: 07AAAAA0000A1Z5 • Integrated with OneStall Cargo Hub Delhi NCR
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Sparkles size={16} />
            <span>AI Listing Assistant</span>
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Gross Merchandise Value</span>
            <DollarSign size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            ₹{stats?.grossSales?.toLocaleString('en-IN') || '42,350'}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1">
            <ArrowUpRight size={13} />
            <span>+18.4% this week</span>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Net Seller Payout (After Cut)</span>
            <TrendingUp size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            ₹{stats?.netEarnings?.toLocaleString('en-IN') || '38,962'}
          </div>
          <div className="text-[10px] text-slate-400">
            Category commission: 5% - 10% applied
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Pending Cargo Dispatch</span>
            <Truck size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            {stats?.pendingOrders || 3} Orders
          </div>
          <div className="text-[11px] text-amber-400">Auto-assigned to OneStall Cargo</div>
        </div>

        <div className="glass-card rounded-2xl p-5 space-y-2 border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Catalog Stock Health</span>
            <Package size={16} className="text-purple-400" />
          </div>
          <div className="text-2xl font-heading font-black text-white">
            {products.length} Products
          </div>
          <div className="text-[11px] text-slate-400">
            {stats?.lowStockCount || 0} items low in stock
          </div>
        </div>
      </div>

      {/* AI Listing Generator & Catalog Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: AI-Assisted Product Listing (PRD 5.20) */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-1 space-y-5 border-blue-500/30">
          <div className="space-y-1 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-400" size={18} />
              <h3 className="font-heading font-bold text-white text-base">
                AI Listing Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              PRD 5.20: Auto-generate title, description, tags, HSN, and SEO fields from keywords.
            </p>
          </div>

          <form onSubmit={handleGenerateAiListing} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">
                Product Concept / Short Keywords
              </label>
              <textarea
                rows={3}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Ultra-breathable running sneakers with high grip memory foam sole"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 text-xs"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Category</label>
              <select
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
              >
                <option value="Fashion">Fashion (10% Comm)</option>
                <option value="Electronics">Electronics (10% Comm)</option>
                <option value="FMCG">FMCG (5% Comm)</option>
                <option value="Beauty">Beauty (10% Comm)</option>
                <option value="Home & Kitchen">Home & Kitchen (10% Comm)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {aiLoading ? <Clock className="animate-spin" size={16} /> : <Sparkles size={16} />}
              <span>Generate AI Optimized Listing</span>
            </button>
          </form>

          {/* AI Result Card */}
          {generatedForm && (
            <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 space-y-3 animate-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span>AI Generated Specifications</span>
                <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded">Ready</span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Optimized Title:</span>
                <div className="text-white font-semibold">{generatedForm.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400">SKU:</span>
                  <span className="text-white font-mono block">{generatedForm.sku}</span>
                </div>
                <div>
                  <span className="text-slate-400">HSN Code:</span>
                  <span className="text-white font-mono block">{generatedForm.hsn}</span>
                </div>
                <div>
                  <span className="text-slate-400">Suggested Price:</span>
                  <span className="text-emerald-400 font-bold block">₹{generatedForm.suggestedPrice}</span>
                </div>
                <div>
                  <span className="text-slate-400">Discount:</span>
                  <span className="text-white block">{generatedForm.discountPercent}% OFF</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block">Description:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                  {generatedForm.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={handlePublishListing}
                  disabled={productSaved}
                  className={`w-full py-2 rounded-xl font-bold transition-all ${
                    productSaved
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                  }`}
                >
                  {productSaved ? '✓ Published to Marketplace!' : 'Publish to Catalog'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 2 Columns: Product Catalog Table */}
        <div className="glass-card rounded-3xl p-6 lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-white text-base">Store Catalog & Inventory</h3>
              <p className="text-xs text-slate-400">Manage your products and OneStall Cargo pickup requests</p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-xl">
              {products.length} Active Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Logistics Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-white truncate max-w-xs">{prod.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{prod.sku || 'OS-SKU'}</div>
                      </div>
                    </td>
                    <td className="p-3 text-slate-300">{prod.category}</td>
                    <td className="p-3 font-semibold text-white">₹{prod.price}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        prod.countInStock <= 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {prod.countInStock} units
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        Approved
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`OneStall Cargo pickup scheduled for ${prod.name}! AWB manifest queued.`)}
                        className="bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Truck size={12} />
                        <span>Request Pickup</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPortal;
