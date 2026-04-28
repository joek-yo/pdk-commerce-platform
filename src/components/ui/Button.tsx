"use client";

import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger"
  | "success"
  | "whatsapp"
  | "outline";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;

  variant?: ButtonVariant;
  size?: ButtonSize;

  fullWidth?: boolean;
  className?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  /** For icon-only buttons (navbar, cart, hamburger, etc) */
  iconOnly?: boolean;
  "aria-label"?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-[#FDB813] text-black hover:bg-[#C2922F]",
  secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
  ghost: "bg-transparent text-gray-800 hover:bg-gray-100",
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-green-900 text-white hover:bg-green-800",
  whatsapp: "bg-green-600 text-white hover:bg-green-700",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

export default function Button({
  children,
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  leftIcon,
  rightIcon,
  iconOnly = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-lg
        transition-all duration-200

        ${variants[variant]}
        ${sizes[size]}

        ${fullWidth ? "w-full" : ""}

        ${(disabled || loading) ? "opacity-50 cursor-not-allowed" : ""}

        ${iconOnly ? "p-3 aspect-square" : ""}

        ${className}
      `}
    >
      {/* LEFT ICON */}
      {leftIcon && !loading && (
        <span className="flex items-center">{leftIcon}</span>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      ) : (
        !iconOnly && children
      )}

      {/* RIGHT ICON */}
      {rightIcon && !loading && (
        <span className="flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}