import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeMap = {
    sm: { container: 'h-9 w-9', text: 'text-sm', sub: 'text-[9px]' },
    md: { container: 'h-11 w-11', text: 'text-base sm:text-lg', sub: 'text-[10px]' },
    lg: { container: 'h-16 w-16', text: 'text-xl sm:text-2xl', sub: 'text-xs' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Artisanal Seal Emblem */}
      <div className={`relative ${currentSize.container} shrink-0 rounded-full bg-[#382115] p-0.5 shadow-sm ring-1 ring-[#8B5A2B]/40 flex items-center justify-center overflow-hidden`}>
        {/* Outer decorative ring */}
        <div className="w-full h-full rounded-full border border-amber-300/40 bg-[#25150D] flex flex-col items-center justify-center relative p-1 text-center">
          {/* Decorative subtle stars */}
          <div className="absolute inset-0 flex items-center justify-between px-1 opacity-50">
            <span className="text-[6px] text-amber-300">✦</span>
            <span className="text-[6px] text-amber-300">✦</span>
          </div>

          {/* Jar & Fork Icon representation */}
          <div className="w-5 h-6 bg-[#FFF9EE] rounded-xs border border-amber-900/50 relative flex flex-col items-center justify-end overflow-hidden shadow-inner">
            {/* Jar Lid */}
            <div className="w-6 h-1.5 bg-[#5C3826] -mt-1 rounded-t-xs border-b border-amber-950"></div>
            {/* Pickle Chunks inside mustard oil */}
            <div className="w-full h-3.5 bg-amber-500/80 relative p-0.5 flex flex-wrap gap-0.5 items-center justify-center">
              <span className="w-1.5 h-1.5 bg-emerald-700 rounded-xs transform rotate-12"></span>
              <span className="w-1.5 h-1.5 bg-emerald-800 rounded-xs transform -rotate-45"></span>
              <span className="w-1 h-1 bg-red-700 rounded-full"></span>
            </div>
            {/* Fork picking achar */}
            <div className="absolute top-0.5 right-0.5 w-2 h-0.5 bg-stone-900 transform -rotate-45"></div>
          </div>

          <span className="text-[5px] tracking-wider text-amber-200 font-bold uppercase mt-0.5">EST. 2025</span>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold tracking-tight text-[#2C241E] leading-none text-sm sm:text-base md:text-lg font-serif">
              New Brother
            </span>
            <span className="bg-[#5C3826] text-amber-100 text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wider uppercase">
              PICKLEBAR
            </span>
          </div>
          <span className={`text-[#7A5239] font-medium tracking-tight ${currentSize.sub} hidden xs:inline-block`}>
            Artisanal 100% Homemade Achar
          </span>
        </div>
      )}
    </div>
  );
};
