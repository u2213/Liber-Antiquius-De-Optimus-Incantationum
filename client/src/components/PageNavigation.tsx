import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  onFirst: () => void;
  onLast: () => void;
}

export default function PageNavigation({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  onFirst,
  onLast,
}: PageNavigationProps) {
  return (
    <div 
      className="flex items-center justify-center gap-2 py-3 px-4 rounded-full"
      style={{
        background: 'linear-gradient(180deg, hsl(20 40% 20%), hsl(15 35% 15%))',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
      data-testid="page-navigation"
    >
      <Button
        size="icon"
        variant="ghost"
        onClick={onFirst}
        disabled={currentPage <= 1}
        className="text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/20 disabled:opacity-30"
        data-testid="nav-first"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        className="text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/20 disabled:opacity-30"
        data-testid="nav-previous"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <div className="px-4 text-center min-w-[100px]">
        <span className="text-amber-200/90 font-serif text-sm">
          Page <span className="font-semibold">{currentPage}</span> of {totalPages}
        </span>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        className="text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/20 disabled:opacity-30"
        data-testid="nav-next"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      <Button
        size="icon"
        variant="ghost"
        onClick={onLast}
        disabled={currentPage >= totalPages}
        className="text-amber-200/70 hover:text-amber-100 hover:bg-amber-900/20 disabled:opacity-30"
        data-testid="nav-last"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
