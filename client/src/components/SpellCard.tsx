import { Spell, getSchoolColor } from "@/lib/spellData";

interface SpellCardProps {
  spell: Spell;
}

export default function SpellCard({ spell }: SpellCardProps) {
  const schoolColor = getSchoolColor(spell.school);
  
  return (
    <article 
      className="spell-card relative p-4 h-full flex flex-col"
      data-testid={`spell-card-${spell.id}`}
    >
      <div className="flex gap-4 flex-shrink-0">
        <div 
          className="relative flex-shrink-0"
          style={{ width: 72, height: 72 }}
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
              width: 64,
              height: 64
            }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/64x64/2a1a0a/d4a574?text=${encodeURIComponent(spell.name.charAt(0))}`;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 
            className="font-serif font-bold tracking-wide text-lg leading-tight mb-1.5"
            style={{ color: schoolColor }}
          >
            {spell.name}
          </h3>

          <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-sm">
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-xs">Level</span>
              <span className="text-amber-900 font-medium">{spell.level}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-xs">Cast</span>
              <span className="text-amber-900 font-medium">{spell.castType}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-xs">Cooldown</span>
              <span className="text-amber-900 font-medium">{spell.cooldown}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-xs">Mana</span>
              <span className="text-blue-700 font-medium">{spell.mana}</span>
            </div>
            <div className="flex flex-col col-span-2">
              <span className="uppercase tracking-wider text-amber-800/60 font-medium text-xs">Rarity</span>
              <span className="text-amber-700 font-medium truncate">{spell.rarity}</span>
            </div>
          </div>
        </div>
      </div>

      {spell.uniqueInfo.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 flex-shrink-0">
          {spell.uniqueInfo.slice(0, 3).map((info, idx) => (
            <span 
              key={idx} 
              className="text-xs px-2 py-0.5 rounded bg-amber-900/10 text-amber-800 border border-amber-900/20 font-medium"
            >
              {info}
            </span>
          ))}
        </div>
      )}

      <p className="text-sm mt-3 italic text-amber-800/80 leading-relaxed line-clamp-2 flex-1">
        {spell.description}
      </p>
    </article>
  );
}
