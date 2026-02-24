import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts and long-form writing.",
};

export default async function BlogPage() {
  const entries = await getEntries("blog");

  return (
    <section className="stack">
      <header className="stack-sm">
        <h1>Blog</h1>
        <p className="muted">Posts sorted by date (newest first).</p>
      </header>

      {entries.length === 0 ? (
        <p className="muted">No posts yet.</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li className="entry-item" key={entry.slug}>
              <h2 className="entry-title">
                <Link href={`/blog/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <p className="entry-meta">{formatDate(entry.date)}</p>
              {entry.tags.length > 0 ? (
                <ul className="tag-list">
                  {entry.tags.map((tag) => (
                    <li className="tag" key={tag}>
                      <Link href={`/blog/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
