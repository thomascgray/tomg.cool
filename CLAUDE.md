# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio/link hub website at https://tomg.cool/ with a Markdown-based blog system.

## Tech Stack

- **Main site**: Vanilla HTML/CSS/JavaScript (no frameworks) - entirely self-contained in `index.html`
- **Blog build**: TypeScript using `marked` (Markdown parser) and `gray-matter` (YAML frontmatter)
- **Package manager**: npm

## Commands

```bash
# Install dependencies
npm install

# Run local dev server (http://localhost:3000)
npm run dev

# Build blog posts
npm run build:blog
```

## Architecture

### Main Site (`index.html`)
Single self-contained HTML file with embedded CSS and JavaScript. Features:
- 12 color schemes randomly selected on each page load
- Dynamic emoji decorations and favicon generation
- Link hub to external projects and profiles

### Blog System (`scripts/build-blog.ts`)
Converts Markdown files to static HTML:
- **Source**: `drafts/*.md` (Markdown with YAML frontmatter)
- **Template**: `blog_template.html` (wraps converted content)
- **Output**: `blog/*.html` (individual posts) + `blog/index.html` (listing page)

Frontmatter format:
```yaml
---
title: Post Title       # Required
description: A summary  # Optional - shown on index page
date: 2025-01-03        # Optional - falls back to filename prefix
mediumUrl: https://...  # Optional - shows "originally published on Medium" note
---
```

### Color Scheme System
Defined in `index.html` as `colour_schemes` object with 12 themes. Each theme has:
- `one`: Primary text color
- `two`: Hover state color
- `three`: Background color

## Project Memory

When working on these areas, read the relevant memory files:

- "blog", "drafts", "posts", "markdown" → read `./CLAUDE/blog-system.md`
