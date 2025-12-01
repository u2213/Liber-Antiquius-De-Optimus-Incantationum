interface BookCoverProps {
  type: 'front' | 'back';
}

export default function BookCover({ type }: BookCoverProps) {
  if (type === 'back') {
    return (
      <div 
        className="h-full w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, hsl(20 50% 18%), hsl(15 40% 12%))',
        }}
      >
        <div className="text-center text-amber-200/30">
          <div className="font-serif text-sm tracking-widest uppercase">
            Iron's Spells n Spellbooks
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full w-full relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, hsl(20 50% 18%), hsl(15 40% 12%))',
      }}
      data-testid="book-cover"
    >
      <div 
        className="absolute inset-0"
        style={{
          background: `
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.03) 2px,
              rgba(0,0,0,0.03) 4px
            )
          `,
        }}
      />

      <div className="absolute inset-4 border-4 border-amber-600/30 rounded-sm" />
      <div className="absolute inset-6 border border-amber-600/20 rounded-sm" />

      <div 
        className="absolute top-4 left-4 w-16 h-16"
        style={{
          borderLeft: '2px solid hsl(40 60% 50% / 0.4)',
          borderTop: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />
      <div 
        className="absolute top-4 right-4 w-16 h-16"
        style={{
          borderRight: '2px solid hsl(40 60% 50% / 0.4)',
          borderTop: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />
      <div 
        className="absolute bottom-4 left-4 w-16 h-16"
        style={{
          borderLeft: '2px solid hsl(40 60% 50% / 0.4)',
          borderBottom: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />
      <div 
        className="absolute bottom-4 right-4 w-16 h-16"
        style={{
          borderRight: '2px solid hsl(40 60% 50% / 0.4)',
          borderBottom: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
        <div 
          className="w-24 h-24 mb-6 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, hsl(270 60% 40% / 0.3), transparent)',
            boxShadow: '0 0 40px hsl(270 60% 40% / 0.3)',
          }}
        >
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-amber-400">
            <path 
              fill="currentColor" 
              d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 18L13.09 15.74L12 22L10.91 15.74L5 18L9.26 13.09L3 12L9.26 10.91L5 6L10.91 8.26L12 2Z"
            />
          </svg>
        </div>

        <h1 
          className="font-serif text-4xl font-bold tracking-wider mb-2"
          style={{
            color: 'hsl(40 70% 65%)',
            textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px hsl(40 70% 50% / 0.3)',
          }}
        >
          Ancient Spell
        </h1>
        <h2 
          className="font-serif text-3xl font-bold tracking-wider mb-6"
          style={{
            color: 'hsl(40 70% 65%)',
            textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px hsl(40 70% 50% / 0.3)',
          }}
        >
          Compendium
        </h2>

        <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-6" />

        <p 
          className="text-amber-200/60 text-sm italic font-serif"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          A collection of arcane knowledge
        </p>
        <p 
          className="text-amber-200/40 text-xs mt-2"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          from Iron's Spells n Spellbooks
        </p>

        <div className="absolute bottom-12 text-amber-200/30 text-xs tracking-widest uppercase">
          Click to Open
        </div>
      </div>
    </div>
  );
}
