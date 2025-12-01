import { Spell, getSchoolColor } from "@/lib/spellData";
import { Badge } from "@/components/ui/badge";

interface SpellCardProps {
  spell: Spell;
  compact?: boolean;
}

export default function SpellCard({ spell, compact = false }: SpellCardProps) {
  const schoolColor = getSchoolColor(spell.school);
  
  return (
    <article 
      className={`spell-card relative ${compact ? 'p-3' : 'p-4'}`}
      data-testid={`spell-card-${spell.id}`}
    >
      <div className="flex flex-col items-center gap-3">
        <div 
          className="relative"
          style={{ width: compact ? 100 : 120, height: compact ? 100 : 120 }}
        >
          <div 
            className="absolute inset-0 rounded-md border-4"
            style={{ 
              borderColor: schoolColor,
              background: `linear-gradient(135deg, hsl(39 35% 88% / 0.3), hsl(35 25% 75% / 0.5))`,
              boxShadow: `0 0 20px ${schoolColor}40, inset 0 0 15px ${schoolColor}20`
            }}
          />
          <img 
            src={spell.imageUrl}
            alt={spell.name}
            className="absolute inset-2 object-contain"
            style={{ 
              imageRendering: 'pixelated',
              width: compact ? 84 : 104,
              height: compact ? 84 : 104
            }}
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://placehold.co/80x80/2a1a0a/d4a574?text=${encodeURIComponent(spell.name.charAt(0))}`;
            }}
          />
        </div>

        <h3 
          className={`font-serif font-semibold text-center tracking-wide ${compact ? 'text-lg' : 'text-xl'}`}
          style={{ color: schoolColor }}
        >
          {spell.name}
        </h3>

        <div className={`w-full grid grid-cols-2 gap-x-4 gap-y-1 ${compact ? 'text-xs' : 'text-sm'}`}>
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-muted-foreground font-medium text-[10px]">School</span>
            <span className="font-medium" style={{ color: schoolColor }}>{spell.school}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-muted-foreground font-medium text-[10px]">Level</span>
            <span>{spell.level}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-muted-foreground font-medium text-[10px]">Cooldown</span>
            <span>{spell.cooldown}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-muted-foreground font-medium text-[10px]">Mana</span>
            <span className="text-blue-400">{spell.mana}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-muted-foreground font-medium text-[10px]">Cast</span>
            <span>{spell.castType}</span>
          </div>
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-muted-foreground font-medium text-[10px]">Rarity</span>
            <span className="text-amber-500">{spell.rarity}</span>
          </div>
        </div>

        {spell.uniqueInfo.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-center">
            {spell.uniqueInfo.map((info, idx) => (
              <Badge 
                key={idx} 
                variant="secondary"
                className={`${compact ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'}`}
              >
                {info}
              </Badge>
            ))}
          </div>
        )}

        <p className={`text-center italic text-muted-foreground leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
          {spell.description}
        </p>
      </div>
    </article>
  );
}
