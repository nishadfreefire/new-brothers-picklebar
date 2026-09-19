import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  Globe, 
  X, 
  Menu, 
  Home, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight,
  Headphones,
  Lock,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { navigateTo, useRoute } from '../utils/router';

export const Header: React.FC = () => {
  const { 
    cartItemCount, 
    cartSubtotal, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    filters, 
    setFilters,
    products,
    settings
  } = useStore();
  
  const { lang, setLang, t } = useLanguage();
  const route = useRoute();
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Instant preview items matching search query
  const searchResults = filters.searchQuery.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.banglaName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleNavClick = (target: string, sectionId?: string) => {
    setMobileMenuOpen(false);
    if (sectionId) {
      if (route.page !== 'home') {
        navigateTo('/');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigateTo(target);
    }
  };

  const navItems = [
    {
      id: 'home',
      label: { bn: 'হোম', en: 'Home' },
      icon: Home,
      action: () => handleNavClick('/'),
      isActive: route.page === 'home'
    },
    {
      id: 'about',
      label: { bn: 'আমাদের গল্প', en: 'About Us' },
      icon: BookOpen,
      action: () => handleNavClick('/about'),
      isActive: route.page === 'about'
    },
    {
      id: 'craft',
      label: { bn: 'প্রস্তুত প্রণালী', en: 'Making Process' },
      icon: ShieldCheck,
      action: () => handleNavClick('/craft'),
      isActive: route.page === 'craft'
    }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
        {/* Top Announcement Bar */}
        {showAnnouncement && settings?.showAnnouncement && (
          <div className="bg-[#5C3826] text-white text-xs py-1.5 px-3 sm:px-4 font-medium relative flex items-center justify-between shadow-xs">
            <div className="container mx-auto flex items-center justify-center gap-2 text-center">
              <span className="inline-flex items-center gap-1.5 text-white font-semibold text-[11px] sm:text-xs">
                <Tag className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{settings.announcementBanner || '⚡ স্পেশাল অফার: সারা দেশে দ্রুত হোম ডেলিভারি! Use Code: PICKLE10'}</span>
              </span>
            </div>
            <button 
              onClick={() => setShowAnnouncement(false)}
              className="text-white/80 hover:text-white p-0.5 cursor-pointer ml-2"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Header Bar */}
        <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-20 gap-1.5 sm:gap-4">
            
            {/* Left: Hamburger Button + Logo */}
            <div className="flex items-center gap-1 sm:gap-3 min-w-0">
              <button
                id="header-menu-toggle-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="p-1.5 -ml-1 rounded-xl text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer shrink-0"
                aria-label="Toggle navigation menu"
                title="Open Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-stone-800" />
              </button>

              {/* Brand Logo */}
              <div 
                className="flex items-center cursor-pointer select-none truncate" 
                onClick={() => navigateTo('/')}
              >
                <Logo size="md" />
              </div>
            </div>

            {/* Center: Minimalist Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.action}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    item.isActive
                      ? 'bg-[#FAF6F0] text-[#5C3826] font-bold border border-[#E8DCCF]'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                  }`}
                >
                  {item.label[lang]}
                </button>
              ))}
            </nav>

            {/* Right Action Items */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {/* Desktop Search Bar */}
              <div className="hidden md:block relative w-44 lg:w-56 xl:w-64">
                <input
                  id="main-search-input"
                  type="text"
                  value={filters.searchQuery}
                  onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-8 pr-7 py-1.5 lg:py-2 bg-stone-50 border border-stone-200 rounded-full text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#5C3826] focus:border-transparent transition-all shadow-2xs"
                />
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}

                {/* Dropdown Live Search Results */}
                {isSearchFocused && filters.searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-2 border-b border-stone-100 text-[10px] font-semibold text-stone-500 uppercase tracking-wider px-3">
                      Matching Pickles ({searchResults.length})
                    </div>
                    <div className="divide-y divide-stone-100">
                      {searchResults.map(prod => (
                        <div
                          key={prod.id}
                          onMouseDown={() => navigateTo(`/product/${prod.id}`)}
                          className="p-2.5 flex items-center gap-3 hover:bg-[#FAF6F0] cursor-pointer transition-colors"
                        >
                          <img src={prod.imageUrl} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-[#E8DCCF]" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-stone-900 truncate">
                              {lang === 'bn' ? prod.banglaName : prod.name}
                            </div>
                            <div className="text-[11px] text-stone-500 truncate">
                              {prod.tagline}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#5C3826]">৳{prod.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-1.5 rounded-full text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Toggle search"
              >
                <Search className="w-4.5 h-4.5 text-stone-700" />
              </button>

              {/* Language Switcher */}
              <button
                id="lang-toggle-btn"
                onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}
                className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-full text-xs font-bold border border-stone-200 bg-white text-stone-800 hover:bg-[#FAF6F0] hover:border-[#DFCBB8] transition-colors shadow-2xs cursor-pointer"
                title="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#5C3826]" />
                <span className="text-[11px] sm:text-xs">{lang === 'bn' ? 'EN' : 'বাং'}</span>
              </button>

              {/* Real-time Order Tracking Trigger */}
              <button
                id="track-order-header-btn"
                onClick={() => setIsTrackingOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#FAF6F0] hover:bg-[#F2E8DC] text-[#5C3826] border border-[#DFCBB8] transition-colors cursor-pointer"
                title="Track Order"
              >
                <Truck className="w-3.5 h-3.5 text-[#5C3826]" />
                <span className="hidden lg:inline">{t('nav.trackOrder')}</span>
              </button>

              {/* Top Shopping Cart Button (Mobile & Desktop) */}
              <button
                id="cart-drawer-toggle-btn"
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#5C3826] hover:bg-[#432818] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all transform active:scale-95 cursor-pointer shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-white" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#15803D] text-white text-[9px] sm:text-[10px] font-extrabold w-4 sm:w-4.5 h-4 sm:h-4.5 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75 duration-200">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="font-extrabold">৳{cartSubtotal}</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Input dropdown */}
          {mobileSearchOpen && (
            <div className="pb-3 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="relative w-full">
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  placeholder={t('search.placeholder')}
                  className="w-full pl-9 pr-9 py-2 bg-stone-50 border border-stone-300 rounded-full text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#5C3826]"
                  autoFocus
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                {filters.searchQuery && (
                  <button
                    onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================== */}
      {/* OPAQUE, HIGH-CONTRAST SLIDE-IN DRAWER (Mobile & Desktop)   */}
      {/* ========================================================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          {/* Solid Dark Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Fully Opaque Drawer Content Panel */}
          <div className="fixed inset-y-0 left-0 w-[300px] sm:w-[320px] max-w-[85vw] bg-[#FAF9F6] border-r border-stone-300 shadow-2xl flex flex-col justify-between z-[101] animate-in slide-in-from-left duration-300">
            
            {/* Header section of Drawer */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white shadow-2xs">
                <Logo size="sm" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Navigation Items (Clean Solid White Cards) */}
              <div className="p-4 space-y-2.5">
                <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-1">
                  মেন্যু নেভিগেশন (Navigation)
                </div>

                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all cursor-pointer bg-white border ${
                        item.isActive
                          ? 'border-[#5C3826] ring-1 ring-[#5C3826] text-[#5C3826] bg-[#FAF6F0]'
                          : 'border-stone-200 text-stone-800 hover:border-stone-400 hover:bg-stone-50 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.isActive ? 'bg-[#5C3826] text-white' : 'bg-stone-100 text-[#5C3826]'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-bold">{item.label[lang]}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400" />
                    </button>
                  );
                })}

                {/* Real-time Order Tracking in Drawer */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsTrackingOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold text-stone-800 bg-white border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all shadow-2xs cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-amber-100 text-amber-900">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold">{lang === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>

            {/* Bottom Actions & Support inside Drawer */}
            <div className="p-4 border-t border-stone-200 bg-white space-y-3 shadow-lg">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsCartOpen(true);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-98 transition-transform"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'bn' ? `কার্ট ও অর্ডার দেখুন (৳${cartSubtotal})` : `View Cart (৳${cartSubtotal})`}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-600 pt-1 border-t border-stone-100">
                <span className="flex items-center gap-1 font-medium">
                  <Headphones className="w-3.5 h-3.5 text-[#5C3826]" />
                  <span>01700-000000</span>
                </span>
                <span className="font-bold text-[#15803D] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">১০০% খাঁটি আচার</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};


