# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a static website for Nexus.AI, a premium AI & automation consultancy. It's built with vanilla HTML, CSS, and JavaScript - no frameworks or build processes required.

## Development Commands

Since this is a static site with no build system, use one of these local servers:

```bash
# Python 3
python -m http.server 8000

# Node.js (if available)
npx serve .

# VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

## Architecture

Multi-page static website with page-specific assets:

```
website/
├── [page].html       # Each page has its own HTML file
├── css/
│   ├── styles.css    # Main/homepage styles
│   └── [page].css    # Page-specific styles
└── js/
    ├── script.js     # Main/homepage JavaScript
    └── [page].js     # Page-specific JavaScript
```

Key architectural decisions:
- No build process or transpilation
- No dependencies except Lucide icons (CDN)
- Each page has dedicated CSS/JS files for isolation
- Performance-optimized with Intersection Observer and throttled events
- Hardware-accelerated CSS animations

## Important Technical Details

1. **CSS Design System**: Uses CSS custom properties for theming (see `:root` in styles.css)
2. **Animation Performance**: All animations use `transform` and `opacity` for GPU acceleration
3. **Accessibility**: Includes `prefers-reduced-motion` media queries
4. **No Testing/Linting**: No automated testing or linting setup currently exists

## Deployment

Direct upload to any static hosting service (Netlify, Vercel, GitHub Pages) - no build step required.