# Design Guidelines: D&D Spell Book Application

## Design Approach
**Reference-Based Approach**: Drawing inspiration from medieval fantasy spell books and grimoires found in games like Diablo, Elder Scrolls, and tabletop RPG interfaces. The aesthetic should evoke ancient magical tomes with parchment textures, ornate frames, and mystical elements.

## Core Design Principles
1. **Authenticity**: Create an immersive medieval spell book experience
2. **Readability**: Despite decorative elements, information must be clear and scannable
3. **Interaction**: Page-turning should feel satisfying and realistic
4. **Focus**: Only spells - no clutter from other item types

## Typography

### Font Families
- **Primary (Headings)**: Cinzel or IM Fell English (via Google Fonts) - medieval serif for spell names and section headers
- **Secondary (Body)**: Crimson Text or Lora - readable serif for spell descriptions and stats
- **Accent (Labels)**: All-caps tracking for attribute labels (COOLDOWN, MANA, etc.)

### Hierarchy
- Spell Class Headers: text-4xl, font-bold, tracking-wide, text-center
- Spell Names: text-2xl, font-semibold
- Stat Labels: text-xs, uppercase, tracking-widest, font-medium
- Stat Values: text-sm, font-normal
- Descriptions: text-base, leading-relaxed

## Layout System

### Spacing Primitives
Use Tailwind units: **2, 4, 6, 8, 12, 16** (e.g., p-4, m-6, gap-8)

### Book Structure
- **Book Wrapper**: Fixed viewport container (landscape-oriented 16:9 ratio preferred)
- **Page Dimensions**: 400px width × 600px height per page (800px total spread width)
- **Page Padding**: p-8 inner content area for text, p-4 for spell containers
- **Spread Layout**: Two-page spread visible simultaneously (left and right pages)

### Page Content Layout
**Single Spell per Page**:
- Spell image frame: centered top, 130px width fixed
- Stat grid: 2-column table below image
- Description: full-width text block at bottom
- Spacing: gap-6 between sections

**Two Spells per Page** (if space allows):
- Stack vertically with gap-8
- Reduce image size to 100px
- Compact stat tables

## Component Library

### 1. Book Cover (Entry Page)
- Full-page ornate border frame
- Centered title: "Ancient Spell Compendium" (text-5xl)
- Decorative corner elements (medieval scrollwork)
- Subtitle: Spell class name (text-2xl, font-light)

### 2. Table of Contents Page
- Two-column layout (grid-cols-2 gap-4)
- Spell class entries as clickable list items
- Each entry: Class name + spell count + page number
- Decorative horizontal dividers (border-b with ornate pattern)

### 3. Spell Card Component
**Structure**:
- Ornate frame wrapper (border-8 with medieval border image)
- Spell icon/image (pixelated rendering, centered in decorative frame)
- Stat grid (2 columns, 3 rows):
  - School | Level
  - Cooldown | Mana
  - Cast Type | Rarity
- Unique info badges (damage, projectiles, radius) - inline-flex gap-2
- Description paragraph (italic, text-center)

**Frame Treatment**:
- Use provided spell_frame.png as border-image background
- Spell icon layered on top (absolute positioning)
- Shadow/glow effect around active page

### 4. Bookmark Search Bar
- Fixed position at top-center of viewport
- Ribbon bookmark shape (SVG clip-path)
- Input field: transparent background, ornate border-b
- Search icon: magnifying glass (Font Awesome)
- Autocomplete dropdown: parchment-style floating menu
- z-index: 100 to stay above book

### 5. Page Navigation Controls
**Position**: Bottom-center, outside book spread
- Previous/Next buttons: ornate arrow icons (chevron-left/right)
- Page counter: "Page X of Y" (text-sm, centered between buttons)
- Jump-to-page: small number input (w-16, text-center)
- Spacing: flex gap-6

### 6. Page Flip Interaction
- StPageFlip library integration
- Realistic page curl shadows
- Mouse drag + click navigation
- Keyboard arrow key support
- Page edge highlighting on hover (subtle glow)

## Images

### Required Images
1. **Spell Icons**: Each spell has an associated PNG image (e.g., acupuncture.png, blood_needles.png)
   - Display: 80px × 80px centered within 120px frame
   - Rendering: image-rendering: pixelated (for pixel art style)
   - Layering: Overlay on spell_frame.png background

2. **Decorative Frame**: spell_frame.png (120px × 120px)
   - Usage: Border wrapper for every spell icon
   - Position: Relative wrapper with absolute positioned spell icon inside

3. **Background Texture**: Parchment/leather texture for book pages
   - Usage: Repeating background pattern on each page
   - Opacity: Subtle (opacity-30) to not interfere with text

4. **Book Binding**: Center gutter shadow/texture
   - Usage: Vertical gradient overlay between left/right pages
   - Width: 40px centered in spread

5. **Ornamental Elements**:
   - Corner flourishes for cover/title pages
   - Divider scrollwork for TOC sections
   - Bookmark ribbon texture

### No Hero Image
This is an application interface, not a landing page - no hero section needed.

## Accessibility
- Semantic HTML: `<article>` for spell cards, `<nav>` for TOC
- ARIA labels: Search input, navigation buttons, page numbers
- Keyboard navigation: Tab through interactive elements, Arrow keys for page turning
- Focus indicators: Visible outline on bookmark search and buttons
- Alt text: Descriptive text for all spell icons

## Animation Strategy
**Minimal except for page flips**:
- Page turning: StPageFlip handles realistic 3D flip animation (1000ms duration)
- Search dropdown: Simple fade-in (200ms)
- Button hover: Scale transform (scale-105, 150ms)
- NO other animations - keep focus on content and page flips

## Responsive Considerations
- Desktop primary: Optimized for landscape viewing (1440px+ ideal)
- Tablet: Single-page view (no spread) below 1024px
- Mobile: Stack spell components, simplified navigation
- Breakpoints: md: 768px, lg: 1024px, xl: 1280px

## Special Requirements
1. **Data Filtering**: Parse HTML to extract ONLY spell entries (exclude armor, spellbooks, items, blocks, structures)
2. **Dynamic Pagination**: Calculate pages needed based on spell count (1-2 spells per page)
3. **Search Functionality**: Filter spells by name, school, or keyword in description
4. **Spell Classes Organization**: Group spells by school in TOC with jump-to-page links