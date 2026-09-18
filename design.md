# BriBooks design system

A shared visual direction for the authoring app. The public BriBooks site is a product-flow reference, not a pixel template. This project should describe only features it actually provides.

## Audience and job
Young authors (especially ages 8–18) and parents helping them. The main action is to start a book, choose a story direction and cover theme, write chapters, and publish online when ready.

## Genre and structures
- Genre: playful editorial.
- Marketing: split studio hero with a tangible stack of book covers, followed by a numbered writing journey and a reading shelf.
- App: workbench layout with clear wayfinding, visible progress, generous writing space, and one primary action per step.
- Content: book-like reading surfaces with quiet controls.

## Locked palette
- Paper: `--color-paper: oklch(97% 0.012 95)`
- Soft paper: `--color-paper-2: oklch(94% 0.018 95)`
- Ink: `--color-ink: oklch(24% 0.025 220)`
- Deep teal: `--color-primary: oklch(36% 0.070 195)`
- Coral: `--color-coral: oklch(69% 0.17 31)`
- Pear: `--color-pear: oklch(87% 0.13 95)`
- Sky: `--color-sky: oklch(88% 0.06 210)`
- Rules: `--color-rule: oklch(82% 0.015 95)`

All component colors should use these tokens or semantic Tailwind names mapped to them.

## Type and spacing
Plus Jakarta Sans for display and body; JetBrains Mono only for small section labels and step numbers. Display type is upright. Mobile spacing follows a 4-point scale and tap targets are at least 44px high.

## Motion and interaction
A page reveal and small cover movement convey a story coming to life. Every action works with reduced motion and touch. Form failures show a clear error near the action; progress is saved through the writing flow.

## Shared UI
- Header: compact wordmark, Books, My books, one strong Write a book action.
- Primary CTA: deep teal fill, cream text, short verb phrase.
- Secondary CTA: paper fill and ink outline.
- Cards: book-cover shape for stories; restrained bordered panels for forms.
- App pages have no decorative hero art. Function carries the screen.

## Page priorities
1. Start a book: genre → theme → details → editor.
2. Continue a draft: My books lists drafts and published books separately.
3. Editor: chapters, save state, theme, and publish state remain visible.
4. Browse: published books only, with honest empty states.
