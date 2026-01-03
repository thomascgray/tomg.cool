# Blog System

## Overview

Static blog generator that converts Markdown files to HTML. Posts are written in `drafts/`, built to `blog/`.

## Business Rules

- Drafts without frontmatter (missing `title`) are skipped during build
- Filenames follow `YYYY-MM-DD-slug.md` pattern - the ISO date prefix becomes the URL slug
- Date is extracted from frontmatter if present, otherwise from filename prefix
- Posts are listed in reverse chronological order on the index page

## Build Pipeline

```
drafts/*.md → scripts/build-blog.ts → blog/*.html + blog/index.html
```

- Template: `blog_template.html` with `{{title}}` and `{{content}}` placeholders
- All `{{title}}` occurrences are replaced (used in `<title>` tag)
- Index page uses the same template with "Blog" as the title
- Styles live in `style.css` (Poppins font, readable typography)

## Frontmatter Format

```yaml
---
title: Post Title       # Required - posts without this are skipped
description: A summary  # Optional - shown on index page
date: 2025-01-03        # Optional - falls back to filename prefix
mediumUrl: https://...  # Optional - shows "originally published on Medium" note
---
```

## Git Hooks

- **pre-push**: Runs `npm run build:blog` and blocks push if `blog/` has uncommitted changes
