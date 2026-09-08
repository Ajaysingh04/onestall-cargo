import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { Loader2 } from 'lucide-react';

// Lazy load pages for fast code-splitting
const Home = lazy(() => import('./pages/Home'));
const CargoPortal = lazy(() => import('./pages/CargoPortal'));
const SellerPortal = lazy(() => import('./pages/SellerPortal'));
const FranchisePortal = lazy(() => import('./pages/FranchisePortal'));
const RiderApp = lazy(() => import('./pages/RiderApp'));
const WarehousePortal = lazy(() => import('./pages/WarehousePortal'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Auth = lazy(() => import('./pages/Auth'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

const PageLoader = () => (
  <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-3">
    <Loader2 className="animate-spin text-blue-500" size={42} />
    <span className="text-xs text-slate-400 font-mono tracking-wider uppercase">Loading OneStall Platform...</span>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Role-Based Enterprise Portals (Standalone Full-Screen UI) */}
          <Route path="/seller" element={<SellerPortal />} />
          <Route path="/franchise" element={<FranchisePortal />} />
          <Route path="/rider" element={<RiderApp />} />
          <Route path="/warehouse" element={<WarehousePortal />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Main Layout Wrapping Customer/E-Commerce Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            
            {/* OneStall Cargo Dedicated B2B & Tracking Routes */}
            <Route path="cargo" element={<CargoPortal />} />
            <Route path="track" element={<CargoPortal />} />
            <Route path="track/:awb" element={<CargoPortal />} />

            {/* Developer API Docs */}
            <Route path="developer/api" element={<ApiDocs />} />

            {/* Marketplace Shopping Flow */}
            <Route path="products" element={<ProductList />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="auth" element={<Auth />} />
            <Route path="login" element={<Auth />} />
            <Route path="signin" element={<Auth />} />
            <Route path="register" element={<Auth />} />
            <Route path="signup" element={<Auth />} />
            <Route path="dashboard" element={<UserDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
