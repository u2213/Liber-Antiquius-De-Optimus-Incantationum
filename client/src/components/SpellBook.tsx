import { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { spellSchools, Spell } from '@/lib/spellData';
import BookCover from './BookCover';
import TableOfContents from './TableOfContents';
import SpellPage from './SpellPage';
import BookmarkSearch from './BookmarkSearch';
import PageNavigation from './PageNavigation';

interface PageData {
  type: 'cover' | 'toc' | 'school-header' | 'spells' | 'back';
  spells?: Spell[];
  schoolName?: string;
  pageNumber: number;
}

const SPELLS_PER_PAGE = 2;

function generatePages(): PageData[] {
  const pages: PageData[] = [];
  let pageNumber = 1;

  pages.push({ type: 'cover', pageNumber: 0 });
  pages.push({ type: 'toc', pageNumber: pageNumber++ });

  for (const school of spellSchools) {
    const schoolSpells = [...school.spells];
    
    for (let i = 0; i < schoolSpells.length; i += SPELLS_PER_PAGE) {
      const pageSpells = schoolSpells.slice(i, i + SPELLS_PER_PAGE);
      const isFirst = i === 0;
      
      pages.push({
        type: isFirst ? 'school-header' : 'spells',
        spells: pageSpells,
        schoolName: school.name,
        pageNumber: pageNumber++,
      });
    }
  }

  pages.push({ type: 'back', pageNumber: pageNumber });

  return pages;
}

function getSchoolPageMap(pages: PageData[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const page of pages) {
    if (page.type === 'school-header' && page.schoolName && !map[page.schoolName]) {
      map[page.schoolName] = page.pageNumber;
    }
  }
  return map;
}

const pages = generatePages();
const schoolPageMap = getSchoolPageMap(pages);

export default function SpellBook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isInitialized, setIsInitialized] = useState(false);

  const totalPages = pages.length;

  useEffect(() => {
    const updateDimensions = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      
      const navHeight = 70;
      const bookmarkHeight = 60;
      const padding = 40;
      
      const availableHeight = vh - navHeight - bookmarkHeight - padding;
      const availableWidth = vw - padding;
      
      const bookAspectRatio = 1.4;
      
      let bookWidth = availableWidth;
      let bookHeight = bookWidth / bookAspectRatio;
      
      if (bookHeight > availableHeight) {
        bookHeight = availableHeight;
        bookWidth = bookHeight * bookAspectRatio;
      }
      
      bookWidth = Math.min(1600, Math.max(500, bookWidth));
      bookHeight = bookWidth / bookAspectRatio;
      
      setDimensions({ 
        width: Math.floor(bookWidth), 
        height: Math.floor(bookHeight) 
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!bookRef.current) return;
    
    if (pageFlipInstanceRef.current) {
      try {
        pageFlipInstanceRef.current.destroy();
      } catch {
        // Ignore cleanup errors
      }
      pageFlipInstanceRef.current = null;
    }

    const initTimeout = setTimeout(() => {
      if (!bookRef.current) return;

      const pageWidth = Math.floor(dimensions.width / 2);
      const pageHeight = Math.floor(dimensions.height);

      try {
        const pageFlip = new PageFlip(bookRef.current, {
          width: pageWidth,
          height: pageHeight,
          size: 'fixed',
          minWidth: 250,
          maxWidth: 800,
          minHeight: 350,
          maxHeight: 1000,
          showCover: true,
          flippingTime: 800,
          usePortrait: false,
          startZIndex: 0,
          autoSize: false,
          maxShadowOpacity: 0.5,
          mobileScrollSupport: true,
          drawShadow: true,
          useMouseEvents: true,
        });

        const pageElements = bookRef.current.querySelectorAll('.page');
        if (pageElements.length > 0) {
          pageFlip.loadFromHTML(pageElements);
        }

        pageFlip.on('flip', (e: { data: number }) => {
          setCurrentPage(e.data);
        });

        pageFlipInstanceRef.current = pageFlip;
        setIsInitialized(true);
      } catch {
        // Ignore initialization errors
      }
    }, 100);

    return () => {
      clearTimeout(initTimeout);
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch {
          // Ignore cleanup errors
        }
        pageFlipInstanceRef.current = null;
      }
      setIsInitialized(false);
    };
  }, [dimensions]);

  const safeFlip = useCallback((action: 'prev' | 'next' | number) => {
    const pf = pageFlipInstanceRef.current;
    if (!pf) return;
    
    try {
      const state = pf.getState();
      if (state === 'flipping') return;
      
      if (action === 'prev') {
        pf.flipPrev();
      } else if (action === 'next') {
        pf.flipNext();
      } else if (typeof action === 'number') {
        pf.turnToPage(action);
      }
    } catch {
      // Ignore errors if library not ready
    }
  }, []);

  const handlePrevious = useCallback(() => safeFlip('prev'), [safeFlip]);
  const handleNext = useCallback(() => safeFlip('next'), [safeFlip]);
  const handleFirst = useCallback(() => safeFlip(0), [safeFlip]);
  const handleLast = useCallback(() => safeFlip(totalPages - 1), [safeFlip, totalPages]);

  const handleSchoolSelect = useCallback((_schoolName: string, pageIndex: number) => {
    const targetPageIndex = pages.findIndex(p => p.pageNumber === pageIndex);
    if (targetPageIndex >= 0) {
      safeFlip(targetPageIndex);
    }
  }, [safeFlip]);

  const handleSpellSelect = useCallback((spell: Spell) => {
    const pageIndex = pages.findIndex(
      p => p.spells?.some(s => s.id === spell.id)
    );
    if (pageIndex >= 0) {
      safeFlip(pageIndex);
    }
  }, [safeFlip]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  const renderPage = (page: PageData, index: number) => {
    const isHard = page.type === 'cover' || page.type === 'back';
    
    return (
      <div 
        key={index}
        className="page"
        data-density={isHard ? 'hard' : 'soft'}
      >
        {page.type === 'cover' && <BookCover type="front" />}
        {page.type === 'back' && <BookCover type="back" />}
        {page.type === 'toc' && (
          <div 
            className="h-full"
            style={{
              background: 'linear-gradient(135deg, hsl(39 35% 90%), hsl(35 28% 85%))',
            }}
          >
            <TableOfContents 
              onSchoolSelect={handleSchoolSelect}
              schoolPageMap={schoolPageMap}
            />
          </div>
        )}
        {(page.type === 'school-header' || page.type === 'spells') && page.spells && (
          <SpellPage
            spells={page.spells}
            schoolName={page.schoolName}
            pageNumber={page.pageNumber}
            isSchoolHeader={page.type === 'school-header'}
          />
        )}
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, hsl(30 10% 15%), hsl(25 8% 8%))',
      }}
    >
      <div className="flex justify-center pt-2 z-50">
        <BookmarkSearch onSpellSelect={handleSpellSelect} />
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0 px-4">
        <div 
          ref={bookRef}
          className="relative"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            opacity: isInitialized ? 1 : 0.5,
            transition: 'opacity 0.3s ease',
          }}
          data-testid="spell-book"
        >
          {pages.map((page, index) => renderPage(page, index))}
        </div>
      </div>

      <div className="flex justify-center pb-3 z-50">
        <PageNavigation
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFirst={handleFirst}
          onLast={handleLast}
        />
      </div>
    </div>
  );
}
