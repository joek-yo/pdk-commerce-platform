"use client";

import React from "react";

export const sectionCardClass =
  "bg-surface border-l-4 border-l-gold border-y border-r border-border p-5 rounded-xl shadow-sm mb-4 relative overflow-hidden";

export const sectionLabelClass =
  "flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-subtext mb-3 ml-1";

export const inputFieldClass =
  "w-full bg-surface2 border border-border p-3 rounded-lg text-foreground font-bold text-sm placeholder:text-muted focus:border-gold outline-none transition-all duration-200";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
}

const SectionCard: React.FC<SectionCardProps> = ({ children, className = "" }) => {
  return <section className={`${sectionCardClass} ${className}`}>{children}</section>;
};

export default SectionCard;
