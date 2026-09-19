import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck, Heart, Lock, Truck } from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { useLanguage } from '../context/LanguageContext';
import { navigateTo } from '../utils/router';

export const Footer: React.FC = () => {
  const { setIsAdminOpen, setIsTrackingOpen, settings } = useStore();
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-12 pb-8 border-t-4 border-[#E07A24]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Logo className="w-12 h-12 shadow-md" />
              <div>
                <span className="font-serif text-lg font-black tracking-wider text-white block">
                  NEW BROTHER
                </span>
                <span className="text-[10px] tracking-widest text-[#E07A24] font-extrabold uppercase">
                  PICKLEBAR • খাঁটি আচারের ঘর
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 leading-relaxed">
              ঐতিহ্যবাহী গ্রামীণ রেসিপিতে তৈরি খাঁটি কাঠের ঘানির সরিষার তেলে জারিত সেরা স্বাদের স্পেশাল আচার। নো কেমিক্যাল, শতভাগ ন্যাচারাল।
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs text-[#E07A24] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#E07A24]" />
              <span>100% Taste & Purity Guarantee</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              কুইক লিংকস / Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/about')}
                  className="hover:text-[#E07A24] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-amber-400" />
                  <span>আমাদের গল্প ও পরিচিতি (About Us)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/craft')}
                  className="hover:text-[#E07A24] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>আচার তৈরির প্রস্তুত প্রণালী (Our Craft)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsTrackingOpen(true)}
                  className="hover:text-[#E07A24] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5 text-[#E07A24]" />
                  <span>লাইভ অর্ডার ট্র্যাকিং (Track Order)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/')}
                  className="hover:text-[#E07A24] transition-colors cursor-pointer"
                >
                  সব আচারের মেনু (All Pickles)
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/8801711234567`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400 font-bold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Delivery Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              ডেলিভারি এলাকা ও নিয়ম
            </h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p>📍 <strong>ঢাকা সিটি:</strong> ৳৭০ (২৪-৪৮ ঘণ্টায় হোম ডেলিভারি)</p>
              <p>📍 <strong>গাজীপুর/সাভার/নারায়ণগঞ্জ:</strong> ৳১০০</p>
              <p>📍 <strong>সারা বাংলাদেশ:</strong> ৳১৩০ (ক্যাশ অন ডেলিভারি)</p>
              <p className="text-[#E07A24] font-bold">✨ ৳{settings?.freeDeliveryThreshold || 1500}+ অর্ডারে ডেলিভারি ফ্রি!</p>
            </div>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-serif">
              যোগাযোগ ও হেল্পলাইন
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E07A24] shrink-0" />
                <span className="font-bold text-white text-sm">{settings?.contactPhone || '01711-234567'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E07A24] shrink-0" />
                <span>support@newbrotherpicklebar.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E07A24] shrink-0 mt-0.5" />
                <span>House 42, Road 11, Dhanmondi, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} New Brother Picklebar. All rights reserved. Handcrafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>in Bangladesh.</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-medium text-stone-400">Supported Payments:</span>
            <span className="bg-stone-800 px-2.5 py-1 rounded text-[11px] font-semibold text-white">Cash on Delivery</span>
            <span className="bg-[#D12053] px-2.5 py-1 rounded text-[11px] font-bold text-white">bKash</span>
            <span className="bg-[#F7941D] px-2.5 py-1 rounded text-[11px] font-bold text-white">Nagad</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
