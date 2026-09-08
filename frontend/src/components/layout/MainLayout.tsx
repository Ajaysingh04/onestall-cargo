import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import SearchOverlay from './SearchOverlay';

const MainLayout: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="flex-grow pt-20 pb-16 md:pb-0"> {/* pt-20 for fixed header, pb-16 for mobile bottom nav */}
        <Outlet />
      </main>
      <Footer />
      
      <BottomNav onOpenSearch={() => setIsSearchOpen(true)} />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default MainLayout;
