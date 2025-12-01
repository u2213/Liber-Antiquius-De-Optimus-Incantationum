import { Spell, getSchoolColor } from "@/lib/spellData";
import { Badge } from "@/components/ui/badge";

interface SpellCardProps {
  spell: Spell;
}

export default function SpellCard({ spell }: SpellCardProps) {
  const schoolColor = getSchoolColor(spell.school);
  
  return (
    <article 
      className="spell-card relative p-2"
      data-testid={`spell-card-${spell.id}`}
    >
      <div className="flex gap-3">
        <div 
          className="relative flex-shrink-0"
          style={{ width: 80, height: 80 }}
        >
          <div 
            className="absolute inset-0 rounded-md border-3"
            style={{ 
              borderColor: schoolColor,
              borderWidth: 3,
              background: `linear-gradient(135deg, hsl(39 35% 88% / 0.3), hsl(35 25% 75% / 0.5))`,
              boxShadow: `0 0 12px ${schoolColor}40, inset 0 0 8px ${schoolColor}20`
            }}
          />
          <img 
            src={spell.imageUrl}
            alt={spell.name}
            className="absolute inset-1 object-contain"
            style={{ 
              imageRendering: 'pixelated',
              width: 72,
              height: 72
            }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/64x64/2a1a0a/d4a574?text=${encodeURIComponent(spell.name.charAt(0))}`;
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h3 
            className="font-serif font-semibold tracking-wide text-base mb-1"
            style={{ color: schoolColor }}
          >
            {spell.name}
          </h3>

          <div className="grid grid-cols-3 gap-x-2 gap-y-0.5 text-[11px]">
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-muted-foreground font-medium text-[9px]">School</span>
              <span className="font-medium" style={{ color: schoolColor }}>{spell.school}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-muted-foreground font-medium text-[9px]">Level</span>
              <span>{spell.level}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-muted-foreground font-medium text-[9px]">Cast</span>
              <span>{spell.castType}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-muted-foreground font-medium text-[9px]">Cooldown</span>
              <span>{spell.cooldown}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-muted-foreground font-medium text-[9px]">Mana</span>
              <span className="text-blue-600">{spell.mana}</span>
            </div>
            <div className="flex flex-col">
              <span className="uppercase tracking-wider text-muted-foreground font-medium text-[9px]">Rarity</span>
              <span className="text-amber-600 truncate">{spell.rarity}</span>
            </div>
          </div>
        </div>
      </div>

      {spell.uniqueInfo.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {spell.uniqueInfo.map((info, idx) => (
            <Badge 
              key={idx} 
              variant="secondary"
              className="text-[10px] px-1.5 py-0 h-4"
            >
              {info}
            </Badge>
          ))}
        </div>
      )}

      <p className="text-[11px] mt-2 italic text-muted-foreground leading-snug line-clamp-3">
        {spell.description}
      </p>
    </article>
  );
}
