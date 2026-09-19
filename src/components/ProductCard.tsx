import React, { useState } from 'react';
import { ShoppingBag, Check, Eye, Star, Flame, Award } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setQuickViewProduct } = useStore();
  const { lang, t } = useLanguage();

  const [isAddedAnim, setIsAddedAnim] = useState(false);

  // Default standard variant
  const currentVariant: ProductVariant =
    product.variants[product.defaultVariantIndex || 0] ||
    product.variants[0] || {
      size: '250g',
      price: product.price,
      originalPrice: product.originalPrice,
      stock: product.stock
    };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentVariant.stock <= 0) return;
    
    // Add default variant to cart
    addToCart(product, currentVariant, 1, false);
    
    // Smooth tactile button animation
    setIsAddedAnim(true);
    setTimeout(() => {
      setIsAddedAnim(false);
    }, 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleCardClick = () => {
    navigateTo(`/product/${product.id}`);
  };

  const discountPercent = currentVariant.originalPrice
    ? Math.round(((currentVariant.originalPrice - currentVariant.price) / currentVariant.originalPrice) * 100)
    : 0;

  // Taste flavor label
  const primaryTaste = product.tasteProfiles?.[0] || 'Tok-Jhal-Mishti (Sweet-Sour-Spicy)';
  const getTasteBangla = (taste: string) => {
    if (taste.includes('Sweet-Sour-Spicy') || taste.includes('Tok-Jhal-Mishti')) return 'টক-ঝাল-মিষ্টি';
    if (taste.includes('Naga')) return 'চরম নাগা ঝাল';
    if (taste.includes('Garlic')) return 'রসুন ও সরিষা';
    if (taste.includes('Sour') || taste.includes('Tok')) return 'খাঁটি টক';
    if (taste.includes('Sweet') || taste.includes('Mishti')) return 'মিষ্টি স্বাদ';
    if (taste.includes('Mustard')) return 'ঘানির ঝাঁঝ';
    return 'ঘরোয়া স্বাদ';
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      onClick={handleCardClick}
      className="group bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 hover:border-[#5C3826]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden p-2.5 sm:p-3.5"
    >
      {/* 1. Artisanal Image Stage */}
      <div className="relative aspect-square w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-b from-[#FAF6F0] to-[#F1E9DF] mb-2 sm:mb-3 flex items-center justify-center border border-stone-200/50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Ambient Top Badges Strip */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 max-w-[85%] z-10 pointer-events-none">
          {product.isSignature ? (
            <span className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs border border-amber-300/40 flex items-center gap-1">
              <Award className="w-2.5 h-2.5 text-amber-200" />
              <span>{lang === 'bn' ? 'সিগনেচার' : 'Signature'}</span>
            </span>
          ) : discountPercent > 0 ? (
            <span className="bg-[#5C3826] text-white text-[10px] sm:text-[11px] font-extrabold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
              -{discountPercent}%
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-stone-900/90 text-amber-300 text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-2xs">
              ★ সেরা বিক্রি
            </span>
          ) : null}
        </div>

        {/* Top-Right Quick View Eye Trigger */}
        <button
          type="button"
          onClick={handleQuickView}
          title="ঝটপট দেখুন (Quick View)"
          className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-[#5C3826] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Bottom-Left Taste/Spice Floating Tag */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none">
          <span className="bg-stone-900/75 backdrop-blur-xs text-amber-200 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-stone-700/50 flex items-center gap-1">
            {product.spiceLevel >= 4 ? (
              <Flame className="w-2.5 h-2.5 text-orange-400 fill-orange-400" />
            ) : null}
            <span>{getTasteBangla(primaryTaste)}</span>
          </span>
        </div>

        {/* Bottom-Right Rating */}
        <div className="absolute bottom-2 right-2 z-10 pointer-events-none bg-white/90 backdrop-blur-xs text-stone-800 text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs border border-stone-200/60 flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
          <span>{product.rating || '4.9'}</span>
        </div>

        {/* Out of stock overlay */}
        {currentVariant.stock <= 0 && (
          <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center z-20">
            <span className="bg-red-600 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
              {t('product.outOfStock')}
            </span>
          </div>
        )}
      </div>

      {/* 2. Product Information Details */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Bengali Main Name & English Subtitle */}
          <h3 className="font-bold text-stone-900 text-xs sm:text-sm md:text-[15px] leading-snug line-clamp-1 group-hover:text-[#5C3826] transition-colors">
            {lang === 'bn' ? product.banglaName : product.name}
          </h3>
          <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium line-clamp-1 mt-0.5">
            {product.name}
          </p>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between gap-1 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg md:text-xl font-black text-[#15803D]">
                ৳{currentVariant.price}
              </span>
              {currentVariant.originalPrice && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through">
                  ৳{currentVariant.originalPrice}
                </span>
              )}
            </div>

            <span className="text-[10px] sm:text-[11px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded">
              {currentVariant.size}
            </span>
          </div>
        </div>

        {/* 3. Tactile Add to Cart CTA */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={handleAddToCart}
          disabled={currentVariant.stock <= 0}
          className={`w-full py-2 sm:py-2.5 px-3 rounded-xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs select-none ${
            isAddedAnim
              ? 'bg-[#14532D] text-white shadow-sm scale-[0.98]'
              : currentVariant.stock <= 0
              ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
              : 'bg-[#15803D] hover:bg-[#166534] active:bg-[#14532D] text-white active:scale-95'
          }`}
        >
          {isAddedAnim ? (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-90 duration-200">
              <Check className="w-4 h-4 text-white stroke-[3]" />
              <span>{lang === 'bn' ? 'যোগ হয়েছে ✓' : 'Added!'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              <span>{lang === 'bn' ? 'কার্টে নিন' : 'Add to Cart'}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

