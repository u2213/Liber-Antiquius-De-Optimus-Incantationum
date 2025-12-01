declare module 'page-flip' {
  export interface PageFlipOptions {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions);
    
    loadFromHTML(pages: NodeListOf<Element> | Element[]): void;
    loadFromImages(images: string[]): void;
    
    turnToPage(pageNum: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(pageNum: number, corner?: 'top' | 'bottom'): void;
    
    getCurrentPageIndex(): number;
    getPageCount(): number;
    getOrientation(): 'portrait' | 'landscape';
    getBoundsRect(): DOMRect;
    getState(): 'read' | 'flipping' | 'user_fold' | 'fold_corner';
    
    on(eventName: 'flip', callback: (e: { data: number }) => void): void;
    on(eventName: 'changeState', callback: (e: { data: string }) => void): void;
    on(eventName: string, callback: (e: { data: unknown }) => void): void;
    off(eventName: string): void;
    
    destroy(): void;
    update(): void;
  }
}
