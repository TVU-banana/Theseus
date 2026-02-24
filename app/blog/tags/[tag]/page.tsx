import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/date";
import { getEntries } from "@/lib/content";

type BlogTagPageProps = {
  params: Promise<{ tag: string }>;
};

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeTag(value: string): string {
  return value.trim().toLowerCase();
}

export async function generateStaticParams() {
  const entries = await getEntries("blog");
  const tagSet = new Set<string>();

  for (const entry of entries) {
    for (const tag of entry.tags) {
      if (tag.trim()) {
        tagSet.add(tag);
      }
    }
  }

  return Array.from(tagSet).map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: BlogTagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const safeTag = safeDecode(tag);

  return {
    title: `Tag: ${safeTag}`,
    description: `Blog posts tagged with "${safeTag}".`,
  };
}

export default async function BlogTagPage({ params }: BlogTagPageProps) {
  const { tag } = await params;
  const safeTag = safeDecode(tag);
  const target = normalizeTag(safeTag);

  const entries = await getEntries("blog");
  const filtered = entries.filter((entry) => entry.tags.some((entryTag) => normalizeTag(entryTag) === target));

  if (filtered.length === 0) {
    notFound();
  }

  return (
    <section className="stack">
      <header className="stack-sm">
        <h1>Tag: {safeTag}</h1>
        <p className="muted">Posts with this tag.</p>
      </header>

      <ul className="entry-list">
        {filtered.map((entry) => (
          <li className="entry-item" key={entry.slug}>
            <h2 className="entry-title">
              <Link href={`/blog/${entry.slug}`}>{entry.title}</Link>
            </h2>
            <p className="entry-meta">{formatDate(entry.date)}</p>
            {entry.tags.length > 0 ? (
              <ul className="tag-list">
                {entry.tags.map((entryTag) => (
                  <li className="tag" key={`${entry.slug}-${entryTag}`}>
                    <Link href={`/blog/tags/${encodeURIComponent(entryTag)}`}>{entryTag}</Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
