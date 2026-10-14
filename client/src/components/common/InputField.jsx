import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const InputField = ({
  label,
  id,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  error = '',
  helperText = '',
  icon: Icon = null,
  disabled = false,
  autoComplete = 'off',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5 mb-4">
      {label && (
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1">
          {label} {required && <span className="text-indigo-400">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center transition-colors">
            <Icon size={18} />
          </span>
        )}

        <input
          id={id}
          type={effectiveType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`w-full h-11 px-4 text-sm rounded-xl font-medium text-slate-100 bg-slate-900/60 border transition-all duration-200 outline-none
            placeholder:text-slate-500 placeholder:font-normal
            ${Icon ? 'pl-11' : ''}
            ${isPassword ? 'pr-11' : ''}
            ${
              error
                ? 'border-rose-500/80 bg-rose-500/10 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 focus:bg-slate-900/90'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />

        {isPassword && (
          <button
            type="button"
            className="absolute right-3.5 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mt-0.5">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default InputField;
