import React from 'react';
import { Home, Search, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BottomNavProps {
  onOpenSearch: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ onOpenSearch }) => {
  const location = useLocation();

  const navItems = [
    { id: 'home', icon: <Home size={24} strokeWidth={1.5} />, label: 'Home', path: '/' },
    { id: 'search', icon: <Search size={24} strokeWidth={1.5} />, label: 'Search', action: onOpenSearch },
    { id: 'wishlist', icon: <Heart size={24} strokeWidth={1.5} />, label: 'Wishlist', path: '/wishlist' },
    { id: 'profile', icon: <User size={24} strokeWidth={1.5} />, label: 'Profile', path: '/dashboard' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-border z-40 md:hidden pb-safe flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = item.path ? location.pathname === item.path : false;
        
        return item.path ? (
          <Link
            key={item.id}
            to={item.path}
            className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${isActive ? 'text-foreground' : 'text-muted hover:text-foreground'}`}
          >
            <div className="relative">
              {item.icon}
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-foreground rounded-full"
                />
              )}
            </div>
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </Link>
        ) : (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center justify-center w-16 h-full gap-1 text-muted hover:text-foreground transition-colors"
          >
            {item.icon}
            <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
