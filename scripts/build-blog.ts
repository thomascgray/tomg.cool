import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, basename } from "path";
import { marked } from "marked";
import matter from "gray-matter";

const DRAFTS_DIR = "drafts";
const OUT_DIR = "blog";
const TEMPLATE_PATH = "blog_template.html";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function ordinal(n: number): string {
  if (n > 3 && n < 21) return n + "th";
  switch (n % 10) {
    case 1: return n + "st";
    case 2: return n + "nd";
    case 3: return n + "rd";
    default: return n + "th";
  }
}

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${ordinal(day)} ${MONTHS[month - 1]} ${year}`;
}

interface PostMeta {
  title: string;
  slug: string;
  date: string;
  description: string;
}

async function build() {
  const template = await readFile(TEMPLATE_PATH, "utf-8");
  const files = (await readdir(DRAFTS_DIR)).filter((f) => f.endsWith(".md"));

  await mkdir(OUT_DIR, { recursive: true });

  const posts: PostMeta[] = [];

  for (const file of files) {
    const raw = await readFile(join(DRAFTS_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    // Skip drafts without frontmatter title
    if (!data.title) {
      console.log(`Skipped (no title): ${file}`);
      continue;
    }

    const html = await marked(content);

    const slug = basename(file, ".md");
    const title = data.title;
    const description = data.description || "";
    const mediumUrl = data.mediumUrl || "";
    // Get date from frontmatter or filename, format as YYYY-MM-DD string
    const rawDate = data.date || slug.slice(0, 10);
    const date =
      rawDate instanceof Date
        ? rawDate.toISOString().slice(0, 10)
        : String(rawDate).slice(0, 10);

    posts.push({ title, slug, date, description });

    // Build post content with header
    const mediumNote = mediumUrl
      ? `<p class="medium-note">This article was originally published on <a href="${mediumUrl}" target="_blank">Medium</a>.</p>`
      : "";

    const postContent = `
        <article>
          <header>
            <h1>${title}</h1>
            <p class="post-date">${formatDate(date)}</p>
            ${mediumNote}
          </header>
          ${html}
        </article>`;

    const output = template
      .replace(/\{\{title\}\}/g, title)
      .replace("{{content}}", postContent);

    const outFile = join(OUT_DIR, slug + ".html");
    await writeFile(outFile, output);
    console.log(`Built: ${outFile}`);
  }

  // Sort posts by date descending
  posts.sort((a, b) => b.date.localeCompare(a.date));

  // Build index page
  const indexHtml = buildIndex(posts, template);
  const indexFile = join(OUT_DIR, "index.html");
  await writeFile(indexFile, indexHtml);
  console.log(`Built: ${indexFile}`);
}

function buildIndex(posts: PostMeta[], template: string): string {
  const listHtml = posts
    .map(
      (p) => `
          <li>
            <a href="/blog/${p.slug}.html">${p.title}</a>
            ${p.description ? `<p class="post-description">${p.description}</p>` : ""}
            <p class="post-date">${formatDate(p.date)}</p>
          </li>`
    )
    .join("");

  const content = `
        <div class="blog-index">
          <h1>Blog</h1>
          <ul class="post-list">${listHtml}
          </ul>
        </div>`;

  return template
    .replace(/\{\{title\}\}/g, "Blog")
    .replace("{{content}}", content);
}

build().catch(console.error);
