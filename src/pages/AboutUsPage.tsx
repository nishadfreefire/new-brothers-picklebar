import React from 'react';
import { Award, Heart, ShieldCheck, MapPin, Phone, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ArtisanalGallery } from '../components/ArtisanalGallery';
import { navigateTo } from '../utils/router';

export const AboutUsPage: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#5C3826] via-[#4A2B1D] to-[#2C1810] text-white p-6 sm:p-12 lg:p-16 shadow-2xl border border-amber-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-400/30">
            <Heart className="w-3.5 h-3.5 fill-current text-amber-400" />
            <span>{lang === 'bn' ? 'আমাদের গল্প ও ঐতিহ্য' : 'Our Story & Heritage'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-amber-50 tracking-tight leading-tight">
            {lang === 'bn'
              ? 'মায়ের হাতের খাঁটি স্বাদের এক অনন্য প্রতিশ্রুতি'
              : 'The Legacy of Authentic Handcrafted Pickles'}
          </h1>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-medium">
            {lang === 'bn'
              ? 'বাঙালির পাতে এক চামচ খাঁটি আচার মানেই শৈশবের নস্টালজিয়া আর অমৃত তৃপ্তি। নিউ ব্রাদার পিকলবার ঘরে ঘরে সেই নির্ভেজাল ও স্বাস্থ্যকর স্বাদ পৌঁছে দিতে বদ্ধপরিকর।'
              : 'Dedicated to reviving the authentic, unadulterated flavors of generational home recipes with pure cold-pressed mustard oil and micro-batch artisan craft.'}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigateTo('/craft')}
              className="px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
            >
              <span>{lang === 'bn' ? 'আচার তৈরির প্রস্তুত প্রণালী দেখুন' : 'Explore Making Process'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigateTo('/')}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all cursor-pointer"
            >
              <span>{lang === 'bn' ? 'আচারের তালিকা দেখুন' : 'Browse All Pickles'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Origin Story & Values */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#5C3826] text-xs font-bold uppercase tracking-wider border border-amber-200">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'bn' ? 'আমাদের শুরু' : 'How We Started'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-serif text-stone-900">
            {lang === 'bn' ? 'খাঁটি আচারের খোঁজে এক নতুন অধ্যায়' : 'Crafted with Passion & Purity'}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {lang === 'bn'
              ? 'বাজারের প্যাকেটজাত ও ক্ষতিকর ভিনেগার-কেমিক্যাল মিশ্রিত আচারের ভিড়ে খাঁটি স্বাদ হারিয়ে যাচ্ছিল। আমরা চেয়েছি দেশের সেরা বাগান থেকে বাছাই করা টাটকা ফল, খাঁটি কাঠের ঘানির সরিষার তেল এবং মায়ের হাতের সিক্রেট রেসিপির সমন্বয়ে এমন এক আচার তৈরি করতে, যা প্রতিটি বাঙালির মনে তৃপ্তি এনে দেবে।'
              : 'In a market flooded with artificial preservatives and industrial oils, we set out to reclaim authentic taste by using strictly hand-selected seasonal fruits, genuine cold-pressed mustard oil, and traditional slow sun-curing.'}
          </p>
          <div className="space-y-2.5 pt-2">
            {[
              lang === 'bn' ? '১০০% প্রিজারভেটিভ ও কেমিক্যালমুক্ত' : '100% Free from artificial preservatives & color',
              lang === 'bn' ? 'খাঁটি কাঁচের বয়ামে স্বাস্থ্যসম্মত প্যাকেজিং' : 'Hygienically bottled inside premium glass jars',
              lang === 'bn' ? 'কাঠের ঘানির ১ম প্রেস খাঁটি সরিষার তেলে তৈরি' : 'Crafted exclusively in cold-pressed mustard oil',
              lang === 'bn' ? 'সারা বাংলাদেশে নির্ভরযোগ্য ক্যাশ অন ডেলিভারি' : 'Reliable cash on delivery nationwide across Bangladesh'
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-stone-800">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-stone-200">
          <img
            src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
            alt="Traditional Pickle Making"
            className="w-full h-80 sm:h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="bg-amber-500 text-stone-950 text-[11px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === 'bn' ? 'খাঁটি বাঙালি ঐতিহ্য' : 'Authentic Bengal Heritage'}
              </span>
              <h3 className="text-lg font-bold font-serif mt-1">
                {lang === 'bn' ? 'নিউ ব্রাদার পিকলবার — স্বাদে ও মানে আপসহীন' : 'New Brother Picklebar — No Compromise on Purity'}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Unboxing Moments & Gallery */}
      <ArtisanalGallery />

      {/* Contact & Support Section */}
      <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-10 border border-[#E8DCCF]">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
            {lang === 'bn' ? 'যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন' : 'Need Help or Custom Inquiries?'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600">
            {lang === 'bn'
              ? 'আমাদের আচার সম্পর্কে যেকোনো প্রশ্ন বা স্পেশাল অর্ডারের জন্য আমাদের কাস্টমার সাপোর্ট টিম সর্বদা প্রস্তুত।'
              : 'Our support team is always delighted to assist with pickle inquiries, bulk gift boxes, or delivery questions.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 text-xs sm:text-sm font-bold text-[#5C3826] shadow-2xs">
              <Phone className="w-4 h-4 text-[#15803D]" />
              <span>01700-000000 / 01800-000000</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-stone-200 text-xs sm:text-sm font-bold text-stone-800 shadow-2xs">
              <Mail className="w-4 h-4 text-amber-600" />
              <span>support@newbrotherpicklebar.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
