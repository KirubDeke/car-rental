'use client';

import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
};

const ButtonTwo: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  className = '',
  onClick,
  disabled = false,
}) => {
  const baseClasses =
    'text-foreground dark:text-foreground bg-white dark:bg-background border border-gray-100 dark:border-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default ButtonTwo;
