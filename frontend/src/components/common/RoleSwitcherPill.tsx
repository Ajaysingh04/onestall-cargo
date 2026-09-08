import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldAlert,
  Store,
  Building2,
  Bike,
  Layers,
  ShoppingBag,
  Truck,
  ChevronUp,
  X,
  Sparkles,
} from 'lucide-react';
import { switchDemoRole } from '../../slices/authSlice';
import type { RootState } from '../../store/store';

const RoleSwitcherPill: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const handleRoleSelect = (roleKey: string, targetPath: string) => {
    dispatch(switchDemoRole(roleKey as any));
    setIsOpen(false);
    navigate(targetPath);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#131921] hover:bg-[#232f3e] text-white border border-[#f3a847]/60 px-3.5 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
          title="Switch PRD Role Portal"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300">View as:</span>
          <span className="text-[#f3a847] capitalize">{userInfo?.role?.replace('_', ' ') || 'Admin'}</span>
          <ChevronUp size={14} className="text-slate-400" />
        </button>
      ) : (
        <div className="bg-[#1e293b] border border-slate-700 text-white rounded-2xl shadow-2xl p-4 w-72 space-y-3 animate-in zoom-in-95 text-xs">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div>
              <p className="font-bold text-[#f3a847] text-xs">PRD Roles &amp; Portals</p>
              <p className="text-[10px] text-slate-400">Switch perspective to test portal</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
              <X size={16} />
            </button>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => handleRoleSelect('customer', '/')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer"
            >
              <ShoppingBag size={16} className="text-cyan-400" />
              <div>
                <div className="font-bold text-white">Amazon Marketplace</div>
                <div className="text-[10px] text-slate-400">Shop, cart &amp; 2-3 day delivery</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('seller', '/seller')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer"
            >
              <Store size={16} className="text-amber-400" />
              <div>
                <div className="font-bold text-white">Seller / Vendor Portal</div>
                <div className="text-[10px] text-slate-400">Storefront, catalog, payouts</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('franchise', '/franchise')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer"
            >
              <Building2 size={16} className="text-blue-400" />
              <div>
                <div className="font-bold text-white">Franchise Centre Panel</div>
                <div className="text-[10px] text-slate-400">Riders, hub stock, margins</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('rider', '/rider')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer"
            >
              <Bike size={16} className="text-emerald-400" />
              <div>
                <div className="font-bold text-white">Delivery Rider App</div>
                <div className="text-[10px] text-slate-400">Digital POD &amp; OTP signature</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('warehouse', '/warehouse')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer"
            >
              <Layers size={16} className="text-purple-400" />
              <div>
                <div className="font-bold text-white">Warehouse WMS Hubs</div>
                <div className="text-[10px] text-slate-400">Line-haul manifest tracking</div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSelect('super_admin', '/admin')}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer"
            >
              <ShieldAlert size={16} className="text-red-400" />
              <div>
                <div className="font-bold text-white">Super Admin Operations</div>
                <div className="text-[10px] text-slate-400">Network GMV, courier comparison</div>
              </div>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/cargo');
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-700 text-left cursor-pointer border-t border-slate-700/60 pt-2"
            >
              <Truck size={16} className="text-[#f3a847]" />
              <div>
                <div className="font-bold text-white">OneStall Cargo B2B</div>
                <div className="text-[10px] text-slate-400">Track AWB &amp; Rate engine</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleSwitcherPill;
