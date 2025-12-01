import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchSpells, Spell, getSchoolColor } from '@/lib/spellData';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BookmarkSearchProps {
  onSpellSelect: (spell: Spell) => void;
}

export default function BookmarkSearch({ onSpellSelect }: BookmarkSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Spell[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const found = searchSpells(query);
      setResults(found.slice(0, 10));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (spell: Spell) => {
    onSpellSelect(spell);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div 
      ref={containerRef}
      className="relative"
      data-testid="bookmark-search"
    >
      <div 
        className="relative flex items-center min-w-[200px]"
        style={{
          background: 'linear-gradient(180deg, hsl(15 70% 28%), hsl(15 60% 22%))',
          borderRadius: '0 0 12px 12px',
          padding: '10px 20px 16px 20px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
          clipPath: 'polygon(0 0, 100% 0, 92% 100%, 8% 100%)',
        }}
      >
        <Search className="w-4 h-4 text-amber-200/70 mr-2 flex-shrink-0" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search spells..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-transparent border-0 border-b border-amber-200/30 rounded-none text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-0 focus-visible:border-amber-200/60 h-7 text-sm w-[140px]"
          data-testid="search-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="ml-2 text-amber-200/70 hover:text-amber-100 transition-colors flex-shrink-0"
            data-testid="search-clear"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-md overflow-hidden z-50"
          style={{
            background: 'linear-gradient(180deg, hsl(39 35% 88%), hsl(35 25% 80%))',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            border: '2px solid hsl(35 40% 30%)',
          }}
        >
          <ScrollArea className="max-h-64">
            {results.map((spell) => (
              <button
                key={spell.id}
                onClick={() => handleSelect(spell)}
                className="w-full px-4 py-2 text-left hover:bg-amber-900/10 transition-colors flex items-center gap-3 border-b border-amber-900/10 last:border-0"
                data-testid={`search-result-${spell.id}`}
              >
                <img 
                  src={spell.imageUrl}
                  alt=""
                  className="w-8 h-8 object-contain flex-shrink-0"
                  style={{ imageRendering: 'pixelated' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div 
                    className="font-serif font-medium truncate"
                    style={{ color: getSchoolColor(spell.school) }}
                  >
                    {spell.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {spell.school} · Level {spell.level}
                  </div>
                </div>
              </button>
            ))}
          </ScrollArea>
        </div>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && (
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 rounded-md p-4 text-center text-muted-foreground text-sm z-50"
          style={{
            background: 'linear-gradient(180deg, hsl(39 35% 88%), hsl(35 25% 80%))',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            border: '2px solid hsl(35 40% 30%)',
          }}
        >
          No spells found for "{query}"
        </div>
      )}
    </div>
  );
}
