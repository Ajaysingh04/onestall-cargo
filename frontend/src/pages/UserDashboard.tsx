import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Heart, MapPin, Bell, LogOut, Wallet, Award, Users, CornerUpLeft, ArrowRight, Star } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { logout } from '../slices/authSlice';

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/auth');
    }
  }, [navigate, userInfo]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <h2 className="text-3xl font-serif font-bold mb-8">Welcome back, {userInfo?.name.split(' ')[0]}</h2>
          
          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <GlassCard intensity="light" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-muted uppercase tracking-widest text-xs">Reward Points</h3>
                  <p className="text-2xl font-bold font-serif">12,450</p>
                </div>
              </div>
              <div className="w-full bg-border h-2 rounded-full overflow-hidden">
                <div className="bg-accent h-full w-[60%]"></div>
              </div>
              <p className="text-xs text-muted mt-2">2,550 points away from Platinum Tier</p>
            </GlassCard>

            <GlassCard intensity="light" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <Wallet size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-muted uppercase tracking-widest text-xs">Store Credit</h3>
                  <p className="text-2xl font-bold font-serif">₹4,200</p>
                </div>
              </div>
              <button className="text-sm font-medium uppercase tracking-widest hover:text-accent transition-colors flex items-center gap-2">
                View Wallet <ArrowRight size={14} />
              </button>
            </GlassCard>

            <GlassCard intensity="light" className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-muted uppercase tracking-widest text-xs">Referrals</h3>
                  <p className="text-2xl font-bold font-serif">3 Joined</p>
                </div>
              </div>
              <button className="text-sm font-medium uppercase tracking-widest hover:text-purple-500 transition-colors flex items-center gap-2">
                Invite Friends <ArrowRight size={14} />
              </button>
            </GlassCard>
          </div>

          <h3 className="text-2xl font-serif font-bold mb-6">Recent Orders</h3>
          <div className="space-y-6">
            {[1, 2].map((order) => (
              <GlassCard key={order} intensity="light" className="p-6">
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border/50 pb-4 mb-4 text-sm">
                  <div>
                    <span className="text-muted">Order Number:</span> <span className="font-medium">#ORD-{98234 + order}</span>
                  </div>
                  <div>
                    <span className="text-muted">Date:</span> <span className="font-medium">Oct {12 - order}, 2026</span>
                  </div>
                  <div>
                    <span className="text-muted">Status:</span> 
                    <span className={`inline-block ml-2 px-3 py-1 rounded-full text-xs font-bold ${order === 1 ? 'bg-green-500/10 text-green-600' : 'bg-blue-500/10 text-blue-600'}`}>
                      {order === 1 ? 'Delivered' : 'In Transit'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted">Total:</span> <span className="font-medium">₹{(4500 + order*500).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-6 items-center">
                  <img src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop&sig=${order}`} alt="Item" className="w-24 h-32 object-cover rounded-md" />
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-1">Premium Silk Midi Dress</h3>
                    <p className="text-sm text-muted mb-4">Size: M | Color: Midnight Black</p>
                    <div className="flex gap-4">
                      {order === 1 ? (
                        <>
                          <button className="text-sm font-medium border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors flex items-center gap-2">
                            <Star size={16} /> Write Review
                          </button>
                          <button className="text-sm font-medium border border-border px-4 py-2 hover:border-red-500 hover:text-red-500 transition-colors flex items-center gap-2">
                            <CornerUpLeft size={16} /> Return Item
                          </button>
                        </>
                      ) : (
                        <button className="text-sm font-medium border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors">
                          Track Package
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      );
    }
    
    // Placeholder for other tabs
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-muted">
        <h2 className="text-2xl font-serif mb-4 capitalize">{activeTab}</h2>
        <p>This section is currently under development for Phase 3.</p>
      </motion.div>
    );
  };

  if (!userInfo) return null;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="lg:w-1/4">
          <GlassCard intensity="medium" className="p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-xl font-serif font-bold shadow-lg">
                {userInfo?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-bold text-xl">{userInfo?.name}</h2>
                <p className="text-sm text-muted">{userInfo?.email}</p>
                <div className="mt-1 inline-flex items-center gap-1 bg-yellow-500/20 text-yellow-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Star size={10} fill="currentColor" /> Gold Member
                </div>
              </div>
            </div>

            <nav className="space-y-1">
              {userInfo?.isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center gap-3 p-3 rounded-md transition-all font-medium text-left bg-gradient-to-r from-accent/20 to-transparent text-accent hover:bg-accent/30 border border-accent/20 mb-4"
                >
                  <Package size={20} /> Go to Admin Panel
                </button>
              )}
              {[
                { id: 'overview', icon: <Package size={20} />, label: 'Overview & Orders' },
                { id: 'wishlist', icon: <Heart size={20} />, label: 'Wishlist' },
                { id: 'returns', icon: <CornerUpLeft size={20} />, label: 'Returns & Refunds' },
                { id: 'wallet', icon: <Wallet size={20} />, label: 'Store Credit' },
                { id: 'rewards', icon: <Award size={20} />, label: 'Loyalty Rewards' },
                { id: 'referrals', icon: <Users size={20} />, label: 'Refer a Friend' },
                { id: 'addresses', icon: <MapPin size={20} />, label: 'Addresses' },
                { id: 'notifications', icon: <Bell size={20} />, label: 'Notifications' },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-md transition-all font-medium text-left ${activeTab === item.id ? 'bg-accent/10 text-accent' : 'text-muted hover:bg-surface hover:text-foreground'}`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              
              <div className="pt-4 mt-4 border-t border-border/50">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 rounded-md transition-colors font-medium text-left"
                >
                  <LogOut size={20} /> Sign Out
                </button>
              </div>
            </nav>
          </GlassCard>
        </aside>

        {/* Content */}
        <main className="lg:w-3/4">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
