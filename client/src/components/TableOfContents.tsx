import { spellSchools, getSchoolColor } from '@/lib/spellData';
import { ChevronRight } from 'lucide-react';

interface TableOfContentsProps {
  onSchoolSelect: (schoolName: string, pageIndex: number) => void;
  schoolPageMap: Record<string, number>;
}

export default function TableOfContents({ onSchoolSelect, schoolPageMap }: TableOfContentsProps) {
  return (
    <div className="h-full flex flex-col p-6">
      <div className="text-center mb-6">
        <div className="font-serif text-3xl font-bold tracking-wide text-amber-900 mb-1">
          Table of Contents
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-700 to-transparent mx-auto" />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="space-y-2">
          {spellSchools.map((school) => {
            const pageNum = schoolPageMap[school.name] || 1;
            return (
              <button
                key={school.name}
                onClick={() => onSchoolSelect(school.name, pageNum)}
                className="w-full group flex items-center justify-between py-2 px-3 rounded-md hover:bg-amber-900/10 transition-colors"
                data-testid={`toc-${school.name.toLowerCase()}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: school.color }}
                  />
                  <span 
                    className="font-serif text-lg font-medium"
                    style={{ color: getSchoolColor(school.name) }}
                  >
                    {school.name} Spells
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">
                    {school.spells.length} spells
                  </span>
                  <span className="text-xs opacity-60">
                    p.{pageNum}
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-amber-900/20 text-center">
        <p className="text-xs text-muted-foreground italic">
          Click on a school to jump to its spells
        </p>
      </div>
    </div>
  );
}
