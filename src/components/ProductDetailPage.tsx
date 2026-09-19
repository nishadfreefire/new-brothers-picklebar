import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Check, 
  ArrowLeft, 
  Flame, 
  Droplet, 
  ShieldCheck, 
  Truck, 
  Star, 
  Clock, 
  Heart, 
  Share2, 
  Utensils, 
  Award,
  ChevronRight,
  AlertCircle,
  Phone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, ProductVariant } from '../types';
import { navigateTo } from '../utils/router';

interface ProductDetailPageProps {
  productId: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ productId }) => {
  const { 
    products, 
    isLoadingProducts, 
    addToCart, 
    setIsCartOpen, 
    setIsCheckoutOpen,
    reviews,
    submitReview
  } = useStore();
  const { lang, t } = useLanguage();

  const product = products.find(p => p.id === productId);

  // Selected variant state
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddedAnim, setIsAddedAnim] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'pairings' | 'storage' | 'reviews'>('details');

  // Review submission state
  const [reviewName, setReviewName] = useState('');
  const [reviewCity, setReviewCity] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Copy link feedback
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync variant index when product changes
  useEffect(() => {
    if (product) {
      setSelectedVariantIndex(product.defaultVariantIndex || 0);
      setQuantity(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product, productId]);

  if (isLoadingProducts && !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-orange-200 border-t-[#E07A24] rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-stone-600">Loading pickle details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-16 h-16 bg-orange-100 text-[#E07A24] rounded-2xl flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-stone-900">
          {lang === 'bn' ? 'আচারটি পাওয়া যায়নি' : 'Pickle Not Found'}
        </h2>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          {lang === 'bn'
            ? 'আপনি যে আচারের পেজে যেতে চেয়েছেন তা বর্তমানে তালিকায় নেই অথবা সরিয়ে নেওয়া হয়েছে।'
            : 'The pickle jar you are looking for may have been removed or is temporarily unavailable.'}
        </p>
        <button
          onClick={() => navigateTo('/')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E07A24] hover:bg-[#C96818] text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'bn' ? 'সব আচারে ফিরে যান' : 'Back to Storefront'}</span>
        </button>
      </div>
    );
  }

  const currentVariant: ProductVariant = product.variants[selectedVariantIndex] || product.variants[0] || {
    size: '250g',
    price: product.price,
    originalPrice: product.originalPrice,
    stock: product.stock
  };

  const discountPercent = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (currentVariant.stock <= 0) return;
    addToCart(product, currentVariant, quantity);
    setIsAddedAnim(true);
    setTimeout(() => setIsAddedAnim(false), 1500);
  };

  const handleBuyNow = () => {
    if (currentVariant.stock <= 0) return;
    addToCart(product, currentVariant, quantity);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;
    setReviewSubmitting(true);
    await submitReview({
      userName: reviewName,
      userCity: reviewCity || 'Bangladesh',
      rating: reviewRating,
      comment: reviewComment,
      productName: product.name
    });
    setReviewSubmitting(false);
    setReviewSuccess(true);
    setReviewName('');
    setReviewCity('');
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Related products from the same category or other bestsellers
  const relatedProducts = products
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  // Product reviews
  const productReviews = reviews.filter(
    r => !r.productName || r.productName.toLowerCase() === product.name.toLowerCase()
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-6 sm:space-y-8">
      
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center flex-wrap gap-2 text-xs text-stone-500 font-medium">
        <button 
          onClick={() => navigateTo('/')} 
          className="hover:text-[#E07A24] transition-colors cursor-pointer"
        >
          {lang === 'bn' ? 'হোম' : 'Home'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <button 
          onClick={() => navigateTo('/')} 
          className="hover:text-[#E07A24] transition-colors cursor-pointer"
        >
          {lang === 'bn' ? 'আচার সমাহার' : 'Pickle Collection'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-900 font-semibold truncate max-w-[200px] sm:max-w-none">
          {lang === 'bn' ? product.banglaName : product.name}
        </span>
      </nav>

      {/* Main Product Showcase Grid - Expansive 50/50 balance with edge-friendly mobile padding */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-3 sm:p-6 lg:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 lg:gap-10">
        
        {/* Left Column: Image Gallery & Badges (6 cols for a generous, prominent view) */}
        <div className="lg:col-span-6 lg:sticky lg:top-24 space-y-3">
          <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-50 border border-stone-200/80 group shadow-xs">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            
            {/* Sleek Top Badges (neat horizontal wrap without obscuring the pickle photo) */}
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 max-w-[90%] pointer-events-none">
              {discountPercent > 0 && (
                <span className="bg-[#E07A24] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                  Save {discountPercent}%
                </span>
              )}
              {product.isSignature && (
                <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[11px] font-black px-2 py-0.5 rounded-md shadow-sm border border-amber-300/40">
                  {lang === 'bn' ? '⚡ সিগনেচার আচার' : '⚡ Signature'}
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-stone-900 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
                  {t('product.bestSeller')}
                </span>
              )}
              {product.isOrganic100 && (
                <span className="bg-emerald-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  100% Organic
                </span>
              )}
            </div>

            {/* Out of stock overlay */}
            {currentVariant.stock <= 0 && (
              <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center">
                <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  {t('product.outOfStock')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Title, Instant Weight Selection, Pricing & Actions (6 cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4 sm:space-y-5">
          
          <div className="space-y-4">
            
            {/* Header: Category Badge & Quick Ratings & Share */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-[#F5ECE1] text-[#5C3826] border border-[#E2D0BD] text-xs font-bold uppercase tracking-wider">
                  {product.isSignature ? '⚡ সিগনেচার আচার' : product.category}
                </span>
                
                {/* Rating summary */}
                <div className="flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-stone-900">4.9</span>
                  <span className="text-stone-400 text-[11px]">({productReviews.length + 24})</span>
                </div>
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer relative"
                title="Share Pickle"
              >
                <Share2 className="w-4 h-4" />
                {copiedLink && (
                  <span className="absolute -bottom-7 right-0 bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow-md z-20">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Product Titles */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                {lang === 'bn' ? product.banglaName : product.name}
              </h1>
              {lang === 'bn' && product.name && (
                <p className="text-xs sm:text-sm font-medium text-stone-500 mt-0.5">
                  {product.name}
                </p>
              )}
            </div>

            {/* Price & Stock Display */}
            <div className="flex items-baseline gap-3 py-1">
              <span className="text-3xl sm:text-4xl font-black text-[#15803D]">
                ৳{currentVariant.price}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-lg text-stone-400 line-through">
                  ৳{currentVariant.originalPrice}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#5C3826] text-white">
                  -{discountPercent}%
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 ml-auto">
                {currentVariant.stock > 0 ? '✓ মজুত আছে' : 'স্টক শেষ'}
              </span>
            </div>

            {/* Jar Weight / Size Variant Selection - IMMEDIATE FOCUS */}
            <div className="p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                  বয়ামের সাইজ নির্বাচন করুন (কত গ্রাম নিবেন):
                </span>
                <span className="text-xs font-extrabold text-[#15803D] bg-emerald-100/60 px-2 py-0.5 rounded-md">
                  {currentVariant.size}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {product.variants.map((v, idx) => {
                  const isSelected = selectedVariantIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#15803D] bg-white ring-2 ring-[#15803D]/20 shadow-sm'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#15803D] rounded-full flex items-center justify-center text-white text-[10px]">
                          ✓
                        </span>
                      )}
                      <div className="text-xs sm:text-sm font-bold text-stone-900">{v.size}</div>
                      <div className="text-sm sm:text-base font-black text-[#15803D] mt-0.5">৳{v.price}</div>
                      <div className="text-[10px] text-stone-400 mt-0.5">
                        {v.stock > 0 ? `${v.stock} pcs left` : 'Sold out'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-700">পরিমাণ:</span>
                  <div className="flex items-center border border-stone-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-sm cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1.5 text-xs font-bold text-stone-900 min-w-[36px] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(currentVariant.stock || 20, quantity + 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 transition-colors font-bold text-sm cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <span className="text-xs sm:text-sm text-stone-600">
                  মোট দাম: <strong className="text-base sm:text-lg text-stone-900 font-extrabold">৳{currentVariant.price * quantity}</strong>
                </span>
              </div>

              {/* Main Dual Call-to-Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
                {/* Dark Green Add to Cart Button */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={currentVariant.stock <= 0}
                  className={`py-3.5 px-5 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                    isAddedAnim
                      ? 'bg-[#14532D] text-white shadow-sm'
                      : currentVariant.stock <= 0
                      ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
                      : 'bg-[#15803D] hover:bg-[#166534] text-white active:scale-[0.98]'
                  }`}
                >
                  {isAddedAnim ? (
                    <>
                      <Check className="w-5 h-5 text-white" />
                      <span>{lang === 'bn' ? 'কার্টে যোগ হয়েছে!' : 'Added to Cart!'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 text-white" />
                      <span>{lang === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                    </>
                  )}
                </button>

                {/* Premium Brown Buy Now Button */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={currentVariant.stock <= 0}
                  className="py-3.5 px-5 rounded-xl bg-[#5C3826] hover:bg-[#432818] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <Truck className="w-5 h-5 text-white" />
                  <span>{lang === 'bn' ? 'এখনই অর্ডার করুন (Buy Now)' : 'Buy Now (Direct Checkout)'}</span>
                </button>
              </div>
            </div>

            {/* Direct Phone / WhatsApp Assistance */}
            <div className="flex items-center justify-between gap-2 p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-950">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#5C3826] shrink-0" />
                <span>ফোনে বা WhatsApp এ সরাসরি অর্ডার করতে কল বা মেসেজ দিন:</span>
              </div>
              <a 
                href="tel:01711998877" 
                className="font-bold text-[#5C3826] hover:underline whitespace-nowrap"
              >
                ০১৭১১-৯৯৮৮৭৭
              </a>
            </div>

            {/* Quick 1-Line Trust Strip */}
            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-100">
              <span>🚚 সারাদেশে হোম ডেলিভারি</span>
              <span>💵 ক্যাশ অন ডেলিভারি</span>
              <span>🌿 ১০০% ঘরোয়া স্বাদ</span>
            </div>

            {/* Nationwide Delivery Notice */}
            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/90 text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-stone-800 font-semibold">
                <Truck className="w-4 h-4 text-[#5C3826]" />
                <span>সারা বাংলাদেশে নির্ভরযোগ্য হোম ডেলিভারি</span>
              </div>
              <p className="text-stone-600 text-[11px] pl-6">
                ঢাকা সিটিতে ২৪-৪৮ ঘণ্টার মধ্যে (৳৭০), ঢাকার সাব-এরিয়া ৳১০০, ঢাকার বাইরে ৳১৩০ ক্যাশ অন ডেলিভারি। ৳১৫০০+ অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* 3 Value Assurance Badges (placed cleanly under hero actions) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 text-[#E07A24]" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">ঘানির সরিষার তেল</div>
            <div className="text-xs text-stone-500">১০০% খাঁটি ও নির্ভেজাল ঝাঁঝাঁলো তেল</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">কেমিক্যাল মুক্ত</div>
            <div className="text-xs text-stone-500">কোনো কৃত্রিম রং বা প্রিজারভেটিভ নেই</div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-[#5C3826]" />
          </div>
          <div>
            <div className="text-sm font-bold text-stone-900">১২ মাস স্থায়ী</div>
            <div className="text-xs text-stone-500">রোদে শুকিয়ে তৈরি গ্রামীণ ঐতিহ্য</div>
          </div>
        </div>
      </div>

      {/* Deep Information Tabs */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200 p-4 sm:p-6 lg:p-8 shadow-xs space-y-5 sm:space-y-6">
        
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-[#5C3826] text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            স্বাদ ও ঐতিহ্যের গল্প / Details
          </button>

          <button
            onClick={() => setActiveTab('ingredients')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'ingredients'
                ? 'bg-[#5C3826] text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            উপাদানসমূহ / Pure Ingredients
          </button>

          <button
            onClick={() => setActiveTab('pairings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'pairings'
                ? 'bg-[#5C3826] text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            কী দিয়ে খাবেন / Food Pairings
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'storage'
                ? 'bg-[#5C3826] text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            সংরক্ষণ পদ্ধতি / Storage Care
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#5C3826] text-white shadow-2xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            গ্রাহক মতামত ({productReviews.length})
          </button>
        </div>

        {/* Tab 1: Description & Story */}
        {activeTab === 'details' && (
          <div className="space-y-5 text-sm text-stone-700 leading-relaxed max-w-3xl">
            {/* Tagline callout */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80">
              <p className="text-stone-900 font-semibold italic text-base">
                "{lang === 'bn' ? product.banglaTagline || product.tagline : product.tagline}"
              </p>
            </div>

            {/* Taste Profile & Spice meter in details */}
            <div className="flex flex-wrap items-center gap-4 py-3 px-4 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-500 font-bold">স্বাদের ধরন:</span>
                <div className="flex flex-wrap gap-1.5">
                  {product.tasteProfiles && product.tasteProfiles.map((tp, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white border border-stone-200 text-stone-800 font-medium">
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden sm:block w-px h-5 bg-stone-300"></div>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 font-bold">ঝাল মাত্রা:</span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <Flame
                      key={idx}
                      className={`w-4 h-4 ${
                        idx < product.spiceLevel
                          ? 'text-[#8B5A2B] fill-[#8B5A2B]'
                          : 'text-stone-200 fill-stone-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-stone-800 font-bold ml-1">
                  {product.spiceLevel <= 2 ? 'মৃদু' : product.spiceLevel === 3 ? 'মাঝারি' : 'তীব্র ঝাল'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-stone-900 mb-2">
                {lang === 'bn' ? product.banglaName : product.name} এর আসল বিশেষত্ব
              </h3>
              <p>
                {lang === 'bn' 
                  ? product.banglaDescription || product.description
                  : product.description}
              </p>
            </div>

            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
              আমাদের প্রতিটি আচারের বয়াম ঐতিহ্যবাহী গ্রামীণ রেসিপিতে তৈরি। খাঁটি কাঁচামাল, দেশি মশলা এবং ঘানির খাঁটি সরিষার তেলে রোদে শুকিয়ে দীর্ঘ সময় নিয়ে আচারটি তৈরি করা হয় যাতে প্রতিটি কামড়ে আসল স্বাদ পাওয়া যায়।
            </p>
          </div>
        )}

        {/* Tab 2: Ingredients */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-base font-bold text-stone-900">
              ব্যবহৃত প্রাকৃতিক উপাদানসমূহ (১০০% কেমিক্যাল মুক্ত)
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {product.ingredients && product.ingredients.map((ing, idx) => (
                <div 
                  key={idx} 
                  className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-800 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#5C3826]"></span>
                  <span>{ing}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500 pt-2">
              * এতে কোনো অ্যাসিটিক অ্যাসিড বা কৃত্রিম কৃত্রিম ফ্লেভার ব্যবহার করা হয়নি। ভিনেগারের পরিবর্তে প্রাকৃতিক লেবু ও সরিষার তেলের অম্লতা বজায় রাখা হয়।
            </p>
          </div>
        )}

        {/* Tab 3: Pairings */}
        {activeTab === 'pairings' && (
          <div className="space-y-4 max-w-3xl">
            <h3 className="text-base font-bold text-stone-900">
              কোন কোন খাবারের সাথে এই আচারটি সবচেয়ে ভালো লাগে?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {product.pairings && product.pairings.map((pairing, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#FAF6F0] border border-[#E8DCCF] space-y-1">
                  <Utensils className="w-4 h-4 text-[#5C3826]" />
                  <div className="text-sm font-bold text-stone-900">{pairing}</div>
                  <div className="text-xs text-stone-500">দুর্দান্ত কম্বিনেশন ও অসাধারণ স্বাদ</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Storage Care */}
        {activeTab === 'storage' && (
          <div className="space-y-4 max-w-3xl text-sm text-stone-700">
            <h3 className="text-base font-bold text-stone-900">
              আচার দীর্ঘদিন সতেজ ও সুস্বাদু রাখার সঠিক নিয়ম
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm list-disc pl-5">
              <li>সর্বদা শুকনো এবং পরিষ্কার স্টিল বা কাঠের চামচ ব্যবহার করুন। কখনো ভেজা চামচ বয়ামে দিবেন না।</li>
              <li>আচারের উপরিভাগে সরিষার তেলের একটি আবরণ বজায় রাখলে আচারে কখনো ফাঙ্গাস পড়বে না। তেল কমে গেলে সামান্য গরম করে ঠান্ডা করা সরিষার তেল ঢেলে দিতে পারেন।</li>
              <li>মাসে অন্তত ১-২ বার কাচের বয়ামটি ঢাকনাসহ হালকা রোদে দিন।</li>
              <li>আচারটি ঘরের সাধারণ তাপমাত্রায় শুষ্ক স্থানে ১২ মাস পর্যন্ত অনায়াসে ভালো থাকে।</li>
            </ul>
          </div>
        )}

        {/* Tab 5: Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 max-w-3xl">
            
            {/* Reviews List */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                গ্রাহকদের রিভিউ ও রেটিং ({productReviews.length})
              </h3>
              
              {productReviews.length === 0 ? (
                <div className="p-6 bg-stone-50 rounded-2xl text-center text-xs text-stone-500">
                  এখনো এই আচারের কোনো নির্দিষ্ট রিভিউ নেই। নিচে আপনার প্রথম রিভিউটি লিখে জানান!
                </div>
              ) : (
                <div className="divide-y divide-stone-100">
                  {productReviews.map(rev => (
                    <div key={rev.id} className="py-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-xs text-stone-900">{rev.userName}</strong>
                          <span className="text-[10px] text-stone-400">({rev.userCity})</span>
                          {rev.verifiedBuyer && (
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                              Verified Buyer
                            </span>
                          )}
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Write a Review Form */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
              <h4 className="text-sm font-bold text-stone-900">আপনার মূল্যবান মতামত দিন</h4>
              {reviewSuccess ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
                  ধন্যবাদ! আপনার রিভিউ সফলভাবে যুক্ত হয়েছে।
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={e => setReviewName(e.target.value)}
                      placeholder="আপনার নাম *"
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5C3826]"
                    />
                    <input
                      type="text"
                      value={reviewCity}
                      onChange={e => setReviewCity(e.target.value)}
                      placeholder="আপনার শহর (যেমন: ঢাকা / সিলেট)"
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5C3826]"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-600 font-medium">রেটিং দিন:</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="cursor-pointer text-amber-400"
                        >
                          <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-current' : 'text-stone-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    required
                    rows={2}
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="আচারের স্বাদ, ঘ্রাণ ও গুণগত মান সম্পর্কে আপনার মতামত লিখুন... *"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#5C3826]"
                  />

                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-5 py-2.5 bg-[#5C3826] hover:bg-[#432818] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {reviewSubmitting ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                {lang === 'bn' ? 'অন্যান্য জনপ্রিয় আচারসমূহ' : 'You May Also Like'}
              </h3>
              <p className="text-xs text-stone-500">
                {lang === 'bn' ? 'আমাদের সেরা রেসিপিতে তৈরি খাঁটি স্বাদের আচার' : 'Handcrafted with traditional family recipes'}
              </p>
            </div>
            <button
              onClick={() => navigateTo('/')}
              className="text-xs font-semibold text-[#E07A24] hover:underline cursor-pointer"
            >
              {lang === 'bn' ? 'সব আচার দেখুন →' : 'View All →'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <div
                key={rel.id}
                onClick={() => navigateTo(`/product/${rel.id}`)}
                className="bg-white rounded-2xl border border-stone-200 p-3 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-50 mb-2">
                  <img
                    src={rel.imageUrl}
                    alt={rel.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm text-stone-900 line-clamp-1 group-hover:text-[#E07A24] transition-colors">
                    {lang === 'bn' ? rel.banglaName : rel.name}
                  </h4>
                  <div className="text-sm font-extrabold text-[#E07A24] mt-1">
                    ৳{rel.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-stone-500 font-medium">
            সাইজ: <strong className="text-stone-900">{currentVariant.size}</strong>
          </span>
          <span className="text-base font-black text-[#15803D]">
            ৳{currentVariant.price * quantity}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-1 justify-end max-w-[240px]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={currentVariant.stock <= 0}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all cursor-pointer ${
              isAddedAnim
                ? 'bg-[#14532D] text-white'
                : 'bg-[#15803D] text-white active:scale-95'
            }`}
          >
            {isAddedAnim ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
            <span>{lang === 'bn' ? 'কার্ট' : 'Cart'}</span>
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={currentVariant.stock <= 0}
            className="py-2 px-3.5 rounded-xl bg-[#5C3826] active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'অর্ডার করুন' : 'Order'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
