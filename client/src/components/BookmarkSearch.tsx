import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchSpells, Spell, getSchoolColor } from '@/lib/spellData';

interface BookmarkSearchProps {
  onSpellSelect: (spell: Spell) => void;
}

export default function BookmarkSearch({ onSpellSelect }: BookmarkSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Spell[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
        if (!query) setIsExpanded(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleSelect = (spell: Spell) => {
    onSpellSelect(spell);
    setQuery('');
    setIsOpen(false);
    setIsExpanded(false);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const handleRibbonClick = () => {
    setIsExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div 
      ref={containerRef}
      className="relative flex flex-col items-center"
      data-testid="bookmark-search"
    >
      <div 
        className="relative cursor-pointer group"
        onClick={!isExpanded ? handleRibbonClick : undefined}
        data-testid="toggle-bookmark-ribbon"
        style={{
          width: isExpanded ? '280px' : '44px',
          transition: 'width 0.3s ease',
        }}
      >
        <div
          className="relative overflow-visible"
          style={{
            background: 'linear-gradient(180deg, hsl(0 60% 38%), hsl(0 50% 30%))',
            boxShadow: '2px 6px 16px rgba(0,0,0,0.5)',
            clipPath: isExpanded 
              ? 'polygon(0 0, 100% 0, 100% calc(100% - 12px), 50% 100%, 0 calc(100% - 12px))'
              : 'polygon(0 0, 100% 0, 100% calc(100% - 16px), 50% 100%, 0 calc(100% - 16px))',
            padding: isExpanded ? '12px 16px 24px 16px' : '14px 10px 28px 10px',
            minHeight: isExpanded ? 'auto' : '90px',
            transition: 'all 0.3s ease',
          }}
        >
          <div 
            className="absolute left-1 right-1 top-2 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(45 70% 60% / 0.5), transparent)' }}
          />
          
          {!isExpanded ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Search className="w-5 h-5 text-amber-200/90 group-hover:text-amber-100 transition-colors" />
              <span 
                className="text-amber-200/70 text-[10px] font-serif tracking-widest mt-2 group-hover:text-amber-100 transition-colors"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                SEARCH
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-200/80 flex-shrink-0" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Search spells..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-transparent border-0 border-b border-amber-200/30 rounded-none text-amber-100 placeholder:text-amber-200/50 focus-visible:ring-0 focus-visible:border-amber-200/60 h-7 text-sm flex-1"
                data-testid="search-input"
              />
              {query ? (
                <button
                  onClick={handleClear}
                  className="text-amber-200/70 hover:text-amber-100 transition-colors flex-shrink-0"
                  data-testid="search-clear"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => { setIsExpanded(false); setQuery(''); }}
                  className="text-amber-200/70 hover:text-amber-100 transition-colors flex-shrink-0"
                  data-testid="button-ribbon-close"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          
          <div 
            className="absolute left-1 right-1 bottom-6 h-[1px]"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(45 70% 60% / 0.5), transparent)' }}
          />
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div 
          className="absolute top-full mt-2 w-72 rounded-md overflow-hidden z-50"
          style={{
            background: 'linear-gradient(180deg, hsl(39 35% 88%), hsl(35 25% 80%))',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            border: '2px solid hsl(35 40% 30%)',
          }}
        >
          <div className="max-h-64 overflow-y-auto">
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
                  className="w-8 h-8 flex-shrink-0"
                  style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
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
          </div>
        </div>
      )}

      {isOpen && results.length === 0 && query.length >= 2 && (
        <div 
          className="absolute top-full mt-2 w-72 rounded-md p-4 text-center text-muted-foreground text-sm z-50"
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
