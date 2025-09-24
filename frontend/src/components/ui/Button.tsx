import React, { ButtonHTMLAttributes } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

type ButtonVariant = Exclude<ButtonProps['variant'], undefined>;
type ButtonSize = Exclude<ButtonProps['size'], undefined>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:opacity-60 disabled:cursor-not-allowed';

  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-primary-500 text-white hover:bg-primary-400 focus-visible:ring-primary-400 shadow-sm',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-400 focus-visible:ring-secondary-400 shadow-sm',
    outline: 'border border-white/15 text-slate-100 hover:bg-white/10 focus-visible:ring-primary-400',
    ghost: 'text-slate-200 hover:text-white hover:bg-white/10 focus-visible:ring-white/30',
    danger: 'bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-400 shadow-sm',
  };

  const sizeClasses: Record<ButtonSize, string> = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-2.5 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const isDisabled = disabled || loading;

  const spinnerColor: 'primary' | 'secondary' | 'white' =
    variant === 'outline' || variant === 'ghost' ? 'primary' : 'white';

  const variantKey = variant as ButtonVariant;
  const sizeKey = size as ButtonSize;

  const content = (
    <span className="inline-flex items-center justify-center gap-2 text-current">
      {loading && (
        <LoadingSpinner size="small" color={spinnerColor} className="shrink-0" />
      )}
      {!loading && leftIcon && <span className="flex items-center justify-center">{leftIcon}</span>}
      <span className="font-medium">{children}</span>
      {!loading && rightIcon && <span className="flex items-center justify-center">{rightIcon}</span>}
    </span>
  );

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variantKey]}
        ${sizeClasses[sizeKey]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {content}
    </button>
  );
};

export default Button;
