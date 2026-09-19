import React, { useState } from 'react';
import { PackagePlus, Check, ShoppingBag, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';

export const ComboBundleBuilder: React.FC = () => {
  const { products, addToCart, setIsCartOpen } = useStore();
  const { lang } = useLanguage();

  // Selected 3 pickles for the custom box
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const targetCount = 3;

  const toggleSelect = (productId: string) => {
    if (selectedIds.includes(productId)) {
      setSelectedIds(prev => prev.filter(id => id !== productId));
    } else {
      if (selectedIds.length < targetCount) {
        setSelectedIds(prev => [...prev, productId]);
      }
    }
  };

  const selectedProducts = selectedIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const rawTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const bundleDiscount = Math.round(rawTotal * 0.15); // 15% discount for combo box
  const bundleFinalPrice = rawTotal - bundleDiscount;

  const handleAddBundleToCart = () => {
    if (selectedProducts.length !== targetCount) return;
    for (const prod of selectedProducts) {
      addToCart(prod, prod.variants[0], 1);
    }
    setSelectedIds([]);
    setIsCartOpen(true);
  };

  return (
    <section id="combo-box-section" className="my-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#382115] via-[#2A180E] to-[#1C0F08] text-white shadow-xl border border-[#8B5A2B]/40 relative overflow-hidden scroll-mt-24">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#5C3826]/25 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-white/15 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5C3826]/80 text-amber-200 text-xs font-bold uppercase tracking-wider mb-2 border border-[#8B5A2B]/50">
              <PackagePlus className="w-3.5 h-3.5 text-amber-300" />
              <span>{lang === 'bn' ? 'কাস্টম ৩-জার আচার কম্বো' : 'Custom 3-Jar Artisanal Box'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-serif">
              {lang === 'bn' ? 'পছন্দের যেকোনো ৩টি আচার একসাথে নিন - ১৫% ছাড়!' : 'Pick Any 3 Pickles & Save Instant 15%'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1">
              {lang === 'bn' ? 'নিচে থেকে আপনার পছন্দের ৩টি আচারের ওপর ক্লিক করে কম্বো বক্স তৈরি করুন।' : 'Select any 3 flavors below to build your custom handcrafted gift bundle.'}
            </p>
          </div>

          {/* Bundle Progress Tracker */}
          <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
            <span className="text-xs font-bold text-amber-300">
              {selectedIds.length} / {targetCount} Selected
            </span>
            <div className="flex gap-1.5">
              {[0, 1, 2].map(idx => (
                <div
                  key={idx}
                  className={`w-3.5 h-3.5 rounded-full transition-all flex items-center justify-center ${
                    idx < selectedIds.length ? 'bg-[#5C3826] text-white' : 'bg-white/20 border border-white/30'
                  }`}
                >
                  {idx < selectedIds.length && <Check className="w-2.5 h-2.5" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Bundle Box Preview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Left: 3 Box Slots */}
          <div className="md:col-span-8 grid grid-cols-3 gap-3 sm:gap-4">
            {[0, 1, 2].map(slotIdx => {
              const product = selectedProducts[slotIdx];
              return (
                <div
                  key={slotIdx}
                  className={`aspect-4/5 rounded-2xl border-2 transition-all p-3 flex flex-col items-center justify-center text-center relative overflow-hidden ${
                    product
                      ? 'bg-white/10 border-amber-400/80 shadow-md'
                      : 'border-dashed border-white/30 bg-white/5'
                  }`}
                >
                  {product ? (
                    <>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-amber-300/40 mb-2"
                      />
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {lang === 'bn' ? product.banglaName : product.name}
                      </span>
                      <span className="text-[11px] text-amber-300 font-extrabold mt-0.5">
                        ৳{product.price} ({product.variants[0]?.size})
                      </span>
                      <button
                        onClick={() => toggleSelect(product.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 hover:bg-red-600 text-white transition-colors"
                        title="Remove from bundle"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white/50 space-y-1">
                      <div className="w-8 h-8 rounded-full border border-dashed border-white/30 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-white/60" />
                      </div>
                      <span className="text-[11px] font-medium">Slot #{slotIdx + 1}</span>
                      <span className="text-[9px] text-white/40">Select Below</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right: Bundle Price & CTA */}
          <div className="md:col-span-4 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 flex flex-col justify-between space-y-3">
            <div>
              <div className="text-xs text-amber-200/90 font-medium">Trio Combo Summary:</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl sm:text-3xl font-black text-amber-300">
                  ৳{bundleFinalPrice}
                </span>
                {rawTotal > 0 && (
                  <span className="text-sm text-white/50 line-through">
                    ৳{rawTotal}
                  </span>
                )}
              </div>
              {bundleDiscount > 0 && (
                <div className="text-[11px] font-bold text-emerald-300 mt-0.5">
                  🎉 You save ৳{bundleDiscount} (15% OFF Combo discount)
                </div>
              )}
            </div>

            {/* Dark Green Add Trio Box to Cart Button */}
            <button
              onClick={handleAddBundleToCart}
              disabled={selectedIds.length !== targetCount}
              className={`w-full py-3.5 px-4 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                selectedIds.length === targetCount
                  ? 'bg-[#15803D] hover:bg-[#166534] text-white cursor-pointer transform hover:scale-[1.02]'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span>
                {selectedIds.length === targetCount
                  ? (lang === 'bn' ? '৩টি আচার কার্টে যোগ করুন' : 'Add Trio Box to Cart')
                  : `${targetCount - selectedIds.length} more to unlock discount`}
              </span>
            </button>
          </div>
        </div>

        {/* Quick Selection Carousel / Mini Grid */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-xs font-bold text-amber-200 mb-2">
            Click any pickle to add/remove from Trio Box:
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
            {products.slice(0, 10).map(prod => {
              const isSelected = selectedIds.includes(prod.id);
              return (
                <button
                  key={prod.id}
                  onClick={() => toggleSelect(prod.id)}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl border text-left shrink-0 transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-black border-amber-300 font-bold shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                  }`}
                >
                  <img src={prod.imageUrl} alt={prod.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div className="text-[11px] leading-tight max-w-[120px]">
                    <div className="truncate font-semibold">{lang === 'bn' ? prod.banglaName : prod.name}</div>
                    <div className={isSelected ? 'text-gray-900' : 'text-amber-300'}>৳{prod.price}</div>
                  </div>
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5 text-white/50" />}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
