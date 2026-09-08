import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050914] border-t border-slate-800 text-slate-400 mt-auto pt-16 pb-12 text-xs">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Logistics Engine */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Truck size={20} />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-heading font-black text-white">OneStall</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                  Cargo
                </span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              India's first unified platform combining an Amazon/AJIO-style multi-vendor marketplace with OneStall Cargo — our in-house franchise-based logistics network and multi-courier aggregator.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>100% Genuine</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Truck size={16} className="text-blue-400" />
                <span>24-Hour Metro SLA</span>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Marketplace</h4>
            <ul className="space-y-2">
              <li><Link to="/?category=Fashion" className="hover:text-white transition-colors">Fashion &amp; Footwear</Link></li>
              <li><Link to="/?category=Electronics" className="hover:text-white transition-colors">Electronics &amp; Mobiles</Link></li>
              <li><Link to="/?category=Laptops" className="hover:text-white transition-colors">Laptops &amp; Computing</Link></li>
              <li><Link to="/?category=Audio" className="hover:text-white transition-colors">Audio &amp; Wearables</Link></li>
              <li><Link to="/?category=Home%20%26%20Kitchen" className="hover:text-white transition-colors">Home &amp; Kitchen</Link></li>
            </ul>
          </div>

          {/* Col 3: OneStall Cargo Logistics */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">OneStall Cargo (B2B)</h4>
            <ul className="space-y-2">
              <li><Link to="/cargo?tab=track" className="hover:text-white transition-colors">Track AWB Number</Link></li>
              <li><Link to="/cargo?tab=rates" className="hover:text-white transition-colors">Courier Rate Calculator</Link></li>
              <li><Link to="/cargo?tab=book" className="hover:text-white transition-colors">Book Standalone Parcel</Link></li>
              <li><Link to="/developer/api" className="hover:text-white transition-colors">B2B Cargo REST API</Link></li>
              <li><Link to="/warehouse" className="hover:text-white transition-colors">Hub Line-Haul Movement</Link></li>
            </ul>
          </div>

          {/* Col 4: Platform Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Enterprise Portals</h4>
            <ul className="space-y-2">
              <li><Link to="/admin" className="text-red-400 hover:text-red-300 font-medium">Super Admin Console</Link></li>
              <li><Link to="/seller" className="text-amber-400 hover:text-amber-300 font-medium">Seller / Vendor Portal</Link></li>
              <li><Link to="/franchise" className="text-blue-400 hover:text-blue-300 font-medium">Franchise Centre Panel</Link></li>
              <li><Link to="/rider" className="text-emerald-400 hover:text-emerald-300 font-medium">Delivery Rider Mobile App</Link></li>
              <li><Link to="/warehouse" className="text-purple-400 hover:text-purple-300 font-medium">Warehouse Management</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© 2026 OneStall Technologies India Private Limited. All rights reserved.</p>
          <p>Multi-Vendor Marketplace + OneStall Cargo Franchise Network</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
