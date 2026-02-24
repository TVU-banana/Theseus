import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import { getEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Notes",
  description: "Study notes and concise knowledge records.",
};

export default async function NotesPage() {
  const entries = await getEntries("notes");

  return (
    <section className="stack">
      <header className="stack-sm">
        <h1>Notes</h1>
        <p className="muted">Short notes sorted by date (newest first).</p>
      </header>

      {entries.length === 0 ? (
        <p className="muted">No notes yet.</p>
      ) : (
        <ul className="entry-list">
          {entries.map((entry) => (
            <li className="entry-item" key={entry.slug}>
              <h2 className="entry-title">
                <Link href={`/notes/${entry.slug}`}>{entry.title}</Link>
              </h2>
              <p className="entry-meta">{formatDate(entry.date)}</p>
              {entry.tags.length > 0 ? (
                <ul className="tag-list">
                  {entry.tags.map((tag) => (
                    <li className="tag" key={tag}>
                      {tag}
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
