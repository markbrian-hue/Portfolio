# Verification — 25 September 2026

## Automated checks

- `npm run check`: PASS. JavaScript syntax; HTML tag nesting; unique IDs; in-page anchors; referenced local assets; form labels; image alt text and dimensions; external-link isolation.
- `npm run build`: PASS. Static production output in `dist/`, 10 files, 287,865 bytes (external Google Fonts excluded).
- `git diff --check`: PASS after line-ending normalization. Git reports its existing automatic LF-to-CRLF conversion policy as a warning.
- No pre-existing lint, type-check, or test framework was present. No framework or runtime dependency was added. This remains plain HTML/CSS/JavaScript.
- Representative text contrast: main text 15.80:1; muted text on panels 8.04:1; primary button 7.86:1; about-section body 5.88:1; placeholders 7.52:1.

## Browser checks

Checked with the Codex Chromium browser, including the packaged `/dist/` site.

- Measured responsive overflow at 320, 390, 768, 1024, 1440, and 1920 px: none.
- Visually inspected desktop and mobile heroes, tablet work list, expanded case studies, mobile about, and desktop/mobile contact and draft review.
- Navigation: Work, Services, About, Contact, and back-to-top anchors work; sticky header does not obscure section headings.
- Keyboard: skip link receives visible focus; case-study and FAQ disclosures respond to Enter; preview focuses the WhatsApp action; editing returns focus to the name field.
- Contact: native required validation, whitespace-only validation, Unicode and special-character encoding, HTML rendered as plain text, optional field defaults, and edit/preserve behavior pass.
- WhatsApp handoff: verified the official Share on WhatsApp page displays +63 993 525 9766 and the prepared test brief. No message sent; account login and actual delivery were not exercised.
- Images: no broken loaded images. Offscreen project images are lazy-loaded.
- Local browser warning/error logs: none.
- Reduced motion: CSS removes transitions/animations; scrolling is immediate for all visitors. No motion effects hide content.
- No-JavaScript fallback verified in source: portfolio and native disclosures remain available; brief form stays hidden until JS activates it, preventing accidental native GET submission; direct WhatsApp contact remains available.

## Public link checks

HTTP 200: Celestia, 91 Cafe, GitGlance, and GitHub profile.
LinkedIn: HTTP 999 blocks automated access; original URL retained, not confirmed broken.
Coffee Shop POS and Luxury Travel Website had no live URLs in the source; both are explicitly labelled preview-only.

## Limits and launch preparation

This is not a comprehensive assistive-technology audit, Safari/Firefox test, or Lighthouse benchmark. No backend, analytics, or deployment was added. Testimonials and quantitative project outcomes were absent from the supplied content and were not invented. Replace the marked case-study placeholders and confirm current availability and biography before publishing; see README.md.


## Motion update — 27 September 2026

- Added staggered hero entrances, one-time section/project reveals, smooth anchor scrolling, pointer-only hover lifts, and opening/inquiry-preview transitions. Atlas37 and the user's content edits were preserved.
- Production build and source checks pass. No dependencies added.
- Browser verification: desktop (1440px), mobile (390px), narrow mobile (320px); no overflow or local console warnings/errors. Entrances finish at full opacity, work navigation settles below the sticky header, keyboard disclosure toggling works, inquiry preview retains the correct destination, and editing preserves input/focus. No message sent.
- Motion behavior checks with a simulated reduced-motion preference: entrances suppressed when enabled, active entrances cancelled when enabled during playback, focused content revealed immediately. OS preference was not changed during browser testing.
- Content has no hidden reveal classes and remains visible if animation APIs are unavailable. CSS transitions and smooth scrolling are disabled by the reduced-motion media query.
- The earlier report's immediate-scrolling behavior is superseded by this update for visitors who have not requested reduced motion.
