import React from 'react';
import { Droplet, Heart, Truck, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrustBadges: React.FC = () => {
  const { lang } = useLanguage();

  const badges = [
    {
      icon: Droplet,
      iconBg: 'bg-amber-50/80 border border-amber-200/80 text-[#D97706]',
      title: {
        bn: 'খাঁটি সরিষার তেল',
        en: '100% Pure Cold-Pressed Mustard Oil'
      },
      desc: {
        bn: 'কোনো কেমিক্যাল বা প্রিজারভেটিভ নেই',
        en: 'Zero artificial preservatives or chemical colors'
      }
    },
    {
      icon: Heart,
      iconBg: 'bg-amber-50/80 border border-amber-200/80 text-[#B45309]',
      title: {
        bn: 'ঘরোয়া পরিচ্ছন্ন পরিবেশে তৈরি',
        en: 'Hygienically Handcrafted at Home'
      },
      desc: {
        bn: 'নানী-দাদীদের খাঁটি রেসিপি',
        en: 'Authentic heritage grandmother recipes'
      }
    },
    {
      icon: Truck,
      iconBg: 'bg-orange-50/80 border border-orange-200/80 text-[#EA580C]',
      title: {
        bn: 'সারা দেশে হোম ডেলিভারি',
        en: 'Nationwide Express Home Delivery'
      },
      desc: {
        bn: 'ঢাকাতে ২৪-৪৮ ঘণ্টা, ঢাকার বাইরে ২-৪ দিন',
        en: 'Dhaka: 24-48 hrs, Outside Dhaka: 2-4 days'
      }
    },
    {
      icon: ShieldCheck,
      iconBg: 'bg-stone-100/80 border border-stone-200/80 text-stone-700',
      title: {
        bn: 'ক্যাশ অন ডেলিভারি',
        en: 'Cash on Delivery (COD)'
      },
      desc: {
        bn: 'পণ্য দেখে টাকা পরিশোধ',
        en: 'Inspect your order before making payment'
      }
    }
  ];

  return (
    <section className="w-full">
      {/* Container matching uploaded image.png exactly: clean card with rounded borders */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-2xs">
        {/* On mobile: vertical stack exactly like image.png; On desktop: 2 or 4 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 sm:p-4 rounded-2xl bg-white sm:bg-stone-50/40 border border-stone-200/70 sm:border-stone-200/80 flex items-center gap-3.5 sm:gap-4 hover:border-amber-300/80 hover:bg-amber-50/20 transition-all duration-200"
              >
                {/* Icon Squircle exactly as in image.png */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${badge.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <h4 className="text-sm sm:text-[15px] font-bold text-stone-900 leading-snug tracking-tight">
                    {lang === 'bn' ? badge.title.bn : badge.title.en}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                    {lang === 'bn' ? badge.desc.bn : badge.desc.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
