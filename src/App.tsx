import React from 'react';
import { Header } from './components/Header';
import { HeaderImageSlider } from './components/HeaderImageSlider';
import { TrustBadges } from './components/TrustBadges';
import { TasteFilterBar } from './components/TasteFilterBar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ComboBundleBuilder } from './components/ComboBundleBuilder';
import { ReviewsSection } from './components/ReviewsSection';
import { AboutUsPage } from './pages/AboutUsPage';
import { CraftProcessPage } from './pages/CraftProcessPage';
import { Footer } from './components/Footer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { CartToastNotification } from './components/CartToastNotification';
import { StickyBottomBar } from './components/StickyBottomBar';
import { StoreContext, StoreProvider, useStore } from './context/StoreContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { useRoute } from './utils/router';
import { Flame, RefreshCw } from 'lucide-react';

function AppContent() {
  const { filteredProducts, products, isLoadingProducts, setIsCartOpen, cartItemCount } = useStore();
  const { lang } = useLanguage();
  const route = useRoute();

  // 1. Dedicated Admin Route (/admin)
  if (route.page === 'admin') {
    return <AdminDashboard isStandalonePage={true} />;
  }

  // 2. Dedicated Single Product Page (/product/:id)
  if (route.page === 'product') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col font-sans selection:bg-[#E07A24] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <ProductDetailPage productId={route.productId} />
        </main>
        <Footer />

        {/* Global Sticky Bottom Bar */}
        <StickyBottomBar />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
      </div>
    );
  }

  // 3. Dedicated About Us Page (/about)
  if (route.page === 'about') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col font-sans selection:bg-[#5C3826] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <AboutUsPage />
        </main>
        <Footer />
        <StickyBottomBar />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
      </div>
    );
  }

  // 4. Dedicated Craft & Making Process Page (/craft)
  if (route.page === 'craft') {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col font-sans selection:bg-[#5C3826] selection:text-white pb-16 sm:pb-0">
        <Header />
        <main className="flex-1 w-full">
          <CraftProcessPage />
        </main>
        <Footer />
        <StickyBottomBar />
        <CartDrawer />
        <CheckoutModal />
        <OrderTrackingModal />
      </div>
    );
  }

  // 5. Homepage Storefront (/)
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1917] flex flex-col font-sans selection:bg-[#5C3826] selection:text-white pb-16 sm:pb-0">
      {/* Top Header */}
      <Header />

      {/* Header Image Slider */}
      <HeaderImageSlider />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 sm:py-8 space-y-12 sm:space-y-16">
        
        {/* Pickle Showcase & Interactive Filters Section */}
        <section id="products-section" className="space-y-5 sm:space-y-6 scroll-mt-24">
          
          {/* Section Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6F0] text-[#5C3826] text-xs font-bold uppercase tracking-wider mb-2 border border-[#E8DCCF]">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{lang === 'bn' ? 'আমাদের সেরা ১৫টি খাঁটি আচার' : 'Artisanal 15 Pickle Collection'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 font-serif tracking-tight">
                {lang === 'bn' ? 'খাঁটি স্বাদের ঘরে তৈরি আচার' : 'Handcrafted Traditional Pickles'}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                {lang === 'bn'
                  ? 'রাজশাহী, বগুড়া ও সিলেটের খাঁটি উপাদানে তৈরি। কোনো কেমিক্যাল প্রিজারভেটিভ নেই।'
                  : 'Made with cold-pressed mustard oil, organic fruits, and whole spices.'}
              </p>
            </div>

            {/* Product Counter Badge */}
            <div className="text-xs font-semibold text-stone-600 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs self-start sm:self-auto">
              Showing <strong className="text-[#5C3826]">{filteredProducts.length}</strong> of {products.length} Pickles
            </div>
          </div>

          {/* Taste & Category Filter Bar */}
          <TasteFilterBar />

          {/* Products Grid - 2 columns on phone view, smooth & responsive */}
          {isLoadingProducts && products.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#5C3826] animate-spin mx-auto" />
              <p className="text-sm font-semibold text-stone-800">Loading fresh pickles...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
              <div className="text-3xl">🥒</div>
              <h3 className="text-base font-bold text-stone-900">
                {lang === 'bn' ? 'এই ফিল্টারে কোনো আচার পাওয়া যায়নি' : 'No Pickles Found for this Filter'}
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try selecting a different taste profile or search keyword to discover more delicious flavors.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 1. 3-Jar Custom Combo Bundle Builder */}
        <div id="combo-section" className="scroll-mt-24">
          <ComboBundleBuilder />
        </div>

        {/* 2. 4 Trust & Quality Pillars (Image 1 - Now placed below combo builder) */}
        <div id="trust-section" className="scroll-mt-24">
          <TrustBadges />
        </div>

        {/* 3. Customer Reviews & Social Proof */}
        <ReviewsSection />

      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Bottom Quick Bar for Mobile */}
      <StickyBottomBar />

      {/* Cart Toast Notification */}
      <CartToastNotification />

      {/* Modals and Drawers */}
      <ProductQuickViewModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
    </div>
  );
}

export function App() {
  const store = React.useContext(StoreContext);
  if (!store) {
    return (
      <LanguageProvider>
        <StoreProvider>
          <AppContent />
        </StoreProvider>
      </LanguageProvider>
    );
  }
  return <AppContent />;
}

export default App;
