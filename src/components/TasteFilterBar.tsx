import React, { useState } from 'react';
import { SlidersHorizontal, Flame, X, RotateCcw, Check, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { Category, TasteProfile } from '../types';

export const TasteFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProducts, products } = useStore();
  const { lang, t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories: { id: Category; labelEn: string; labelBn: string; emoji: string }[] = [
    { id: 'all', labelEn: 'All Pickles', labelBn: 'সকল আচার', emoji: '✨' },
    { id: 'signature', labelEn: '⚡ Signature Achar', labelBn: '⚡ সিগনেচার আচার', emoji: '⚡' },
    { id: 'mango', labelEn: 'Mango (আম)', labelBn: 'আমের আচার', emoji: '🥭' },
    { id: 'boroi', labelEn: 'Jujube (বরই)', labelBn: 'বরই আচার', emoji: '🍒' },
    { id: 'tamarind', labelEn: 'Tamarind (তেঁতুল)', labelBn: 'তেঁতুল আচার', emoji: '🫘' },
    { id: 'chalta', labelEn: 'Chalta (চালতা)', labelBn: 'চালতার আচার', emoji: '🍈' },
    { id: 'amra', labelEn: 'Hog Plum (আমড়া)', labelBn: 'আমড়ার আচার', emoji: '🍏' },
    { id: 'garlic', labelEn: 'Garlic (রসুন)', labelBn: 'রসুন আচার', emoji: '🧄' },
    { id: 'olive', labelEn: 'Olive (জলপাই)', labelBn: 'জলপাই আচার', emoji: '🫒' },
    { id: 'mixed', labelEn: 'Mixed (মিক্স)', labelBn: 'মিক্স আচার', emoji: '🥣' }
  ];

  const tasteOptions: { id: TasteProfile; label: string; color: string }[] = [
    { id: 'Tok-Jhal-Mishti (Sweet-Sour-Spicy)', label: 'টক-ঝাল-মিষ্টি', color: 'bg-amber-100 text-amber-900 border-amber-300' },
    { id: 'Tok (Sour)', label: 'টক (Sour)', color: 'bg-lime-100 text-lime-900 border-lime-300' },
    { id: 'Jhal (Spicy)', label: 'ঝাল (Spicy)', color: 'bg-orange-100 text-orange-900 border-orange-300' },
    { id: 'Mishti (Sweet)', label: 'মিষ্টি (Sweet)', color: 'bg-rose-100 text-rose-900 border-rose-300' },
    { id: 'Naga Hot', label: 'নাগা ঝাল (Extreme)', color: 'bg-red-100 text-red-900 border-red-300' },
    { id: 'Garlic Infused', label: 'রসুন জারিত', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    { id: 'Mustard Pungent', label: 'সরিষা বাটা ঝাঁঝ', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' }
  ];

  const toggleTaste = (taste: TasteProfile) => {
    setFilters(prev => {
      const exists = prev.tasteProfiles.includes(taste);
      return {
        ...prev,
        tasteProfiles: exists
          ? prev.tasteProfiles.filter(t => t !== taste)
          : [...prev.tasteProfiles, taste]
      };
    });
  };

  const hasActiveFilters = 
    filters.category !== 'all' || 
    filters.tasteProfiles.length > 0 || 
    filters.spiceLevel !== null || 
    filters.searchQuery.trim() !== '' ||
    filters.selectedSize !== 'all' ||
    filters.onlyInStock ||
    filters.onlyOrganic ||
    filters.maxPrice < 2000;

  return (
    <div id="filter-container" className="space-y-4 mb-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {categories.map(cat => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setFilters(prev => ({ ...prev, category: cat.id }))}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#E07A24] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{lang === 'bn' ? cat.labelBn : cat.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Control Row */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Quick Taste Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-[#E07A24]" />
            {t('filter.taste')}:
          </span>
          {tasteOptions.map(tOption => {
            const isSelected = filters.tasteProfiles.includes(tOption.id);
            return (
              <button
                key={tOption.id}
                onClick={() => toggleTaste(tOption.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-[#E07A24] text-white border-[#E07A24] shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {isSelected && '✓ '}
                {tOption.label}
              </button>
            );
          })}
        </div>

        {/* Right: Controls & Advanced Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Sort By Selector */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="appearance-none bg-stone-50 border border-stone-200 rounded-full px-4 py-2 pr-8 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#E07A24]"
            >
              <option value="featured">✨ {lang === 'bn' ? 'বেস্ট সেলার / জনপ্রিয়' : 'Best Sellers'}</option>
              <option value="price-low">💰 {lang === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price-high">💎 {lang === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="rating">⭐ {lang === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
              <option value="newest">🔥 {lang === 'bn' ? 'নতুন আইটেম' : 'New Arrivals'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Advanced Filter Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
              showAdvanced || filters.spiceLevel !== null || filters.onlyInStock
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showAdvanced ? 'Hide' : 'Filters'}</span>
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-full transition-colors cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">{t('filter.reset')}</span>
            </button>
          )}
        </div>

      </div>

      {/* Advanced Filter Collapsible Drawer */}
      {showAdvanced && (
        <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in duration-200">
          
          {/* 1. Spice Level (1-5) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block flex items-center gap-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{t('filter.spice')} (১-৫ মাত্রা)</span>
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilters(prev => ({ ...prev, spiceLevel: null }))}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  filters.spiceLevel === null ? 'bg-stone-900 text-white' : 'bg-white border border-stone-200 text-stone-700'
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4, 5].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilters(prev => ({ ...prev, spiceLevel: prev.spiceLevel === lvl ? null : lvl }))}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-0.5 ${
                    filters.spiceLevel === lvl
                      ? 'bg-[#E07A24] text-white shadow-2xs'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-orange-50'
                  }`}
                >
                  <span>{lvl}</span>
                  <span className="text-[10px]">🌶️</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Jar Size Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              {t('filter.size')} / Jar Weight
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {['all', '250g', '500g', '1kg'].map(sz => (
                <button
                  key={sz}
                  onClick={() => setFilters(prev => ({ ...prev, selectedSize: sz }))}
                  className={`py-1.5 rounded-lg text-xs font-semibold text-center ${
                    filters.selectedSize === sz
                      ? 'bg-[#E07A24] text-white'
                      : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {sz === 'all' ? 'All' : sz}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Max Price Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-800">
              <span>{t('filter.price')}</span>
              <span className="text-[#E07A24] font-bold">৳{filters.minPrice} - ৳{filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2000"
              step="50"
              value={filters.maxPrice}
              onChange={e => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-full accent-[#E07A24] cursor-pointer"
            />
          </div>

          {/* 4. Quick Toggles */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-800 block">
              Preferences
            </label>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyInStock}
                  onChange={e => setFilters(prev => ({ ...prev, onlyInStock: e.target.checked }))}
                  className="rounded text-[#E07A24] focus:ring-[#E07A24] w-4 h-4"
                />
                <span>{t('filter.inStock')}</span>
              </label>
              <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onlyOrganic}
                  onChange={e => setFilters(prev => ({ ...prev, onlyOrganic: e.target.checked }))}
                  className="rounded text-[#E07A24] focus:ring-[#E07A24] w-4 h-4"
                />
                <span>১০০% খাঁটি সরিষার তেল ও ঘরোয়া</span>
              </label>
            </div>
          </div>

        </div>
      )}

      {/* Results Count and Active Tags */}
      <div className="flex items-center justify-between text-xs text-stone-500 px-1 font-medium">
        <div>
          <span>Showing </span>
          <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong>
          <span> of {products.length} homemade pickles</span>
        </div>
        {filters.searchQuery && (
          <span className="text-[#E07A24] font-semibold">
            Search keyword: "{filters.searchQuery}"
          </span>
        )}
      </div>
    </div>
  );
};
