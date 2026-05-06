'use client';

interface ShimmerTextProps {
  text: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

export function ShimmerText({
  text,
  className = '',
  as: Component = 'span'
}: ShimmerTextProps) {
  return (
    <Component className={`inline-block cursor-pointer ${className}`}>
      {text.split('').map((char, index) => {
        if (char === ' ') {
          return <span key={index} className="inline-block w-[0.3em]">&nbsp;</span>;
        }
        return (
          <span
            key={index}
            className="inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-[length:200%_100%] text-transparent bg-clip-text animate-shimmer"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {char}
          </span>
        );
      })}
    </Component>
  );
}

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
  direction?: 'left' | 'right' | 'up' | 'down';
  animate?: boolean;
}

export function GradientText({
  children,
  className = '',
  from = '#6366f1',
  to = '#06b6d4',
  animate = true
}: GradientTextProps) {
  return (
    <span
      className={`inline-block text-transparent bg-clip-text ${animate ? 'animate-gradient-shift' : ''} ${className}`}
      style={{
        backgroundImage: `linear-gradient(-70deg, ${from}, ${to})`,
      }}
    >
      {children}
    </span>
  );
}
