import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'h-10 sm:h-11',
  md: 'h-11 sm:h-12',
  lg: 'h-12 sm:h-14',
};

export default function BrandLogo({ className, size = 'md' }: BrandLogoProps) {
  return (
    <img
      src="/edumarts-logo.png"
      alt="Edumarts"
      className={cn('w-auto object-contain object-left', sizeClass[size], className)}
    />
  );
}
