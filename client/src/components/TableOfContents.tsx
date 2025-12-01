import { spellSchools, getSchoolColor } from '@/lib/spellData';
import { ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  onSchoolSelect: (schoolName: string, pageIndex: number) => void;
  schoolPageMap: Record<string, number>;
}

export default function TableOfContents({ onSchoolSelect, schoolPageMap }: TableOfContentsProps) {
  return (
    <div className="h-full flex flex-col p-3 sm:p-4">
      <div className="text-center mb-3 sm:mb-4 flex-shrink-0">
        <div className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-amber-900 mb-1">
          Table of Contents
        </div>
        <div className="w-24 sm:w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto" />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="space-y-1 sm:space-y-1.5">
          {spellSchools.map((school) => {
            const pageNum = schoolPageMap[school.name] || 1;
            return (
              <button
                key={school.name}
                onClick={() => onSchoolSelect(school.name, pageNum)}
                className="w-full group flex items-center justify-between py-1.5 sm:py-2 px-2 sm:px-3 rounded-md hover:bg-amber-900/10 active:bg-amber-900/15 transition-colors touch-manipulation"
                data-testid={`toc-${school.name.toLowerCase()}`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div 
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: school.color }}
                  />
                  <span 
                    className="font-serif text-sm sm:text-base font-medium"
                    style={{ color: getSchoolColor(school.name) }}
                  >
                    {school.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
                  <span className="text-xs sm:text-sm">
                    {school.spells.length}
                  </span>
                  <span className="text-[10px] sm:text-xs opacity-60">
                    p.{pageNum}
                  </span>
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-amber-900/20 text-center flex-shrink-0">
        <p className="text-[10px] sm:text-xs text-muted-foreground italic">
          Tap a school to view its spells
        </p>
      </div>
    </div>
  );
}
