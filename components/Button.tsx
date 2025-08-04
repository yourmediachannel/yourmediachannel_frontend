import React from 'react';

interface ButtonProps {
  href?: string;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-5 py-2.5 text-base rounded-lg',
  lg: 'px-6 py-3 text-lg rounded-lg',
};

const Button: React.FC<ButtonProps> = ({ label, onClick, href, size = 'lg' }) => {
  const baseClasses =
    'bg-primary cursor-pointer hover:-translate-y-1 duration-300 text-black font-semibold tracking-wider shadow-[4px_4px_0px_#0F3B24] hover:opacity-90 transition';
  const sizeClass = sizeClasses[size];

  if (href) {
    return (
      <a href={href} onClick={onClick} className={`${baseClasses} ${sizeClass}`}>
        {label}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${sizeClass}`}>
      {label}
    </button>
  );
};

export default Button;
