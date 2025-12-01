import { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { spellSchools, Spell } from '@/lib/spellData';
import BookCover from './BookCover';
import TableOfContents from './TableOfContents';
import SpellPage from './SpellPage';
import BookmarkSearch from './BookmarkSearch';
import PageNavigation from './PageNavigation';
import backgroundImage from '@assets/workspace_1764618872510.png';

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
const totalPages = pages.length;
const maxPageIndex = totalPages - 1;

export default function SpellBook() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipInstanceRef = useRef<PageFlip | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [key, setKey] = useState(0);

  const calculateDimensions = useCallback(() => {
    if (!containerRef.current) return { width: 0, height: 0 };
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const vh = rect.height;
    const vw = rect.width;
    
    const isMobile = vw < 640;
    const navHeight = isMobile ? 56 : 70;
    const bookmarkHeight = isMobile ? 50 : 60;
    const padding = isMobile ? 16 : 40;
    
    const availableHeight = vh - navHeight - bookmarkHeight - padding;
    const availableWidth = vw - padding;
    
    const bookAspectRatio = 1.4;
    
    let bookWidth = availableWidth;
    let bookHeight = bookWidth / bookAspectRatio;
    
    if (bookHeight > availableHeight) {
      bookHeight = availableHeight;
      bookWidth = bookHeight * bookAspectRatio;
    }
    
    const minWidth = isMobile ? 280 : 400;
    const maxWidth = isMobile ? 600 : 1200;
    bookWidth = Math.min(maxWidth, Math.max(minWidth, bookWidth));
    bookHeight = bookWidth / bookAspectRatio;
    
    return { 
      width: Math.floor(bookWidth), 
      height: Math.floor(bookHeight) 
    };
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        const newDims = calculateDimensions();
        if (newDims.width > 0 && newDims.height > 0) {
          setDimensions(newDims);
        }
      }, 150);
    };

    updateDimensions();
    
    const resizeObserver = new ResizeObserver(() => {
      updateDimensions();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [calculateDimensions]);

  useEffect(() => {
    if (!bookRef.current || dimensions.width === 0) return;
    
    const pageWidth = Math.floor(dimensions.width / 2);
    const pageHeight = Math.floor(dimensions.height);

    if (pageFlipInstanceRef.current) {
      try {
        pageFlipInstanceRef.current.destroy();
      } catch {
        // Ignore destroy errors
      }
      pageFlipInstanceRef.current = null;
      setIsInitialized(false);
    }

    const initTimeout = setTimeout(() => {
      if (!bookRef.current || pageFlipInstanceRef.current) return;

      try {
        const pageFlip = new PageFlip(bookRef.current, {
          width: pageWidth,
          height: pageHeight,
          size: 'fixed',
          minWidth: 100,
          maxWidth: 800,
          minHeight: 150,
          maxHeight: 1000,
          showCover: true,
          flippingTime: 600,
          usePortrait: false,
          startZIndex: 10,
          autoSize: false,
          maxShadowOpacity: 0.5,
          mobileScrollSupport: true,
          drawShadow: true,
          useMouseEvents: true,
          clickEventForward: false,
          swipeDistance: 30,
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
    };
  }, [dimensions, key]);

  const navigateToPage = useCallback((targetPage: number, instant: boolean = false) => {
    const pf = pageFlipInstanceRef.current;
    if (!pf) return;
    
    const clampedTarget = Math.max(0, Math.min(targetPage, maxPageIndex));
    
    try {
      if (instant) {
        pf.turnToPage(clampedTarget);
      } else {
        pf.flip(clampedTarget);
      }
    } catch {
      // Ignore flip errors
    }
  }, []);

  const handlePrevious = useCallback((_instant: boolean = false) => {
    const pf = pageFlipInstanceRef.current;
    if (!pf) return;
    const current = pf.getCurrentPageIndex();
    if (current > 0) {
      try {
        pf.turnToPage(current - 1);
      } catch {
        // Ignore flip errors
      }
    }
  }, []);

  const handleNext = useCallback((instant: boolean = false) => {
    const pf = pageFlipInstanceRef.current;
    if (!pf) return;
    const current = pf.getCurrentPageIndex();
    if (current < maxPageIndex) {
      try {
        if (instant) {
          pf.turnToPage(current + 1);
        } else {
          pf.flipNext();
        }
      } catch {
        // Ignore flip errors
      }
    }
  }, []);

  const handleFirst = useCallback(() => navigateToPage(0, true), [navigateToPage]);
  const handleLast = useCallback(() => navigateToPage(maxPageIndex, true), [navigateToPage]);

  const handleSchoolSelect = useCallback((_schoolName: string, pageIndex: number) => {
    navigateToPage(pageIndex);
  }, [navigateToPage]);

  const handleSpellSelect = useCallback((spell: Spell) => {
    const pageIndex = pages.findIndex(
      p => p.spells?.some(s => s.id === spell.id)
    );
    if (pageIndex >= 0) {
      navigateToPage(pageIndex);
    }
  }, [navigateToPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious(e.shiftKey);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext(e.shiftKey);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevious, handleNext]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && dimensions.width > 0) {
        setKey(k => k + 1);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dimensions]);

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
            isLeftPage={index % 2 === 1}
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
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2), rgba(0,0,0,0.5))',
        }}
      />
      
      <div className="relative flex justify-center pt-0 z-50">
        <BookmarkSearch onSpellSelect={handleSpellSelect} />
      </div>

      <div className="relative flex-1 flex items-center justify-center min-h-0 px-4">
        <div 
          ref={bookRef}
          key={key}
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

      <div className="relative flex justify-center pb-3 z-50">
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
