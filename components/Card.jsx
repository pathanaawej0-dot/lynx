'use client';

export default function Card({
  children,
  className = '',
  padding = 'default',
  hover = false,
  onClick,
  ...props
}) {
  const paddingStyles = {
    none: '',
    small: 'p-3',
    default: 'p-4',
    large: 'p-6',
  };

  return (
    <div
      className={`
        bg-surface rounded-md shadow-elevation-1
        ${paddingStyles[padding]}
        ${hover ? 'hover:shadow-elevation-2 transition-shadow duration-200 cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
