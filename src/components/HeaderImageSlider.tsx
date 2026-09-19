import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface Slide {
  id: number;
  badge: { bn: string; en: string };
  title: { bn: string; en: string };
  subtitle: { bn: string; en: string };
  ctaText: { bn: string; en: string };
  ctaAction: 'products' | 'combo' | 'spicy';
  image: string;
}

export const HeaderImageSlider: React.FC = () => {
  const { lang } = useLanguage();
  const { setFilters } = useStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number>(0);

  const slides: Slide[] = [
    {
      id: 1,
      badge: {
        bn: '১০০% খাঁটি সরিষার তেল ও রোদে শুকানো মসলা',
        en: '100% Pure Mustard Oil & Sun-Dried Spices'
      },
      title: {
        bn: 'গ্রামবাংলার ঐতিহ্যবাহী খাঁটি হোমমেড আচার',
        en: 'Authentic Traditional Homemade Pickles'
      },
      subtitle: {
        bn: 'রাজশাহীর কাঁচা আম, আখের গুড় ও খাঁটি পাঁচফোড়নে তৈরি। কোনো কেমিক্যাল প্রিজারভেটিভ নেই।',
        en: 'Handcrafted with sun-ripened mangoes and whole spices. Zero artificial preservatives.'
      },
      ctaText: {
        bn: 'আচার কালেকশন দেখুন',
        en: 'Explore Pickles'
      },
      ctaAction: 'products',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 2,
      badge: {
        bn: '🎁 স্পেশাল অফার | কাস্টম বক্স ডিসকাউন্ট',
        en: 'Special Offer | Custom 3-Jar Box'
      },
      title: {
        bn: 'আপনার পছন্দের ৩টি আচারে তৈরি করুন কম্বো বক্স',
        en: 'Craft Your Signature 3-Jar Tasting Box'
      },
      subtitle: {
        bn: 'যেকোনো ৩টি আচার একসাথে নিলে পাচ্ছেন বিশেষ ছাড়! Use Coupon: PICKLE10',
        en: 'Select any 3 gourmet pickles and enjoy instant bundle savings with code PICKLE10.'
      },
      ctaText: {
        bn: 'কম্বো বক্স বানান',
        en: 'Build Combo Box'
      },
      ctaAction: 'combo',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 3,
      badge: {
        bn: '🌶️ সিগনেচার স্পাইসি | খাঁটি নাগা ও রসুন আচার',
        en: 'Fiery Signature | Sylheti Naga & Garlic'
      },
      title: {
        bn: 'আসল সিলেটি নাগা মরিচ ও খাঁটি রসুনের আচার',
        en: 'Authentic Naga Morich & Garlic Pickle'
      },
      subtitle: {
        bn: 'ঘানির খাঁটি সরিষার তেল ও আসল নাগা মরিচের সুবাসিত তীব্র ঝাঁঝ—গরম ভাত ও খিচুড়ির সেরা সঙ্গী।',
        en: 'Infused with cold-pressed mustard oil and aromatic ghost peppers for authentic Bengali heat.'
      },
      ctaText: {
        bn: 'ঝাল আচার দেখুন',
        en: 'View Spicy Pickles'
      },
      ctaAction: 'spicy',
      image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  // Auto slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  };

  const handleAction = (action: Slide['ctaAction']) => {
    if (action === 'products') {
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'combo') {
      const el = document.getElementById('combo-box-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (action === 'spicy') {
      setFilters(prev => ({ ...prev, tasteProfiles: ['Jhal (Spicy)', 'Naga Hot'] }));
      const el = document.getElementById('products-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div 
        className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md select-none bg-[#24130A]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (diff > 50) handleNext();
          if (diff < -50) handlePrev();
        }}
      >
        {/* Background Slide Image with Smooth Fade */}
        {slides.map((s, idx) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={s.image}
              alt={s.title.en}
              className="w-full h-full object-cover object-center"
            />
            {/* Elegant Vignette Overlay: dark on left for text readability, clearer on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#1E0F07]/95 via-[#2A160C]/75 to-transparent"></div>
          </div>
        ))}

        {/* Content Box */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 md:px-14 max-w-2xl">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#5C3826]/80 text-amber-200 border border-amber-300/30 text-[10px] sm:text-xs font-semibold backdrop-blur-xs w-fit mb-2">
            <ShieldCheck className="w-3 h-3 text-amber-300 shrink-0" />
            <span className="truncate">{lang === 'bn' ? current.badge.bn : current.badge.en}</span>
          </div>

          {/* Heading */}
          <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white font-serif tracking-tight leading-tight sm:leading-snug drop-shadow-xs">
            {lang === 'bn' ? current.title.bn : current.title.en}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 mt-1.5 sm:mt-2 max-w-lg drop-shadow-xs">
            {lang === 'bn' ? current.subtitle.bn : current.subtitle.en}
          </p>

          {/* Action Row */}
          <div className="flex items-center gap-3 mt-3 sm:mt-4">
            <button
              onClick={() => handleAction(current.ctaAction)}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-1.5 transform active:scale-95 cursor-pointer"
            >
              <span>{lang === 'bn' ? current.ctaText.bn : current.ctaText.en}</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-200/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
              {lang === 'bn' ? '১০০% প্রাকৃতিক খাঁটি স্বাদ' : '100% Homemade'}
            </span>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-[#5C3826] text-white/90 hover:text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 hover:bg-[#5C3826] text-white/90 hover:text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Dots Navigation */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentSlide === idx ? 'w-5 bg-[#15803D]' : 'w-1.5 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
