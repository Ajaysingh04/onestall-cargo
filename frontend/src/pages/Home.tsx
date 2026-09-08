import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../slices/cartSlice';
import {
  Truck,
  ShieldCheck,
  Star,
  Zap,
  ShoppingBag,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  Tag,
} from 'lucide-react';
import AiChatWidget from '../components/common/AiChatWidget';

const CATEGORY_TABS = [
  { id: 'All', name: 'All Departments' },
  { id: 'Electronics', name: 'Mobiles & Tablets' },
  { id: 'Laptops', name: 'Laptops & Computing' },
  { id: 'Fashion', name: 'Fashion & Footwear' },
  { id: 'Audio', name: 'Audio & Wearables' },
  { id: 'Home & Kitchen', name: 'Home & Kitchen' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const urlSearch = searchParams.get('search');

  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'All');
  const [loading, setLoading] = useState(true);

  // Banner slider state
  const [bannerIndex, setBannerIndex] = useState(0);

  const banners = [
    {
      id: 1,
      title: 'MEGA COMPUTING & LAPTOP CARNIVAL',
      subtitle: 'Apple MacBook Air M3, Dell XPS, Gaming Rigs & iPads | Up to 35% Off with No Cost EMI',
      badge: 'FREE 2-3 Day Delivery with OneStall Cargo',
      bg: 'from-[#0a192f] via-[#172a45] to-[#203a43]',
      img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      actionCategory: 'Laptops',
    },
    {
      id: 2,
      title: 'FLAGSHIP SMARTPHONE FEST',
      subtitle: 'Apple iPhone 16 Pro, Samsung S24 Ultra & OnePlus 12 5G | No Cost EMI & Exchange',
      badge: 'Assured 2-Day Doorstep Fulfillment',
      bg: 'from-[#0f172a] via-[#1e293b] to-[#334155]',
      img: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=1200&q=80',
      actionCategory: 'Electronics',
    },
    {
      id: 3,
      title: 'STEP INTO STYLE | SNEAKERS & JEANS',
      subtitle: 'Nike Air Jordan 1 Low, Puma Softride & Levi’s Denim | Min 40% Off',
      badge: 'Doorstep Try & 7-Day Easy Returns',
      bg: 'from-[#3b185f] via-[#2a0845] to-[#643a6b]',
      img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1200&q=80',
      actionCategory: 'Fashion',
    },
  ];

  useEffect(() => {
    fetchProducts();
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, prod: any) => {
    e.stopPropagation();
    dispatch(addToCart({
      id: prod._id,
      name: prod.name,
      price: prod.price,
      image: prod.image,
      quantity: 1,
      size: 'Standard'
    }));
  };

  // Filtered by selected tab or search query
  const displayedProducts = products.filter((p) => {
    const matchCategory =
      selectedCategory === 'All' ||
      p.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      p.subcategory?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      p.tags?.some((t: string) => t.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchSearch =
      !urlSearch ||
      p.name.toLowerCase().includes(urlSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(urlSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(urlSearch.toLowerCase());

    return matchCategory && matchSearch;
  });

  // Audio & Wearables / Trending Gadgets
  const audioAndGadgetsItems = products.filter(
    (p) =>
      p.subcategory === 'Headphones' ||
      p.subcategory === 'Audio' ||
      p.subcategory === 'Wearables' ||
      p.subcategory === 'Speakers' ||
      p.subcategory === 'Grooming' ||
      p.tags?.some((t: string) => ['audio', 'anc', 'headphones', 'airpods', 'smartwatch', 'speaker', 'trimmer'].includes(t))
  );

  // Electronics items
  const electronicsItems = products.filter((p) => p.category === 'Electronics');

  // Fashion items
  const fashionItems = products.filter((p) => p.category === 'Fashion');

  return (
    <div className="min-h-screen bg-[#eaeded] text-slate-900 font-sans pb-16">
      
      {/* 1. AMAZON PROMO HERO SLIDER */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className={`relative h-[360px] sm:h-[460px] lg:h-[500px] transition-all duration-700 bg-gradient-to-r ${banners[bannerIndex].bg}`}>
          
          {/* Hero Banner Image with Overlay */}
          <img
            src={banners[bannerIndex].img}
            alt="Amazon Banner"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 filter brightness-95"
          />

          {/* Amazon bottom fade into gray background */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#eaeded] via-[#eaeded]/80 to-transparent pointer-events-none" />

          {/* Banner Text Content */}
          <div className="container mx-auto px-4 lg:px-8 h-full flex flex-col justify-center relative z-10 text-white max-w-4xl space-y-3">
            <span className="bg-[#febd69] text-slate-950 text-xs font-black px-3 py-1 rounded w-fit uppercase tracking-wider shadow">
              {banners[bannerIndex].badge}
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight leading-tight">
              {banners[bannerIndex].title}
            </h1>

            <p className="text-slate-100 text-sm sm:text-lg max-w-2xl font-medium drop-shadow">
              {banners[bannerIndex].subtitle}
            </p>

            <div className="pt-2">
              <button
                onClick={() => setSelectedCategory(banners[bannerIndex].actionCategory)}
                className="bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Shop Deals Now</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Left / Right Carousel Controls */}
          <button
            onClick={() => setBannerIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer z-20"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={() => setBannerIndex((prev) => (prev + 1) % banners.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded bg-black/30 hover:bg-black/60 text-white transition-colors cursor-pointer z-20"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </section>

      {/* 2. AMAZON 4-TILE FLOATING CARDS (Sitting over the banner like Amazon.in) */}
      <section className="container mx-auto px-4 lg:px-8 -mt-32 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Laptops & Premium Computing */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-shadow">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg mb-1">
                Laptops &amp; Computing Hub
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Up to 35% off • Delivered in 2-3 Days</p>

              <div className="grid grid-cols-2 gap-2">
                <div onClick={() => setSelectedCategory('Laptops')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80"
                    alt="MacBook Air M3"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">MacBook Air M3</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹1,24,900 (7% off)</p>
                </div>

                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&q=80"
                    alt="OnePlus 12"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">OnePlus 12 5G</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹64,999 (Deal)</p>
                </div>

                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=300&q=80"
                    alt="AirPods Pro 2"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">AirPods Pro 2</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹20,999 (16% off)</p>
                </div>

                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=300&q=80"
                    alt="JBL Flip 6"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">JBL Flip 6 Bass</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹8,999 (36% off)</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('Laptops')}
              className="text-xs text-[#007185] hover:text-[#c45500] font-bold hover:underline mt-4 text-left cursor-pointer"
            >
              See all Computing &amp; Gadgets →
            </button>
          </div>

          {/* Card 2: Smartphones & Audio Deals */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-shadow">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg mb-1">
                Latest Smartphones &amp; Audio
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Apple, Samsung, Sony &amp; Noise</p>

              <div className="grid grid-cols-2 gap-2">
                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=300&q=80"
                    alt="iPhone 16 Pro"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">iPhone 16 Pro</p>
                  <p className="text-[10px] text-slate-900 font-bold">₹1,19,900</p>
                </div>

                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80"
                    alt="Samsung S24"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Galaxy S24 Ultra</p>
                  <p className="text-[10px] text-slate-900 font-bold">₹1,09,999</p>
                </div>

                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80"
                    alt="Sony ANC"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Sony XM5 ANC</p>
                  <p className="text-[10px] text-red-700 font-bold">23% off</p>
                </div>

                <div onClick={() => setSelectedCategory('Electronics')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"
                    alt="Noise Watch"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Noise Pulse 4</p>
                  <p className="text-[10px] text-red-700 font-bold">₹1,499 (70% off)</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('Electronics')}
              className="text-xs text-[#007185] hover:text-[#c45500] font-bold hover:underline mt-4 text-left cursor-pointer"
            >
              See all Mobiles &amp; Audio →
            </button>
          </div>

          {/* Card 3: Footwear & Denim Jeans */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-shadow">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg mb-1">
                Up to 60% off | Styles for Men
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Nike, Puma, Levi's &amp; more</p>

              <div className="grid grid-cols-2 gap-2">
                <div onClick={() => setSelectedCategory('Fashion')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=300&q=80"
                    alt="Air Jordans"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Air Jordan 1 Low</p>
                  <p className="text-[10px] text-slate-900 font-bold">₹8,995</p>
                </div>

                <div onClick={() => setSelectedCategory('Fashion')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=300&q=80"
                    alt="Levis"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Levi's 511 Slim</p>
                  <p className="text-[10px] text-emerald-700 font-bold">50% off</p>
                </div>

                <div onClick={() => setSelectedCategory('Fashion')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80"
                    alt="Puma Shoes"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Puma Softride</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹2,199</p>
                </div>

                <div onClick={() => setSelectedCategory('Fashion')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=300&q=80"
                    alt="Linen Shirt"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Pure Linen Shirt</p>
                  <p className="text-[10px] text-emerald-700 font-bold">45% off</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('Fashion')}
              className="text-xs text-[#007185] hover:text-[#c45500] font-bold hover:underline mt-4 text-left cursor-pointer"
            >
              Explore Fashion Deals →
            </button>
          </div>

          {/* Card 4: Home & Kitchen Appliances */}
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-lg flex flex-col justify-between border border-slate-200 hover:shadow-xl transition-shadow">
            <div>
              <h3 className="font-heading font-black text-slate-900 text-base sm:text-lg mb-1">
                Home, Kitchen &amp; Cookware
              </h3>
              <p className="text-[11px] text-slate-500 mb-3">Prestige, Pigeon &amp; IronCraft</p>

              <div className="grid grid-cols-2 gap-2">
                <div onClick={() => setSelectedCategory('Home & Kitchen')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=300&q=80"
                    alt="Mixer Grinder"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Prestige Iris 750W</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹2,699 (37% off)</p>
                </div>

                <div onClick={() => setSelectedCategory('Home & Kitchen')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1584990347449-399086a9a838?auto=format&fit=crop&w=300&q=80"
                    alt="Non-stick Set"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Pigeon 3-Pc Set</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹1,199 (52% off)</p>
                </div>

                <div onClick={() => setSelectedCategory('Home & Kitchen')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1584990347449-399086a9a838?auto=format&fit=crop&w=300&q=80"
                    alt="Cast Iron"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Cast Iron Skillet</p>
                  <p className="text-[10px] text-slate-900 font-bold">₹1,399</p>
                </div>

                <div onClick={() => setSelectedCategory('Home & Kitchen')} className="cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=300&q=80"
                    alt="Dyson Vacuum"
                    className="h-24 w-full object-cover rounded-lg border border-slate-100"
                  />
                  <p className="text-[11px] font-bold text-slate-800 mt-1 truncate">Dyson V8 Vacuum</p>
                  <p className="text-[10px] text-emerald-700 font-bold">₹29,900 (32% off)</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('Home & Kitchen')}
              className="text-xs text-[#007185] hover:text-[#c45500] font-bold hover:underline mt-4 text-left cursor-pointer"
            >
              See all Home Appliances →
            </button>
          </div>

        </div>
      </section>

      {/* 3. TODAY'S LIGHTNING DEALS (Horizontal Sliding Shelf with Deal Bars) */}
      <section className="container mx-auto px-4 lg:px-8 mt-8">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-heading font-black text-slate-900">Today's Deals</span>
              <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                <Flame size={12} fill="currentColor" />
                <span>Lightning Deals</span>
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">
                Ends in: <strong className="text-slate-900">03h:42m:18s</strong>
              </span>
            </div>

            <button
              onClick={() => setSelectedCategory('All')}
              className="text-xs text-[#007185] hover:text-[#c45500] font-bold hover:underline cursor-pointer"
            >
              See all deals →
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
            {products.slice(0, 6).map((item) => (
              <div
                key={item._id}
                onClick={(e) => handleAddToCart(e, item)}
                className="w-48 flex-shrink-0 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col justify-between cursor-pointer transition-all hover:shadow-md text-left"
              >
                <div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-white mb-2">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded">
                      {item.discount || 30}% off
                    </span>
                    <span className="text-red-700 text-[10px] font-bold">Limited time</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-slate-900">₹{item.price}</span>
                    <span className="text-[10px] text-slate-400 line-through">₹{item.mrp}</span>
                  </div>
                  <p className="text-[11px] text-slate-800 font-bold line-clamp-2 mt-1 leading-tight">
                    {item.name}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                    <div className="bg-[#e47911] h-full rounded-full w-[78%]" />
                  </div>
                  <span className="text-[9px] text-slate-500">78% claimed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING AUDIO, WEARABLES & TECH (Sony XM5, AirPods Pro 2, JBL Flip 6, Noise Pulse 4) */}
      <section className="container mx-auto px-4 lg:px-8 mt-8">
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">🎧</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                    Trending Audio, Wearables &amp; Personal Tech
                  </h2>
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    2-3 Day Delivery
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Sony WH-1000XM5 ANC, Apple AirPods Pro 2, JBL Flip 6 Waterproof &amp; Noise ColorFit
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedCategory('Audio')}
              className="text-xs font-bold text-[#007185] hover:text-[#c45500] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See all {audioAndGadgetsItems.length} audio &amp; gadget deals</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {audioAndGadgetsItems.map((prod) => (
              <div
                key={prod._id}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex flex-col justify-between transition-all hover:shadow-md group text-left"
              >
                <div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-2">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                      {prod.discount || 20}% off
                    </span>
                  </div>

                  <p className="text-[10px] text-blue-700 font-bold uppercase">{prod.brand}</p>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                    {prod.name}
                  </h4>

                  {/* Amazon Star Ratings */}
                  <div className="flex items-center gap-1 text-[11px] text-[#de7921] mt-0.5">
                    <div className="flex text-amber-500 text-xs">
                      {'★'.repeat(Math.floor(prod.rating || 5))}
                    </div>
                    <span className="text-slate-500 text-[10px]">({prod.numReviews || 120})</span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-black text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-[10px] text-slate-400 line-through">₹{prod.mrp.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  {/* Amazon Deal Tag */}
                  <div className="text-[9px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold w-fit mt-1">
                    ✓ Prime Eligible
                  </div>

                  <div className="text-[9px] text-slate-600 mt-1 flex items-center gap-1">
                    <Truck size={10} className="text-[#f3a847]" />
                    <span>FREE 2-3 Day Delivery</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 mt-2">
                  <button
                    onClick={(e) => handleAddToCart(e, prod)}
                    className="w-full bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer shadow-sm text-center"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. DEPARTMENT TABS & FULL CATALOG */}
      <section className="container mx-auto px-4 lg:px-8 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#232f3e] text-white border-transparent shadow'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* 6. RESULTS PRODUCT GRID (Amazon Standard Product Cards) */}
      <section className="container mx-auto px-4 lg:px-8 mt-4">
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h2 className="text-lg sm:text-xl font-heading font-black text-slate-900">
                {selectedCategory === 'All' ? 'Best Sellers in All Departments' : `${selectedCategory} Deals`}
              </h2>
              <p className="text-xs text-slate-500">
                Fulfilled by OneStall Cargo • Doorstep Delivery with OTP Verification
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Showing {displayedProducts.length} Products
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {displayedProducts.map((prod) => (
              <div
                key={prod._id}
                className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-4 flex flex-col justify-between transition-all hover:shadow-md group text-left"
              >
                <div>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white mb-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {prod.featured && (
                      <span className="absolute top-2 left-2 bg-[#232f3e] text-[#f3a847] text-[10px] font-black px-2 py-0.5 rounded shadow">
                        #1 Best Seller
                      </span>
                    )}
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
                      {prod.discount || 20}% off
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{prod.brand}</p>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                      {prod.name}
                    </h3>

                    {/* Amazon Stars */}
                    <div className="flex items-center gap-1 text-xs text-[#de7921]">
                      <div className="flex text-amber-500">
                        {'★'.repeat(Math.floor(prod.rating || 5))}
                      </div>
                      <span className="text-slate-600 text-[11px] font-medium">
                        {prod.rating || 4.8} ({prod.numReviews || 120})
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mt-1">
                      {prod.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 mt-3 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                    {prod.mrp > prod.price && (
                      <span className="text-xs text-slate-400 line-through">M.R.P: ₹{prod.mrp.toLocaleString('en-IN')}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-700">
                    <span className="text-blue-600 font-black italic">✓prime</span>
                    <span>Get it in <strong>2-3 Days</strong></span>
                  </div>
                  <div className="text-[10px] text-slate-500">FREE Delivery by OneStall Cargo</div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={(e) => handleAddToCart(e, prod)}
                      className="flex-1 bg-[#ffd814] hover:bg-[#f7ca00] text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm text-center"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={(e) => { handleAddToCart(e, prod); navigate('/checkout'); }}
                      className="flex-1 bg-[#ffa41c] hover:bg-[#fa8900] text-slate-950 font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer shadow-sm text-center"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER VALUE & SHOPPING ASSURANCE STRIP */}
      <section className="container mx-auto px-4 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#e47911] flex items-center justify-center flex-shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Fast Doorstep Delivery</h4>
              <p className="text-xs text-slate-500">Free delivery on eligible orders across 19,000+ pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Genuine Guarantee</h4>
              <p className="text-xs text-slate-500">Directly sourced with valid manufacturer brand warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">7-Day Easy Replacement</h4>
              <p className="text-xs text-slate-500">Hassle-free doorstep pickup with zero hidden charges</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Pay On Delivery</h4>
              <p className="text-xs text-slate-500">Cash on Delivery, UPI, Cards &amp; No-Cost EMI available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Shopping AI Assistant */}
      <AiChatWidget />
    </div>
  );
};

export default Home;
