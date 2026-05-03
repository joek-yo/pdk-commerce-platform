// src components/layout/drawer/SocialProofSection.tsx

import React from "react";
import { getBusinessData } from "@/lib/getBusinessData";

const SocialProofSection = () => {
  const { socialProof } = getBusinessData();

  return (
    <div className="text-[10px] space-y-2">
      {socialProof.map((item: any) => (
        <p key={item.id}>
          {item.text}
        </p>
      ))}
    </div>
  );
};

export default SocialProofSection;