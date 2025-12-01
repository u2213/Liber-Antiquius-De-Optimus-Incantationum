import { Spell, getSchoolColor } from "@/lib/spellData";

interface SpellCardProps {
  spell: Spell;
}

export default function SpellCard({ spell }: SpellCardProps) {
  const schoolColor = getSchoolColor(spell.school);
  
  return (
    <article 
      className="spell-card relative p-2 sm:p-3 h-full flex flex-col"
      data-testid={`spell-card-${spell.id}`}
    >
      <div className="flex gap-2 sm:gap-3 flex-shrink-0">
        <div 
          className="relative flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16"
        >
          <div 
            className="absolute inset-0 rounded-md"
            style={{ 
              borderColor: schoolColor,
              borderWidth: 2,
              background: `linear-gradient(135deg, hsl(39 35% 88% / 0.3), hsl(35 25% 75% / 0.5))`,
              boxShadow: `0 0 6px ${schoolColor}40, inset 0 0 4px ${schoolColor}20`
            }}
          />
          <img 
            src={spell.imageUrl}
            alt={spell.name}
            className="absolute inset-0.5 sm:inset-1 object-contain"
            style={{ imageRendering: 'pixelated' }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/64x64/2a1a0a/d4a574?text=${encodeURIComponent(spell.name.charAt(0))}`;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 
            className="font-serif font-bold tracking-wide text-sm sm:text-base leading-tight mb-1"
            style={{ color: schoolColor }}
          >
            {spell.name}
          </h3>

          <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-xs sm:text-sm">
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[10px] sm:text-xs">Level</span>
              <span className="text-amber-900 font-medium truncate">{spell.level}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[10px] sm:text-xs">Cast</span>
              <span className="text-amber-900 font-medium truncate">{spell.castType}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[10px] sm:text-xs">Cooldown</span>
              <span className="text-amber-900 font-medium truncate">{spell.cooldown}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[10px] sm:text-xs">Mana</span>
              <span className="text-blue-700 font-medium truncate">{spell.mana}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-[10px] sm:text-xs">Rarity</span>
              <span className="text-amber-700 font-medium truncate">{spell.rarity}</span>
            </div>
          </div>
        </div>
      </div>

      {spell.uniqueInfo.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5 sm:mt-2 flex-shrink-0">
          {spell.uniqueInfo.slice(0, 3).map((info, idx) => (
            <span 
              key={idx} 
              className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-amber-900/10 text-amber-800 border border-amber-900/20 font-medium"
            >
              {info}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs sm:text-sm mt-1.5 sm:mt-2 italic text-amber-800/80 leading-snug line-clamp-2 flex-1">
        {spell.description}
      </p>
    </article>
  );
}
