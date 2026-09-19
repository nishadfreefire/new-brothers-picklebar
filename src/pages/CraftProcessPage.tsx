import React from 'react';
import { Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';
import { ArtisanalStorySection } from '../components/ArtisanalStorySection';
import { CraftVideoPlayer } from '../components/CraftVideoPlayer';
import { navigateTo } from '../utils/router';

export const CraftProcessPage: React.FC = () => {
  const { lang } = useLanguage();
  const { settings } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
      {/* Top Header & Video Hero */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-[#C96818] text-xs font-black uppercase tracking-wider border border-amber-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'আচার তৈরির ঐতিহ্য ও প্রস্তুত প্রণালী' : 'Artisanal Craft & Making Process'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black font-serif text-stone-900 tracking-tight">
              {settings?.craftVideoTitle || (lang === 'bn' ? 'প্রাকৃতিক উপায়ে খাঁটি আচার তৈরির গল্প' : 'Our Artisanal Pickle Making Process')}
            </h1>
          </div>

          <div>
            <button
              onClick={() => navigateTo('/')}
              className="px-5 py-2.5 rounded-full bg-[#E07A24] hover:bg-[#C96818] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95 whitespace-nowrap"
            >
              <span>{lang === 'bn' ? 'আচার অর্ডার করুন' : 'Order Pickles'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player (Plays automatically on page open) */}
        <CraftVideoPlayer
          videoUrl={settings?.craftVideoUrl || 'https://www.youtube.com/watch?v=7WT93V_29uA'}
          videoTitle={settings?.craftVideoTitle}
          autoplay={settings?.craftVideoAutoplay ?? true}
        />
      </div>

      {/* 4 Steps Section */}
      <ArtisanalStorySection />

      {/* Quality Standards Comparison */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-stone-200 shadow-xs space-y-4 sm:space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#15803D] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {lang === 'bn' ? 'আমাদের কোয়ালিটি স্ট্যান্ডার্ড' : 'Purity Standards'}
          </span>
          <h2 className="text-lg sm:text-2xl font-black font-serif text-stone-900">
            {lang === 'bn' ? 'সাধারণ বাজার বনাম নিউ ব্রাদার পিকলবার' : 'Commercial Pickles vs. New Brother Pickles'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 pt-1">
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2">
            <h3 className="font-bold text-rose-900 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="text-sm sm:text-base">❌</span>
              <span>{lang === 'bn' ? 'সাধারণ বাণিজ্যিক আচার' : 'Commercial Pickles'}</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] sm:text-xs text-rose-800">
              <li>• সস্তা পাম অয়েল বা ভেজাল সয়াবিন তেল ব্যবহার করে।</li>
              <li>• স্বাদ ও স্থায়িত্ব বাড়াতে ক্ষতিকর কেমিক্যাল মেশায়।</li>
              <li>• নিম্নমানের প্লাস্টিক বা পাতলা বয়ামে সংরক্ষণ।</li>
              <li>• কৃত্রিম লাল/হলুদ ফুড কালার দিয়ে আকর্ষণীয় রূপ।</li>
            </ul>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 space-y-2">
            <h3 className="font-bold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
              <span className="text-sm sm:text-base">✅</span>
              <span>{lang === 'bn' ? 'নিউ ব্রাদার পিকলবারের খাঁটি আচার' : 'New Brother Pickles'}</span>
            </h3>
            <ul className="space-y-1.5 text-[11px] sm:text-xs text-emerald-900">
              <li>• ১০০% কাঠের ঘানির ১ম প্রেস খাঁটি ঝাঁঝালো সরিষার তেল।</li>
              <li>• শূন্য প্রিজারভেটিভ—স্বাভাবিক রোদে শুকিয়ে তৈরি।</li>
              <li>• ফুড-গ্রেড এয়ারটাইট কাঁচের বয়ামে প্যাকেজিং।</li>
              <li>• কোনো কৃত্রিম কালার বা ফ্লেভার নয়, প্রাকৃতিক স্বাদ।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
