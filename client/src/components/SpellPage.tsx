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
      className="h-full w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(39 35% 90%), hsl(35 28% 85%))',
      }}
      data-testid={`spell-page-${pageNumber}`}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute left-0 top-0 bottom-0 w-8"
          style={{
            background: 'linear-gradient(90deg, rgba(0,0,0,0.1), transparent)',
          }}
        />
      </div>

      <div className="relative h-full flex flex-col p-5">
        {isSchoolHeader && schoolName && (
          <div className="text-center mb-4 pb-3 border-b-2" style={{ borderColor: schoolColor }}>
            <h2 
              className="font-serif text-2xl font-bold tracking-wide"
              style={{ color: schoolColor }}
            >
              {schoolName} Spells
            </h2>
            <div 
              className="w-16 h-0.5 mx-auto mt-2"
              style={{ 
                background: `linear-gradient(90deg, transparent, ${schoolColor}, transparent)` 
              }}
            />
          </div>
        )}

        <div className={`flex-1 flex flex-col ${spells.length === 1 ? 'justify-center' : 'justify-around'} overflow-hidden`}>
          {spells.map((spell) => (
            <div key={spell.id} className="flex-shrink-0">
              <SpellCard spell={spell} compact={spells.length > 1} />
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 right-4 text-xs text-amber-900/40 font-serif">
          {pageNumber}
        </div>
      </div>
    </div>
  );
}
