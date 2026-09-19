import React, { useState } from 'react';
import { X, ShieldCheck, Flame, Check, Droplet, Clock, Utensils, Heart, ShoppingBag, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, setIsCheckoutOpen } = useStore();
  const { lang, t } = useLanguage();

  if (!quickViewProduct) return null;

  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(quickViewProduct.defaultVariantIndex || 0);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'pairings'>('details');

  const variant = quickViewProduct.variants[selectedVariantIdx] || quickViewProduct.variants[0];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, variant, quantity);
    setQuickViewProduct(null);
  };

  const handleInstantBuy = () => {
    addToCart(quickViewProduct, variant, quantity);
    setQuickViewProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E6DEC8] overflow-hidden my-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-gray-700 shadow-md transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Big Image & Highlights */}
          <div className="md:col-span-5 bg-[#FAF7F2] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E6DEC8]">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-inner border border-[#E6DEC8]">
                <img
                  src={quickViewProduct.imageUrl}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#16382C] text-amber-300 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase">
                  100% Homemade
                </div>
              </div>

              {/* Spice & Heat Level Indicator */}
              <div className="bg-white p-3 rounded-xl border border-[#E6DEC8] space-y-1">
                <div className="flex justify-between text-xs font-bold text-[#16382C]">
                  <span>ঝালের মাত্রা / Spice Heat:</span>
                  <span className="text-red-500 font-extrabold">Level {quickViewProduct.spiceLevel}/5</span>
                </div>
                <div className="flex gap-1 text-sm">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < quickViewProduct.spiceLevel ? 'opacity-100' : 'opacity-20'}>
                      🌶️
                    </span>
                  ))}
                </div>
              </div>

              {/* Shelf Life Note */}
              <div className="flex items-center gap-2 text-xs text-[#786655] bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
                <Clock className="w-4 h-4 text-[#E07A24] shrink-0" />
                <span>{quickViewProduct.shelfLife}</span>
              </div>
            </div>

            {/* Guaranteed Pure Badges */}
            <div className="pt-4 border-t border-[#E6DEC8] flex items-center justify-between text-[11px] text-[#16382C] font-semibold">
              <span className="flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5 text-[#E07A24]" /> ঘানির সরিষার তেল
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> নো কেমিক্যাল
              </span>
            </div>
          </div>

          {/* Right Column: Title, Description, Variants & Actions */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Taste Profiles & Signature Badge */}
              <div className="flex flex-wrap items-center gap-1.5">
                {quickViewProduct.isSignature && (
                  <span className="text-xs font-black text-white bg-gradient-to-r from-amber-600 to-amber-700 px-3 py-0.5 rounded-full border border-amber-300 shadow-2xs">
                    {lang === 'bn' ? '⚡ সিগনেচার আচার' : '⚡ Signature Achar'}
                  </span>
                )}
                {quickViewProduct.tasteProfiles.map((t, idx) => (
                  <span key={idx} className="text-xs font-bold text-[#8A5A36] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#E6DEC8]">
                    {t}
                  </span>
                ))}
              </div>

              {/* Title */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#16382C] font-serif leading-tight">
                  {lang === 'bn' ? quickViewProduct.banglaName : quickViewProduct.name}
                </h2>
                {lang === 'bn' && quickViewProduct.name && (
                  <p className="text-xs text-stone-500 font-medium mt-0.5">
                    {quickViewProduct.name}
                  </p>
                )}
              </div>

              {/* Instant Variant Selector (বয়ামের সাইজ) */}
              <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                  <span>বয়ামের সাইজ নির্বাচন করুন:</span>
                  <span className="text-[#15803D] font-extrabold bg-emerald-100/60 px-2 py-0.5 rounded">
                    {variant.size}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {quickViewProduct.variants.map((v, idx) => {
                    const isSelected = selectedVariantIdx === idx;
                    return (
                      <button
                        key={v.size}
                        onClick={() => setSelectedVariantIdx(idx)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#15803D] text-white border-[#15803D] shadow-xs'
                            : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{v.size}</div>
                        <div className={`text-xs font-extrabold mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-[#15803D]'}`}>
                          ৳{v.price}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-bold text-stone-700">পরিমাণ / Quantity:</span>
                <div className="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-extrabold text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 text-sm font-bold text-stone-600 hover:bg-stone-100 cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tab Navigation (Details below) */}
              <div className="flex gap-2 border-b border-stone-200 pt-2 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1.5 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'details' ? 'border-[#5C3826] text-[#5C3826]' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  বিবরণ / Story
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-1.5 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'ingredients' ? 'border-[#5C3826] text-[#5C3826]' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  উপাদান / Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('pairings')}
                  className={`pb-1.5 border-b-2 transition-colors cursor-pointer ${
                    activeTab === 'pairings' ? 'border-[#5C3826] text-[#5C3826]' : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  খাওয়ার উপায় / Pairings
                </button>
              </div>

              {/* Tab Content */}
              <div className="text-xs text-stone-600 leading-relaxed min-h-[50px]">
                {activeTab === 'details' && (
                  <p>{lang === 'bn' ? quickViewProduct.banglaDescription : quickViewProduct.description}</p>
                )}
                {activeTab === 'ingredients' && (
                  <div className="flex flex-wrap gap-1.5">
                    {quickViewProduct.ingredients.map((ing, i) => (
                      <span key={i} className="bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-[11px] font-semibold">
                        ✓ {ing}
                      </span>
                    ))}
                  </div>
                )}
                {activeTab === 'pairings' && (
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1.5">
                      {quickViewProduct.pairings.map((pair, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-md text-[11px] font-semibold flex items-center gap-1">
                          <Utensils className="w-3 h-3" /> {pair}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Action Row */}
            <div className="pt-4 border-t border-[#E6DEC8] flex flex-col gap-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-gray-500">Total Price: </span>
                  <span className="text-2xl font-black text-[#5C3826]">
                    ৳{variant.price * quantity}
                  </span>
                </div>
                <div className="text-xs text-emerald-700 font-bold">
                  ✓ In Stock ({variant.stock} available)
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* Dark Green Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="py-3 px-4 rounded-xl font-bold text-xs bg-[#15803D] hover:bg-[#166534] text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>{t('product.addToCart')}</span>
                </button>

                {/* Premium Brown Buy Now Button */}
                <button
                  onClick={handleInstantBuy}
                  className="py-3 px-4 rounded-xl font-bold text-xs bg-[#5C3826] hover:bg-[#432818] text-white flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current text-white" />
                  <span>{t('product.buyNow')}</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
