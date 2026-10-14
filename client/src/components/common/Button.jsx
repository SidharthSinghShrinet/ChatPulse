import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled = false,
  onClick,
  icon: Icon = null,
  className = '',
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 border border-indigo-400/30',
    secondary:
      'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 hover:border-slate-600',
    ghost:
      'bg-transparent hover:bg-slate-800/50 text-slate-400 hover:text-slate-200',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        ${baseStyles}
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.primary}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 size={18} className="animate-spin text-white" />
          <span>Processing...</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2">
          {Icon && <Icon size={18} className="shrink-0" />}
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
