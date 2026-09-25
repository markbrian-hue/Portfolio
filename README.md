# Mark Brian Viloria — portfolio

Static HTML, CSS, and native JavaScript. No runtime dependencies or framework migration.

## Run and verify

Requires Node.js/npm and Python 3. No package installation is needed.

- `npm run dev`: preview at http://127.0.0.1:4173.
- `npm run check`: JavaScript syntax and HTML nesting, anchor, local asset, label, image-dimension, and external-link checks.
- `npm run build`: validate and package the site in `dist/` for static hosting.
- `python -m http.server 4174 --bind 127.0.0.1 --directory dist`: inspect the production output.

The original repository had no lint, type-check, test, or build configuration. There is no TypeScript to type-check. The dependency-free check script is a focused structural check, not a full HTML validator or accessibility audit. Browser verification is recorded in VERIFICATION.md.

## Design and maintenance

- `index.html`: editable copy and reusable semantic project, disclosure, service, and inquiry structures. Content remains available without JavaScript.
- `styles.css`: centralized tokens in `:root` and shared `.button`, `.text-link`, `.project`, `.case-study`, `.split-section`, and `.section-heading` components. Responsive rules follow the base components.
- `script.js`: local brief preparation, validation, review, and editing. Nothing is stored or submitted to a backend. Continue in WhatsApp opens an encoded draft; the visitor sends it there.
- `images/*.webp`: optimized versions of the original screenshots and portrait. Originals are retained.
- `tools/site.py`: standard-library validation and deployment packaging; only referenced site assets are copied.

After modifying CSS or JS, update their version query strings in index.html to avoid stale browser caches. Google Fonts uses swap and system fallbacks; the page does not depend on font availability.

## Content to supply before public launch

Search `content-placeholder` in index.html for each project's missing information:

1. Client name (with permission) or personal/academic context, project date, and original brief.
2. Your exact role, collaborators, process, design decisions, and implementation challenges.
3. Verified launch status and outcomes. Metrics need a baseline, timeframe, and source; qualitative feedback is fine when attributed with permission.
4. Live or repository links for Coffee Shop POS and Luxury Travel Website. They currently display an honest preview-only label.
5. Approved testimonials, if available. None are fabricated or displayed.
6. Confirm that the existing student biography and accepting-inquiries status remain current. Confirm the proposed workflow and small-business positioning fit your intended clients.
7. Optional business email as an alternative to WhatsApp; a canonical deployment domain and social-share image for production metadata.

Keep project capabilities separate from measured business outcomes. The current problem framing summarizes the existing project descriptions; it is not presented as researched client testimony.
