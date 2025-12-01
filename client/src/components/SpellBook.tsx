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
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.type === 'school-header' && page.schoolName && !(page.schoolName in map)) {
      map[page.schoolName] = i;
    }
  }
  return map;
}

const pages = generatePages();
const schoolPageMap = getSchoolPageMap(pages);
const lastNavigableIdx = pages.length - 2;

export default function SpellBook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);
  const isFlippingRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [isInitialized, setIsInitialized] = useState(false);

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
    
    const pageWidth = Math.floor(dimensions.width / 2);
    const pageHeight = Math.floor(dimensions.height);

    if (pageFlipInstanceRef.current) {
      try {
        pageFlipInstanceRef.current.update();
      } catch {
        // Ignore update errors
      }
      return;
    }

    const initTimeout = setTimeout(() => {
      if (!bookRef.current || pageFlipInstanceRef.current) return;

      try {
        const pageFlip = new PageFlip(bookRef.current, {
          width: pageWidth,
          height: pageHeight,
          size: 'stretch',
          minWidth: 250,
          maxWidth: 1000,
          minHeight: 350,
          maxHeight: 1200,
          showCover: true,
          flippingTime: 800,
          usePortrait: false,
          startZIndex: 10,
          autoSize: true,
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
          const pageIdx = Math.min(e.data, lastNavigableIdx);
          setCurrentPage(pageIdx);
          isFlippingRef.current = false;
        });

        pageFlip.on('changeState', (e: { data: string }) => {
          isFlippingRef.current = e.data === 'flipping';
        });

        pageFlipInstanceRef.current = pageFlip;
        setIsInitialized(true);
      } catch {
        // Ignore initialization errors
      }
    }, 150);

    return () => {
      clearTimeout(initTimeout);
    };
  }, [dimensions]);

  const safeFlip = useCallback((action: 'prev' | 'next' | number) => {
    const pf = pageFlipInstanceRef.current;
    if (!pf || isFlippingRef.current) return;
    
    try {
      const currentIdx = pf.getCurrentPageIndex();
      
      if (action === 'prev') {
        if (currentIdx > 0) {
          isFlippingRef.current = true;
          pf.flipPrev();
        }
      } else if (action === 'next') {
        if (currentIdx < lastNavigableIdx) {
          isFlippingRef.current = true;
          pf.flipNext();
        }
      } else if (typeof action === 'number') {
        const targetPage = Math.max(0, Math.min(action, lastNavigableIdx));
        if (targetPage !== currentIdx) {
          isFlippingRef.current = true;
          pf.turnToPage(targetPage);
        }
      }
    } catch {
      isFlippingRef.current = false;
    }
  }, []);

  const handlePrevious = useCallback(() => safeFlip('prev'), [safeFlip]);
  const handleNext = useCallback(() => safeFlip('next'), [safeFlip]);
  const handleFirst = useCallback(() => safeFlip(0), [safeFlip]);
  const handleLast = useCallback(() => safeFlip(lastNavigableIdx), [safeFlip]);

  const handleSchoolSelect = useCallback((_schoolName: string, pageIndex: number) => {
    safeFlip(pageIndex);
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
          totalPages={lastNavigableIdx + 1}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFirst={handleFirst}
          onLast={handleLast}
        />
      </div>
    </div>
  );
}
