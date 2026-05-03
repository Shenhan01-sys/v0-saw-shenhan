import { useRef, useCallback } from 'react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  disabled?: boolean;
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  disabled = false
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={containerRef}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`transition-all duration-200 ease-out hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}