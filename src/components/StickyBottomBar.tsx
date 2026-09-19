import React from 'react';
import { ShoppingBag, Truck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const StickyBottomBar: React.FC = () => {
  const { cartItemCount, cartSubtotal, setIsCartOpen, setIsCheckoutOpen, setIsTrackingOpen } = useStore();
  const { lang } = useLanguage();

  if (cartItemCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-white/98 backdrop-blur-md border-t border-stone-300/80 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] px-3.5 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Cart items summary */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center gap-2 text-stone-800 font-extrabold text-xs cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative p-1.5 rounded-xl bg-amber-50 border border-amber-200">
            <ShoppingBag className="w-5 h-5 text-[#5C3826]" />
            <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-xs">
              {cartItemCount}
            </span>
          </div>
          <div className="text-left">
            <div className="text-[10px] text-stone-500 font-medium leading-tight">
              {lang === 'bn' ? 'মোট মূল্য' : 'Total'}
            </div>
            <div className="text-sm font-black text-[#15803D] leading-tight">
              ৳{cartSubtotal}
            </div>
          </div>
        </button>

        {/* Quick Order / Checkout Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTrackingOpen(true)}
            className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 text-xs font-bold transition-all border border-stone-200"
            title="Track Order"
          >
            <Truck className="w-4 h-4 text-[#5C3826]" />
          </button>
          
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-1.5 bg-[#15803D] hover:bg-[#166534] active:bg-[#14532D] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md transition-all active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Checkout'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
