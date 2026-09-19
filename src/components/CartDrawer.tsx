import React, { useState } from 'react';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, Truck, Tag, Check, MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
    settings
  } = useStore();

  const { lang, t } = useLanguage();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = settings?.freeDeliveryThreshold || 1500;
  const isFreeShipping = cartSubtotal >= freeShippingThreshold;
  const remainingForFreeShip = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    const res = await applyCouponCode(couponInput);
    setCouponLoading(false);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#E6DEC8] animate-in slide-in-from-right duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF6F0] text-[#5C3826]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                {t('cart.title')}
              </h3>
              <span className="text-xs text-stone-500 font-medium">
                {cartItemCount} {cartItemCount === 1 ? 'jar' : 'jars'} selected
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-[#FAF6F0] px-4 py-2.5 border-b border-[#E8DCCF] text-xs">
          <div className="flex justify-between items-center font-medium text-stone-800 mb-1">
            {isFreeShipping ? (
              <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                <Truck className="w-3.5 h-3.5 text-emerald-700" /> {t('cart.freeShippingEarned')}
              </span>
            ) : (
              <span>
                {lang === 'bn' 
                  ? `ফ্রি ডেলিভারির জন্য আর মাত্র ৳${remainingForFreeShip} টাকার আচার যোগ করুন!`
                  : `Add ৳${remainingForFreeShip} more for FREE Delivery!`}
              </span>
            )}
            <span className="text-[#5C3826] font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isFreeShipping ? 'bg-emerald-600' : 'bg-[#5C3826]'}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3 text-[#786655]">
              <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-[#E6DEC8] flex items-center justify-center mx-auto text-2xl">
                🥒
              </div>
              <p className="text-sm font-semibold max-w-xs mx-auto">
                {t('cart.empty')}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2 rounded-full bg-[#16382C] text-white text-xs font-bold shadow-sm hover:bg-[#1F4D3C]"
              >
                {lang === 'bn' ? 'আচার দেখতে চলুন' : 'Browse Pickles'}
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedVariant.size}`}
                className="p-3 bg-[#FAF7F2] rounded-2xl border border-[#E6DEC8] flex items-center gap-3 relative group"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#D5C9B3] shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#16382C] truncate">
                    {lang === 'bn' ? item.product.banglaName : item.product.name}
                  </h4>
                  <div className="text-[11px] text-emerald-800 font-bold mt-0.5">
                    Jar: {item.selectedVariant.size} • ৳{item.selectedVariant.price} each
                  </div>

                  {/* Quantity Incrementer */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-[#D5C9B3] rounded-lg bg-white overflow-hidden shadow-2xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.size, item.quantity - 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-extrabold text-[#16382C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.selectedVariant.size, item.quantity + 1)}
                        className="px-2 py-0.5 text-xs font-bold text-gray-600 hover:bg-gray-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-extrabold text-[#5C3826]">
                      ৳{item.selectedVariant.price * item.quantity}
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedVariant.size)}
                  className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Promo Code & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#E6DEC8] space-y-3">
            
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-2.5 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong> (-৳{couponDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError('');
                    }}
                    placeholder="Coupon (e.g. PICKLE10)"
                    className="flex-1 px-3 py-2 bg-white border border-[#D5C9B3] rounded-xl text-xs font-semibold uppercase focus:outline-none focus:ring-1 focus:ring-[#5C3826]"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#5C3826] hover:bg-[#432818] text-white text-xs font-semibold disabled:opacity-50 cursor-pointer"
                  >
                    {couponLoading ? '...' : t('checkout.apply')}
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600 mt-1 font-semibold">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t('cart.subtotal')}:</span>
                <span className="font-bold text-stone-900">৳{cartSubtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t('cart.discount')}:</span>
                  <span>-৳{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ / Delivery:</span>
                <span className="font-semibold text-stone-600">
                  {isFreeShipping ? <span className="text-emerald-700">FREE</span> : 'Calculated at checkout (৳70-৳130)'}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                <span>{t('cart.total')}:</span>
                <span className="text-lg font-extrabold text-[#5C3826]">
                  ৳{Math.max(0, cartSubtotal - couponDiscount)}
                </span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-to-checkout-btn"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 rounded-2xl bg-[#5C3826] hover:bg-[#432818] text-white font-extrabold text-sm shadow-xl shadow-stone-900/20 flex items-center justify-center gap-2 transform active:scale-98 transition-all cursor-pointer"
            >
              <span>{t('cart.checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Direct WhatsApp Ordering Alternative */}
            <div className="text-center pt-1">
              <a
                href={`https://wa.me/8801711234567?text=${encodeURIComponent(
                  `Assalamu Alaikum, I want to order from New Brother Picklebar. Items in my cart: ${cart.map(i => `${i.product.name} (${i.selectedVariant.size} x ${i.quantity})`).join(', ')}. Subtotal: ৳${cartSubtotal}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার করতে ক্লিক করুন</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
