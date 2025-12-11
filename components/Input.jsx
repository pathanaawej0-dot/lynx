'use client';

import { forwardRef, useState } from 'react';

const Input = forwardRef(function Input({
  label,
  type = 'text',
  error,
  className = '',
  ...props
}, ref) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value || props.defaultValue;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-3 bg-transparent border rounded-sm
          text-text-primary placeholder-transparent
          transition-all duration-200
          focus:outline-none
          ${error 
            ? 'border-red-500 focus:border-red-500' 
            : 'border-border focus:border-primary'
          }
          peer
        `}
        placeholder={label}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {label && (
        <label
          className={`
            absolute left-4 transition-all duration-200 pointer-events-none
            ${(focused || hasValue)
              ? '-top-2.5 text-xs bg-background px-1'
              : 'top-3 text-sm'
            }
            ${error ? 'text-red-500' : focused ? 'text-primary' : 'text-text-secondary'}
          `}
        >
          {label}
        </label>
      )}
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
});

export default Input;
