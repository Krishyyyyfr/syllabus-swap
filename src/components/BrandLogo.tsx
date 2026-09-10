import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'h-9 sm:h-11',
  md: 'h-11 sm:h-14',
  lg: 'h-12 sm:h-16 md:h-20',
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
