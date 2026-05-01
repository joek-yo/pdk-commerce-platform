// components/home/AnnouncementBar.tsx

import React from "react";
import { getUIConfig } from "@/lib/getBusinessData";

const AnnouncementBar: React.FC = () => {
  const { announcement } = getUIConfig();

  // Return null if there is no text or if the bar is set to inactive
  if (!announcement?.active || !announcement?.text) return null;

  return (
    <div className="bg-slate-900 text-[#FDB813] py-2.5 px-4 relative z-[60] overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[#FDB813]/5 animate-pulse" />
      
      <div className="max-w-7xl mx-auto flex items-center justify-center relative z-10">
        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-center leading-none">
          {announcement.text}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;