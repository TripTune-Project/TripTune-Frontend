import React, { memo, useCallback } from 'react';
import styles from '@/styles/Button.module.css';
import { ButtonVariant, ButtonSize, WithChildren, WithOnClick, WithDisabled } from '@/types/common';

interface ButtonProps extends WithChildren, WithOnClick, WithDisabled {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = memo(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  'aria-label': ariaLabel,
}) => {
  const handleClick = useCallback(() => {
    if (disabled) return;
    onClick?.();
  }, [disabled, onClick]);

  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    className,
  ].join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 