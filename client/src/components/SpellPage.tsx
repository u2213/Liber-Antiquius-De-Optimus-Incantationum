import { Spell, getSchoolColor } from '@/lib/spellData';
import SpellCard from './SpellCard';

interface SpellPageProps {
  spells: Spell[];
  schoolName?: string;
  pageNumber: number;
  isSchoolHeader?: boolean;
}

export default function SpellPage({ spells, schoolName, pageNumber, isSchoolHeader }: SpellPageProps) {
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
          className="absolute left-0 top-0 bottom-0 w-6"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.08), transparent)',
          }}
        />
      </div>

      <div className="relative flex-1 flex flex-col p-3 min-h-0">
        {isSchoolHeader && schoolName && (
          <div className="text-center mb-2 pb-2 border-b-2 flex-shrink-0" style={{ borderColor: schoolColor }}>
            <h2 
              className="font-serif text-lg font-bold tracking-wide"
              style={{ color: schoolColor }}
            >
              {schoolName} Spells
            </h2>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-start gap-2 min-h-0 overflow-hidden">
          {spells.map((spell, index) => (
            <div 
              key={spell.id} 
              className="flex-shrink-0"
              style={{ 
                flex: spells.length === 1 ? '0 0 auto' : '0 0 calc(50% - 4px)',
                maxHeight: spells.length === 1 ? 'none' : 'calc(50% - 4px)',
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
              {index < spells.length - 1 && spells.length > 1 && (
                <div 
                  className="w-3/4 mx-auto h-px my-1"
                  style={{ background: 'linear-gradient(90deg, transparent, hsl(35 40% 60% / 0.4), transparent)' }}
                />
              )}
            </div>
          ))}
        </div>

        <div 
          className="absolute bottom-2 right-3 text-xs font-serif"
          style={{ color: 'hsl(35 40% 40% / 0.5)' }}
        >
          {pageNumber}
        </div>
      </div>
    </div>
  );
}
