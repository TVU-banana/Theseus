#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const USAGE = `
Usage:
  pnpm import:md --file <path-to-md> --to <blog|notes> [--slug <slug>] [--force]

Examples:
  pnpm import:md --file "D:\\notes\\my-post.md" --to blog
  pnpm import:md --file "./drafts/alias-note.md" --to notes --slug ts-alias
  pnpm import:md --file "./drafts/post.md" --to blog --force
`;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) {
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    i += 1;
  }
  return args;
}

function normalizeCollection(value) {
  if (value === "blog" || value === "notes") {
    return value;
  }
  if (value === "posts") {
    return "blog";
  }
  return null;
}

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashText(input) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function buildFallbackSlug(input, collection) {
  return `${collection}-${hashText(input)}`;
}

function resolveDate(value) {
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime())) {
    return value.slice(0, 10);
  }
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function resolveTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function resolveDraft(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

function extractTitle(content, fallback) {
  const heading = content.match(/^#\s+(.+)$/m);
  if (heading && heading[1]) {
    return heading[1].trim();
  }
  return fallback;
}

function quote(value) {
  return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildFrontmatter(data) {
  const tagsLiteral = data.tags.map((tag) => quote(tag)).join(", ");
  return [
    "---",
    `title: ${quote(data.title)}`,
    `date: ${quote(data.date)}`,
    `tags: [${tagsLiteral}]`,
    `draft: ${data.draft ? "true" : "false"}`,
    "---",
    "",
  ].join("\n");
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputFile = typeof args.file === "string" ? args.file : "";
  const collection = normalizeCollection(typeof args.to === "string" ? args.to : "");
  const force = Boolean(args.force);

  if (!inputFile || !collection) {
    process.stderr.write(USAGE);
    process.exitCode = 1;
    return;
  }

  const sourcePath = path.resolve(process.cwd(), inputFile);
  let sourceRaw = "";
  try {
    sourceRaw = await fs.readFile(sourcePath, "utf8");
  } catch {
    process.stderr.write(`Source file not found: ${sourcePath}\n`);
    process.exitCode = 1;
    return;
  }

  const parsed = matter(sourceRaw);
  const fileName = path.basename(sourcePath, path.extname(sourcePath));
  const rawSlug = typeof args.slug === "string" && args.slug.trim() ? args.slug.trim() : fileName;
  let slug = slugify(rawSlug);

  if (!slug) {
    slug = buildFallbackSlug(fileName, collection);
    process.stdout.write(`Auto-generated slug for non-ASCII filename: ${slug}\n`);
  }

  if (!slug) {
    process.stderr.write("Invalid slug. Please provide --slug.\n");
    process.exitCode = 1;
    return;
  }

  const titleFromFrontmatter =
    typeof parsed.data.title === "string" && parsed.data.title.trim() ? parsed.data.title.trim() : "";
  const title = titleFromFrontmatter || extractTitle(parsed.content, fileName);
  const date = resolveDate(parsed.data.date);
  const tags = resolveTags(parsed.data.tags);
  const draft = resolveDraft(parsed.data.draft);

  const outDir = path.join(process.cwd(), "content", collection);
  const outFile = path.join(outDir, `${slug}.mdx`);

  await fs.mkdir(outDir, { recursive: true });

  try {
    await fs.access(outFile);
    if (!force) {
      process.stderr.write(`Target exists: ${outFile}\nUse --force to overwrite.\n`);
      process.exitCode = 1;
      return;
    }
  } catch {
    // target not exists
  }

  const frontmatter = buildFrontmatter({ title, date, tags, draft });
  const body = parsed.content.trimStart();
  const output = `${frontmatter}${body}\n`;

  await fs.writeFile(outFile, output, "utf8");
  process.stdout.write(`Imported: ${sourcePath}\n`);
  process.stdout.write(`To: ${outFile}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
