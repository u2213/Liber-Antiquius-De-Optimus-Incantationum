import { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import { spellSchools, getAllSpells, Spell } from '@/lib/spellData';
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
    const spellsPerPage = 2;
    const schoolSpells = [...school.spells];
    
    for (let i = 0; i < schoolSpells.length; i += spellsPerPage) {
      const pageSpells = schoolSpells.slice(i, i + spellsPerPage);
      pages.push({
        type: i === 0 ? 'school-header' : 'spells',
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

export default function SpellBook() {
  const bookRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const pages = generatePages();
  const schoolPageMap = getSchoolPageMap(pages);
  const totalPages = pages.length;

  useEffect(() => {
    if (!bookRef.current || pageFlipRef.current) return;

    const pageFlip = new PageFlip(bookRef.current, {
      width: 380,
      height: 520,
      size: 'fixed',
      minWidth: 300,
      maxWidth: 500,
      minHeight: 400,
      maxHeight: 700,
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

    pageFlipRef.current = pageFlip;
    setIsReady(true);

    return () => {
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
        pageFlipRef.current = null;
      }
    };
  }, []);

  const flipToPage = useCallback((pageIndex: number) => {
    if (pageFlipRef.current) {
      pageFlipRef.current.turnToPage(pageIndex);
    }
  }, []);

  const handlePrevious = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipPrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (pageFlipRef.current) {
      pageFlipRef.current.flipNext();
    }
  }, []);

  const handleFirst = useCallback(() => {
    flipToPage(0);
  }, [flipToPage]);

  const handleLast = useCallback(() => {
    flipToPage(totalPages - 1);
  }, [flipToPage, totalPages]);

  const handleSchoolSelect = useCallback((_schoolName: string, pageIndex: number) => {
    const targetPageIndex = pages.findIndex(p => p.pageNumber === pageIndex);
    if (targetPageIndex >= 0) {
      flipToPage(targetPageIndex);
    }
  }, [pages, flipToPage]);

  const handleSpellSelect = useCallback((spell: Spell) => {
    const pageIndex = pages.findIndex(
      p => p.spells?.some(s => s.id === spell.id)
    );
    if (pageIndex >= 0) {
      flipToPage(pageIndex);
    }
  }, [pages, flipToPage]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
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
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        background: 'radial-gradient(ellipse at center, hsl(30 10% 15%), hsl(25 8% 8%))',
      }}
    >
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50">
        <BookmarkSearch onSpellSelect={handleSpellSelect} />
      </div>

      <div className="flex-1 flex items-center justify-center pt-16 pb-20">
        <div 
          ref={bookRef}
          className="relative"
          style={{
            width: 760,
            height: 520,
          }}
          data-testid="spell-book"
        >
          {pages.map((page, index) => renderPage(page, index))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <PageNavigation
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onFirst={handleFirst}
          onLast={handleLast}
        />
      </div>

      <div className="absolute bottom-4 right-4 text-amber-200/30 text-xs">
        Use arrow keys or click pages to navigate
      </div>
    </div>
  );
}
