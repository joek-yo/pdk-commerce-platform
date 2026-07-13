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

  iconOnly?: boolean;
  "aria-label"?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-gold text-background hover:bg-gold-strong",
  secondary: "bg-surface2 text-foreground hover:bg-border",
  ghost: "bg-transparent text-foreground hover:bg-surface2",
  danger: "bg-danger text-background hover:opacity-90",
  success: "bg-whatsapp text-background hover:opacity-90",
  whatsapp: "bg-whatsapp text-background hover:opacity-90",
  outline: "border border-border-strong text-foreground hover:bg-surface2",
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
        ${!(disabled || loading) ? "cursor-pointer" : "cursor-not-allowed opacity-50"}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${iconOnly ? "p-3 aspect-square" : ""}
        ${className}
      `}
    >
      {leftIcon && !loading && (
        <span className="flex items-center">{leftIcon}</span>
      )}

      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      ) : (
        !iconOnly && children
      )}

      {rightIcon && !loading && (
        <span className="flex items-center">{rightIcon}</span>
      )}
    </button>
  );
}
