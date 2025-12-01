import SpellCard from '../SpellCard';
import { spellSchools } from '@/lib/spellData';

export default function SpellCardExample() {
  const sampleSpell = spellSchools[0].spells[0];
  
  return (
    <div className="bg-[hsl(39_35%_88%)] p-6 rounded-lg max-w-xs">
      <SpellCard spell={sampleSpell} />
    </div>
  );
}
