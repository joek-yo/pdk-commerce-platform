import React from 'react';
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';

const TrustBar = () => {
  const features = [
    { icon: <FaTruck />, title: "Fast Delivery", desc: "Kenya Wide" },
    { icon: <FaShieldAlt />, title: "Secure Pay", desc: "Encrypted" },
    { icon: <FaUndo />, title: "Easy Returns", desc: "7 Day Policy" },
    { icon: <FaHeadset />, title: "24/7 Support", desc: "We're Active" },
  ];

  return (
    <div className="relative z-30 px-4 -mt-10 sm:-mt-14 max-w-6xl mx-auto">
      {/* Standardized to rounded-2xl with a subtle glass border effect */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.07)] border border-white/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 items-center">
          {features.map((f, i) => (
            <div 
              key={i} 
              className={`flex flex-col md:flex-row items-center gap-4 text-center md:text-left group relative ${
                i !== features.length - 1 ? 'md:border-r border-slate-100/80 pr-2' : ''
              }`}
            >
              {/* Double-layered icon for depth */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#FDB813] opacity-20 blur-lg rounded-full group-hover:opacity-40 transition-opacity" />
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-900 group-hover:bg-[#FDB813] group-hover:border-[#FDB813] group-hover:text-black transition-all duration-500 shadow-sm">
                  <span className="text-xl md:text-2xl">{f.icon}</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <h4 className="font-black text-slate-900 text-[10px] sm:text-[11px] uppercase tracking-tighter">
                  {f.title}
                </h4>
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.15em] opacity-80">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;