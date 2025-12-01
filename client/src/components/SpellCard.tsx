import { Spell, getSchoolColor } from "@/lib/spellData";

interface SpellCardProps {
  spell: Spell;
}

export default function SpellCard({ spell }: SpellCardProps) {
  const schoolColor = getSchoolColor(spell.school);
  
  return (
    <article 
      className="spell-card relative p-3 h-full flex flex-col"
      data-testid={`spell-card-${spell.id}`}
    >
      <div className="flex gap-3 flex-shrink-0">
        <div 
          className="relative flex-shrink-0"
          style={{ width: 64, height: 64 }}
        >
          <div 
            className="absolute inset-0 rounded-md"
            style={{ 
              borderColor: schoolColor,
              borderWidth: 2,
              background: `linear-gradient(135deg, hsl(39 35% 88% / 0.3), hsl(35 25% 75% / 0.5))`,
              boxShadow: `0 0 8px ${schoolColor}40, inset 0 0 6px ${schoolColor}20`
            }}
          />
          <img 
            src={spell.imageUrl}
            alt={spell.name}
            className="absolute inset-1 object-contain"
            style={{ 
              imageRendering: 'pixelated',
              width: 56,
              height: 56
            }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/56x56/2a1a0a/d4a574?text=${encodeURIComponent(spell.name.charAt(0))}`;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 
            className="font-serif font-semibold tracking-wide text-sm leading-tight mb-1"
            style={{ color: schoolColor }}
          >
            {spell.name}
          </h3>

          <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-[10px]">
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[8px]">Level</span>
              <span className="text-amber-900">{spell.level}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[8px]">Cast</span>
              <span className="text-amber-900">{spell.castType}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[8px]">Cooldown</span>
              <span className="text-amber-900">{spell.cooldown}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[8px]">Mana</span>
              <span className="text-blue-700">{spell.mana}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[8px]">Rarity</span>
              <span className="text-amber-700 truncate">{spell.rarity}</span>
            </div>
          </div>
        </div>
      </div>

      {spell.uniqueInfo.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2 flex-shrink-0">
          {spell.uniqueInfo.slice(0, 3).map((info, idx) => (
            <span 
              key={idx} 
              className="text-[9px] px-1.5 py-0.5 rounded bg-amber-900/10 text-amber-800 border border-amber-900/20"
            >
              {info}
            </span>
          ))}
        </div>
      )}

      <p className="text-[10px] mt-2 italic text-amber-800/70 leading-snug line-clamp-2 flex-1">
        {spell.description}
      </p>
    </article>
  );
}
