# Install Help Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone `installHelp.html` page that explains the unsigned-installer Windows warnings before sending users to the real download, and repoint the site's 3 existing download CTAs to it.

**Architecture:** Static HTML page under `docs/`, following the exact boilerplate already established by `docs/privacyPolicy.html` (own nav with `index.html#...` anchors, a scoped content wrapper with page-local `<style>`, shared footer). No JS, no build step — this is a GitHub Pages static site. Image placeholders reuse the existing (currently unused) `.mockup-window` / `.mockup-placeholder` / `.ph-label` component already defined in `docs/css/styles.css:270-321`, so zero new CSS is needed for them.

**Tech Stack:** Plain HTML/CSS, `docs/css/styles.css` (shared stylesheet), no package manager, no test framework — verification is manual (open in browser) plus `grep` checks on link targets.

## Global Constraints

- Follow `docs/privacyPolicy.html`'s existing pattern exactly: nav uses `index.html#section` anchors (not bare `#section`), logo links to `index.html`, footer is the shared footer block with a `pp-back`-style "← Back to Draftwell Pro" link at the top of the content.
- Reuse `.mockup-window > .mockup-titlebar (.dot-red/.dot-amber/.dot-green) + .mockup-placeholder > .ph-label (.ph-icon + p + .ph-hint)` for all 4 image placeholders — do not invent new placeholder markup.
- Do not touch `build.bat`, the installer, or any signing process.
- Do not add real screenshots — placeholders only.
- Real download target stays `https://github.com/draftwellpro/Draftwell-Pro/releases/latest`.
- On `installHelp.html` itself, the nav's own "Download" CTA must link straight to the GitHub releases URL (not back to `installHelp.html`) to avoid a self-loop.

---

### Task 1: Create `docs/installHelp.html`

**Files:**
- Create: `docs/installHelp.html`

**Interfaces:**
- Produces: a page reachable at relative path `installHelp.html` from `docs/`, with a primary CTA anchor `<a href="https://github.com/draftwellpro/Draftwell-Pro/releases/latest">` for "Continue to Download".

- [ ] **Step 1: Write the file**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Before You Download — Draftwell Pro</title>
  <meta name="description" content="Why the Draftwell Pro installer trips Windows warnings, and how to get past them safely.">
  <meta name="theme-color" content="#0a0d14">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800;14..32,900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
  <link rel="icon" href="images/Favicon.ico">
  <script async data-id="101507577" src="//static.getclicky.com/js"></script>
  <style>
    .ih-wrap {
      max-width: 760px;
      margin: 0 auto;
      padding: 110px 24px 100px;
    }
    .ih-label {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--blue);
      margin-bottom: 14px;
    }
    .ih-wrap h1 {
      font-size: clamp(2rem, 5vw, 2.8rem);
      font-weight: 800;
      line-height: 1.15;
      margin-bottom: 18px;
      color: var(--text-1);
    }
    .ih-wrap > p {
      font-size: 0.96rem;
      color: var(--text-3);
      line-height: 1.75;
      margin-bottom: 14px;
    }
    .ih-wrap a { color: var(--blue); text-decoration: none; }
    .ih-wrap a:hover { text-decoration: underline; }
    .ih-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-4);
      text-decoration: none;
      margin-bottom: 40px;
      transition: color .15s;
    }
    .ih-back:hover { color: var(--text-2); text-decoration: none; }
    .ih-highlight {
      background: rgba(74,158,255,0.07);
      border-left: 3px solid var(--blue);
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin: 20px 0 40px;
    }
    .ih-highlight p { margin: 0; color: var(--text-2); }
    .ih-steps {
      display: flex;
      flex-direction: column;
      gap: 36px;
      margin: 40px 0;
    }
    .ih-step-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bg-4);
      border: 1px solid var(--border-mid);
      font-family: var(--font-mono);
      font-size: 13px;
      color: var(--text-2);
      margin-bottom: 12px;
    }
    .ih-step h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-1);
      margin-bottom: 6px;
    }
    .ih-step p {
      font-size: 0.92rem;
      color: var(--text-3);
      line-height: 1.6;
      margin-bottom: 14px;
    }
    .ih-step .mockup-window { max-width: 480px; }
    .ih-cta {
      text-align: center;
      margin: 56px 0 24px;
    }
    .ih-thanks {
      text-align: center;
      font-size: 0.92rem;
      color: var(--text-4);
      margin-top: 18px;
    }
  </style>
</head>
<body>

<!-- ═══════════════════════════ NAV ═══════════════════════════ -->
<nav id="nav" class="scrolled">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo" style="text-decoration:none;color:inherit"><img src="images/logo.png" alt="Draftwell Pro"> Draftwell <span>Pro</span></a>
    <ul class="nav-links">
      <li><a href="index.html#import">Import &amp; Outline</a></li>
      <li><a href="index.html#analytics">Analytics</a></li>
      <li><a href="index.html#search">Search</a></li>
      <li><a href="index.html#query-tracker">Query Tracker</a></li>
      <li><a href="index.html#cloud-sync">Cloud Sync</a></li>
      <li><a href="index.html#privacy">Privacy</a></li>
      <li><a href="index.html#comparison">Comparison</a></li>
      <li><a href="index.html#price">Pricing</a></li>
    </ul>
    <a href="https://github.com/draftwellpro/Draftwell-Pro/releases/latest" class="btn btn-primary nav-cta">Download</a>
  </div>
</nav>

<!-- ══════════════════════ INSTALL HELP ═══════════════════════ -->
<div class="ih-wrap">

  <a href="index.html" class="ih-back">&#8592; Back to Draftwell Pro</a>

  <span class="ih-label">Before You Install</span>
  <h1>Windows might warn you. Here's why.</h1>
  <p>Draftwell Pro is built by one person, not a company. Microsoft charges developers several hundred dollars a year for a code-signing certificate that tells Windows "this app is trusted." As a solo developer, I can't justify that cost for a $10 app — so the installer arrives unsigned.</p>
  <p>That means when you download and run it, Windows will flag it as coming from an "unknown publisher." It's not malware — it's just untrusted by default because nobody paid Microsoft to vouch for it. The steps below take about 30 seconds and get you past the warnings safely.</p>

  <div class="ih-highlight">
    <p>&#128274; Draftwell Pro never phones home with your manuscript data. You can verify the source and build it yourself — see the project README.</p>
  </div>

  <div class="ih-steps">

    <div class="ih-step">
      <div class="ih-step-num">1</div>
      <h3>Your browser may ask if you want to keep the file</h3>
      <p>Edge or Chrome sometimes flag .exe downloads that aren't yet "commonly downloaded." Click <strong>Keep</strong> (or <strong>Keep anyway</strong>) to continue.</p>
      <div class="mockup-window">
        <div class="mockup-titlebar">
          <div class="dot dot-red"></div><div class="dot dot-amber"></div><div class="dot dot-green"></div>
          <div class="mockup-title">browser-download-prompt.png</div>
        </div>
        <div class="mockup-placeholder">
          <div class="ph-label">
            <div class="ph-icon">&#127760;</div>
            <p>Browser "Keep this file?" prompt</p>
            <div class="ph-hint">screenshot placeholder</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ih-step">
      <div class="ih-step-num">2</div>
      <h3>Right-click the downloaded installer &rarr; Properties</h3>
      <p>Find the downloaded file (usually in your <strong>Downloads</strong> folder), right-click it, and choose <strong>Properties</strong> from the menu.</p>
      <div class="mockup-window">
        <div class="mockup-titlebar">
          <div class="dot dot-red"></div><div class="dot dot-amber"></div><div class="dot dot-green"></div>
          <div class="mockup-title">right-click-properties.png</div>
        </div>
        <div class="mockup-placeholder">
          <div class="ph-label">
            <div class="ph-icon">&#128433;&#65039;</div>
            <p>Right-click &rarr; Properties</p>
            <div class="ph-hint">screenshot placeholder</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ih-step">
      <div class="ih-step-num">3</div>
      <h3>Check "Unblock," then click OK</h3>
      <p>At the bottom of the <strong>General</strong> tab, you'll see a security note with an <strong>Unblock</strong> checkbox. Check it, then click <strong>OK</strong>. This tells Windows you trust the file.</p>
      <div class="mockup-window">
        <div class="mockup-titlebar">
          <div class="dot dot-red"></div><div class="dot dot-amber"></div><div class="dot dot-green"></div>
          <div class="mockup-title">unblock-checkbox.png</div>
        </div>
        <div class="mockup-placeholder">
          <div class="ph-label">
            <div class="ph-icon">&#9745;&#65039;</div>
            <p>"Unblock" checkbox, close-up</p>
            <div class="ph-hint">screenshot placeholder</div>
          </div>
        </div>
      </div>
    </div>

    <div class="ih-step">
      <div class="ih-step-num">4</div>
      <h3>If you still see a blue "Windows protected your PC" screen</h3>
      <p>Unblocking the file in Step 3 usually prevents this entirely. If it still appears, click <strong>More info</strong>, then <strong>Run anyway</strong>.</p>
      <div class="mockup-window">
        <div class="mockup-titlebar">
          <div class="dot dot-red"></div><div class="dot dot-amber"></div><div class="dot dot-green"></div>
          <div class="mockup-title">smartscreen-warning.png</div>
        </div>
        <div class="mockup-placeholder">
          <div class="ph-label">
            <div class="ph-icon">&#128737;&#65039;</div>
            <p>SmartScreen "Windows protected your PC"</p>
            <div class="ph-hint">screenshot placeholder</div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <p style="text-align:center;color:var(--text-2);">Thanks for bearing with the extra steps — it means a lot for a one-person project.</p>

  <div class="ih-cta">
    <a href="https://github.com/draftwellpro/Draftwell-Pro/releases/latest" class="btn btn-primary btn-lg">Continue to Download &#8594;</a>
  </div>

</div>

<!-- ═════════════════════════ FOOTER ═════════════════════════ -->
<footer>
  <div class="container footer-inner">
    <div class="footer-logo"><img src="images/logo.png" alt="Draftwell Pro"></div>
    <ul class="footer-links">
      <li><a href="index.html#editor">Features</a></li>
      <li><a href="index.html#analytics">Analytics</a></li>
      <li><a href="index.html#search">Search</a></li>
      <li><a href="index.html#query-tracker">Query Tracker</a></li>
      <li><a href="index.html#privacy">Privacy</a></li>
      <li><a href="index.html#price">Pricing</a></li>
      <li><a href="privacyPolicy.html">Privacy Policy</a></li>
    </ul>
    <div class="footer-copy">&copy; 2025 Draftwell Pro. Designed by a writer, for writers.</div>
  </div>
</footer>

</body>
</html>
```

- [ ] **Step 2: Verify in browser**

Run: `start "" "docs/installHelp.html"` (Windows: opens the file directly in the default browser)
Expected: Page loads with dark theme matching `index.html`, nav links work, 4 numbered steps each show a bordered placeholder box with an icon + caption, and the "Continue to Download" button is visible at the bottom.

- [ ] **Step 3: Verify the real download link is correct**

Run: `grep -c "https://github.com/draftwellpro/Draftwell-Pro/releases/latest" docs/installHelp.html`
Expected: `2` (one in the nav CTA, one in the "Continue to Download" button)

- [ ] **Step 4: Commit**

```bash
git add docs/installHelp.html
git commit -m "Add install-help page explaining unsigned-installer warnings"
```

---

### Task 2: Repoint the 3 download CTAs in `docs/index.html`

**Files:**
- Modify: `docs/index.html:32` (nav CTA)
- Modify: `docs/index.html:56` (hero CTA)
- Modify: `docs/index.html:1386` (pricing trial CTA, `id="download"`)

**Interfaces:**
- Consumes: `docs/installHelp.html` produced by Task 1 (must exist at `docs/installHelp.html` before this task is verified).

- [ ] **Step 1: Update the nav CTA**

In `docs/index.html`, change:
```html
    <a href="https://github.com/draftwellpro/Draftwell-Pro/releases/latest" class="btn btn-primary nav-cta">Download</a>
```
to:
```html
    <a href="installHelp.html" class="btn btn-primary nav-cta">Download</a>
```

- [ ] **Step 2: Update the hero CTA**

In `docs/index.html`, change:
```html
      <a href="https://github.com/draftwellpro/Draftwell-Pro/releases/latest" class="btn btn-primary btn-lg">&#11015; Download</a>
```
to:
```html
      <a href="installHelp.html" class="btn btn-primary btn-lg">&#11015; Download</a>
```

- [ ] **Step 3: Update the pricing trial CTA**

In `docs/index.html`, change:
```html
          <a href="https://github.com/draftwellpro/Draftwell-Pro/releases/latest" class="btn btn-ghost btn-lg" id="download">&#11015; Download Free Trial</a>
```
to:
```html
          <a href="installHelp.html" class="btn btn-ghost btn-lg" id="download">&#11015; Download Free Trial</a>
```

- [ ] **Step 4: Verify no direct GitHub download links remain in `index.html`**

Run: `grep -n "github.com/draftwellpro/Draftwell-Pro/releases" docs/index.html`
Expected: no output (0 matches) — all 3 CTAs now point to `installHelp.html`.

- [ ] **Step 5: Verify `installHelp.html` still has the real link**

Run: `grep -c "github.com/draftwellpro/Draftwell-Pro/releases" docs/installHelp.html`
Expected: `2`

- [ ] **Step 6: Open `index.html` in browser and click a Download button**

Run: `start "" "docs/index.html"`
Expected: clicking any of the 3 Download buttons navigates to `installHelp.html`, not GitHub.

- [ ] **Step 7: Commit**

```bash
git add docs/index.html
git commit -m "Route download CTAs through install-help page first"
```
