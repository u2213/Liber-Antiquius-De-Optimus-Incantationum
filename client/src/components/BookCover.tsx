import { useMemo } from 'react';

interface BookCoverProps {
  type: 'front' | 'back';
}

export default function BookCover({ type }: BookCoverProps) {
  const glowCycle = useMemo(() => {
    const cycles = ['', 'cycle-2', 'cycle-3'];
    return cycles[Math.floor(Math.random() * cycles.length)];
  }, []);
  if (type === 'back') {
    return (
      <div 
        className="h-full w-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, hsl(20 50% 18%), hsl(15 40% 12%))',
        }}
      >
        <div className="text-center text-amber-200/30">
          <div className="font-serif text-xs sm:text-sm tracking-widest uppercase">
            Soli maximi has facultates exercere possunt.
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

      <div className="absolute inset-2 sm:inset-4 border-2 sm:border-4 border-amber-600/30 rounded-sm" />
      <div className="absolute inset-4 sm:inset-6 border border-amber-600/20 rounded-sm" />

      <div 
        className="absolute top-2 sm:top-4 left-2 sm:left-4 w-8 h-8 sm:w-16 sm:h-16"
        style={{
          borderLeft: '2px solid hsl(40 60% 50% / 0.4)',
          borderTop: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />
      <div 
        className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-16 sm:h-16"
        style={{
          borderRight: '2px solid hsl(40 60% 50% / 0.4)',
          borderTop: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />
      <div 
        className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-8 h-8 sm:w-16 sm:h-16"
        style={{
          borderLeft: '2px solid hsl(40 60% 50% / 0.4)',
          borderBottom: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />
      <div 
        className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 w-8 h-8 sm:w-16 sm:h-16"
        style={{
          borderRight: '2px solid hsl(40 60% 50% / 0.4)',
          borderBottom: '2px solid hsl(40 60% 50% / 0.4)',
        }}
      />

      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-8 text-center">
        <div 
          className={`w-40 h-40 sm:w-64 sm:h-64 mb-8 sm:mb-12 flex items-center justify-center glow-cycle ${glowCycle}`}
          style={{
            border: '3px solid hsl(40 80% 60%)',
            boxShadow: 'inset 0 0 20px hsl(40 80% 50% / 0.3)',
          }}
        >
          <img src="/arcanum-icon.png" alt="Arcanum icon" className="w-32 h-32 sm:w-56 sm:h-56 object-contain" />
        </div>

        <h1 
          className="font-serif text-2xl sm:text-4xl font-bold tracking-wider mb-1 sm:mb-2"
          style={{
            color: 'hsl(40 70% 65%)',
            textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px hsl(40 70% 50% / 0.3)',
          }}
        >
          Liberus Anticqus de
        </h1>
        <h2 
          className="font-serif text-xl sm:text-3xl font-bold tracking-wider mb-4 sm:mb-6"
          style={{
            color: 'hsl(40 70% 65%)',
            textShadow: '0 2px 10px rgba(0,0,0,0.5), 0 0 30px hsl(40 70% 50% / 0.3)',
          }}
        >
          Optimus Incantationibus
        </h2>

        <div className="w-32 sm:w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mb-4 sm:mb-6" />

        <p 
          className="text-amber-200/60 text-xs sm:text-sm italic font-serif"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          Scientia Antiqua
        </p>
        <p 
          className="text-amber-200/40 text-[10px] sm:text-xs mt-1 sm:mt-2"
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
        >
          ex Alio Mundo
        </p>

        <div className="absolute bottom-6 sm:bottom-12 text-amber-200/30 text-[10px] sm:text-xs tracking-widest uppercase">
          Tap to Open
        </div>
      </div>
    </div>
  );
}
