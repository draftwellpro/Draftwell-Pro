# Install Help Page — Design

## Problem
Draftwell Pro's installer is unsigned (solo dev, no budget for a Microsoft EV code-signing cert). Windows flags it via browser download warnings and SmartScreen. Users land on this cold with no context and either bail or don't know how to proceed.

## Solution
Add `docs/installHelp.html`, a new page in the same visual theme as `index.html` (same `css/styles.css`, nav, footer). All three existing download CTAs (nav bar, hero, pricing card) are repointed here instead of linking straight to the GitHub releases page. The page explains why the warnings appear and walks through unblocking the file, then hands off to the real download link.

## Page content
1. **Intro** — short explanation: solo developer, can't afford Microsoft's code-signing certificate, so the installer isn't signed and Windows treats it as untrusted by default. Not malware — just unsigned.
2. **Four numbered steps**, each with an image placeholder:
   1. Browser "Keep this file?" prompt (Edge/Chrome flagging the download)
   2. Right-click the installer → Properties
   3. Check the "Unblock" checkbox → OK
   4. (context/fallback) SmartScreen "Windows protected your PC" screen — note that unblocking first usually prevents this from appearing at all
3. **Thank-you note** for bearing with the extra step.
4. **CTA button** — "Continue to Download" → `https://github.com/draftwellpro/Draftwell-Pro/releases/latest`.

## Placeholder component reuse
`css/styles.css` already defines an unused `.mockup-window > .mockup-titlebar (dots) + .mockup-placeholder > .ph-label (.ph-icon + p + .ph-hint)` component (built for the hero mockup, not currently used). Reuse it for each of the 4 step images instead of inventing new placeholder markup — keeps the page on-theme with zero new CSS.

## Link changes in `index.html`
Repoint these three anchors from the GitHub releases URL to `installHelp.html`:
- Nav CTA (`~line 32`)
- Hero CTA (`~line 56`)
- Pricing trial CTA, `id="download"` (`~line 1386`)

## Out of scope
- No real screenshots yet (placeholders only, per component above).
- No changes to `build.bat` or the installer/signing process itself.
- Mac path isn't affected by this (Gatekeeper flow differs); page is Windows-focused per the user's request.
