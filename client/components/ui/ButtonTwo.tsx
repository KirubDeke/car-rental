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
    'text-black dark:text-black bg-white dark:bg-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2';

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
