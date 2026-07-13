"use client";

import React from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex items-center w-14 h-8 rounded-full border border-border-strong bg-surface2 transition-colors duration-300 ${className}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gold flex items-center justify-center transition-transform duration-300 ease-out ${
          isDark ? "translate-x-6" : "translate-x-0"
        }`}
      >
        {isDark ? (
          <FaMoon size={11} className="text-background" />
        ) : (
          <FaSun size={11} className="text-background" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
