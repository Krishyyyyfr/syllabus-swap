import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const wordSize = {
  sm: 'text-2xl sm:text-3xl',
  md: 'text-3xl sm:text-4xl',
  lg: 'text-4xl sm:text-5xl',
};

export default function BrandLogo({ className, size = 'md' }: BrandLogoProps) {
  return (
    <span className={cn('inline-flex items-baseline min-w-0 font-extrabold tracking-tight leading-none', wordSize[size], className)}>
      <span className="text-secondary">Edu</span>
      <span className="text-navy">mart</span>
    </span>
  );
}
