import SpellPage from '../SpellPage';
import { spellSchools } from '@/lib/spellData';

export default function SpellPageExample() {
  const fireSpells = spellSchools.find(s => s.name === 'Fire')?.spells.slice(0, 2) || [];
  
  return (
    <div 
      className="w-[380px] h-[520px] rounded-lg overflow-hidden"
      style={{ boxShadow: '4px 4px 20px rgba(0,0,0,0.3)' }}
    >
      <SpellPage 
        spells={fireSpells}
        schoolName="Fire"
        pageNumber={28}
        isSchoolHeader={true}
      />
    </div>
  );
}
