import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type { Collection, ContentEntry, EntryFrontmatter } from "@/lib/types";

const CONTENT_ROOT = path.join(process.cwd(), "content");
const COLLECTION_DIR: Record<Collection, string> = {
  blog: "blog",
  notes: "notes",
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function toSlug(fileName: string): string {
  return fileName.replace(/\.(md|mdx)$/i, "");
}

function toDate(value: unknown): string {
  if (typeof value !== "string") {
    return "1970-01-01";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "1970-01-01";
  }

  return value;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeFrontmatter(
  fileName: string,
  frontmatter: Record<string, unknown>,
): EntryFrontmatter {
  const slug = toSlug(fileName);

  return {
    title: typeof frontmatter.title === "string" && frontmatter.title.trim() ? frontmatter.title : slug,
    date: toDate(frontmatter.date),
    tags: toStringArray(frontmatter.tags),
    summary: typeof frontmatter.summary === "string" ? frontmatter.summary : "",
    draft: Boolean(frontmatter.draft),
  };
}

async function listCollectionFiles(collection: Collection): Promise<string[]> {
  const collectionPath = path.join(CONTENT_ROOT, COLLECTION_DIR[collection]);

  try {
    const entries = await fs.readdir(collectionPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && /\.(md|mdx)$/i.test(entry.name))
      .map((entry) => entry.name);
  } catch {
    return [];
  }
}

function sortByDateDesc(items: ContentEntry[]): ContentEntry[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.date).getTime();
    const bTime = new Date(b.date).getTime();
    return bTime - aTime;
  });
}

export async function getEntries(collection: Collection): Promise<ContentEntry[]> {
  const fileNames = await listCollectionFiles(collection);
  const collectionPath = path.join(CONTENT_ROOT, COLLECTION_DIR[collection]);

  const items = await Promise.all(
    fileNames.map(async (fileName) => {
      const filePath = path.join(collectionPath, fileName);
      const raw = await fs.readFile(filePath, "utf8");
      const parsed = matter(raw);
      const frontmatter = normalizeFrontmatter(fileName, parsed.data);

      return {
        ...frontmatter,
        slug: toSlug(fileName),
        collection,
        body: parsed.content,
      } satisfies ContentEntry;
    }),
  );

  return sortByDateDesc(items.filter((item) => !item.draft));
}

async function readEntryFile(collection: Collection, slug: string): Promise<string | null> {
  const collectionPath = path.join(CONTENT_ROOT, COLLECTION_DIR[collection]);
  const mdxPath = path.join(collectionPath, `${slug}.mdx`);
  const mdPath = path.join(collectionPath, `${slug}.md`);

  try {
    return await fs.readFile(mdxPath, "utf8");
  } catch {
    try {
      return await fs.readFile(mdPath, "utf8");
    } catch {
      return null;
    }
  }
}

export async function getEntryBySlug(
  collection: Collection,
  slug: string,
): Promise<ContentEntry | null> {
  if (!SLUG_PATTERN.test(slug)) {
    return null;
  }

  const source = await readEntryFile(collection, slug);
  if (!source) {
    return null;
  }

  const parsed = matter(source);
  const frontmatter = normalizeFrontmatter(`${slug}.mdx`, parsed.data);

  if (frontmatter.draft) {
    return null;
  }

  return {
    ...frontmatter,
    slug,
    collection,
    body: parsed.content,
  };
}

export async function getAllSlugs(collection: Collection): Promise<string[]> {
  const entries = await getEntries(collection);
  return entries.map((entry) => entry.slug);
}
