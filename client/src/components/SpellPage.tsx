import { Spell, getSchoolColor } from '@/lib/spellData';
import SpellCard from './SpellCard';

interface SpellPageProps {
  spells: Spell[];
  schoolName?: string;
  pageNumber: number;
  isSchoolHeader?: boolean;
  isLeftPage?: boolean;
}

export default function SpellPage({ spells, schoolName, pageNumber, isSchoolHeader, isLeftPage }: SpellPageProps) {
  const schoolColor = schoolName ? getSchoolColor(schoolName) : undefined;

  return (
    <div 
      className="h-full w-full relative overflow-hidden flex flex-col"
      style={{
        background: 'linear-gradient(135deg, hsl(39 35% 90%), hsl(35 28% 85%))',
      }}
      data-testid={`spell-page-${pageNumber}`}
    >
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-0 top-0 bottom-0 w-4 sm:w-6"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.08), transparent)',
          }}
        />
      </div>

      <div className="relative flex-1 flex flex-col p-2 sm:p-3 min-h-0">
        {isSchoolHeader && schoolName && (
          <div className="text-center mb-1.5 sm:mb-2 pb-1.5 sm:pb-2 border-b-2 flex-shrink-0" style={{ borderColor: schoolColor }}>
            <h2 
              className="font-serif text-base sm:text-lg font-bold tracking-wide"
              style={{ color: schoolColor }}
            >
              {schoolName} Spells
            </h2>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-start gap-1.5 sm:gap-2 min-h-0 overflow-hidden">
          {spells.map((spell) => (
            <div 
              key={spell.id} 
              className="flex-1 min-h-0"
              style={{ 
                maxHeight: spells.length === 1 ? '100%' : 'calc(50% - 4px)',
              }}
            >
              <div 
                className="h-full rounded-md overflow-hidden"
                style={{
                  background: 'linear-gradient(180deg, hsl(39 30% 95% / 0.6), hsl(35 25% 88% / 0.4))',
                  border: '1px solid hsl(35 30% 70% / 0.5)',
                }}
              >
                <SpellCard spell={spell} />
              </div>
            </div>
          ))}
        </div>

        <div 
          className={`absolute bottom-1.5 sm:bottom-2 text-xs sm:text-sm font-serif ${isLeftPage ? 'left-2 sm:left-3' : 'right-2 sm:right-3'}`}
          style={{ color: 'hsl(35 40% 30% / 0.7)' }}
        >
          {pageNumber}
        </div>
      </div>
    </div>
  );
}
