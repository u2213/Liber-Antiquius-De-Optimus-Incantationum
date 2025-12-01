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

function generatePages(): PageData[] {
  const pages: PageData[] = [];
  let pageNumber = 1;

  pages.push({ type: 'cover', pageNumber: 0 });
  pages.push({ type: 'toc', pageNumber: pageNumber++ });

  for (const school of spellSchools) {
    for (let i = 0; i < school.spells.length; i++) {
      const isFirst = i === 0;
      pages.push({
        type: isFirst ? 'school-header' : 'spells',
        spells: [school.spells[i]],
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
  const initializingRef = useRef(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  const totalPages = pages.length;

  useEffect(() => {
    const updateDimensions = () => {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;
      
      const bookAspectRatio = 1.5;
      const navHeight = 100;
      const bookmarkHeight = 70;
      const availableHeight = containerHeight - navHeight - bookmarkHeight;
      const availableWidth = containerWidth - 60;
      
      let bookWidth = availableWidth;
      let bookHeight = bookWidth / bookAspectRatio;
      
      if (bookHeight > availableHeight) {
        bookHeight = availableHeight;
        bookWidth = bookHeight * bookAspectRatio;
      }
      
      bookWidth = Math.max(600, Math.min(1400, bookWidth));
      bookHeight = bookWidth / bookAspectRatio;
      
      setDimensions({ width: bookWidth, height: bookHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!bookRef.current || initializingRef.current) return;
    
    initializingRef.current = true;

    const pageWidth = Math.floor(dimensions.width / 2);
    const pageHeight = Math.floor(dimensions.height);

    const pageFlip = new PageFlip(bookRef.current, {
      width: pageWidth,
      height: pageHeight,
      size: 'fixed',
      minWidth: 300,
      maxWidth: 700,
      minHeight: 400,
      maxHeight: 900,
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
    initializingRef.current = false;

    return () => {
      if (pageFlipInstanceRef.current) {
        try {
          pageFlipInstanceRef.current.destroy();
        } catch {
          // Ignore errors during cleanup
        }
        pageFlipInstanceRef.current = null;
      }
      initializingRef.current = false;
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
      className="h-screen w-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, hsl(30 10% 15%), hsl(25 8% 8%))',
      }}
    >
      <div className="flex flex-col items-center">
        <div className="relative z-50 mb-[-24px]">
          <BookmarkSearch onSpellSelect={handleSpellSelect} />
        </div>

        <div 
          ref={bookRef}
          className="relative"
          style={{
            width: dimensions.width,
            height: dimensions.height,
          }}
          data-testid="spell-book"
        >
          {pages.map((page, index) => renderPage(page, index))}
        </div>

        <div className="mt-4">
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
    </div>
  );
}
