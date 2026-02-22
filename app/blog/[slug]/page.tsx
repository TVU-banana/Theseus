import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MDXContent from "@/components/MDXContent";
import { formatDate } from "@/lib/date";
import { getAllSlugs, getEntryBySlug } from "@/lib/content";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getAllSlugs("blog");
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getEntryBySlug("blog", slug);

  if (!entry) {
    return {
      title: "Not Found",
      description: "The requested post does not exist.",
    };
  }

  return {
    title: entry.title,
    description: entry.summary || "Blog post",
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const entry = await getEntryBySlug("blog", slug);

  if (!entry) {
    notFound();
  }

  return (
    <article className="stack">
      <header className="stack-sm">
        <h1>{entry.title}</h1>
        <p className="entry-meta">{formatDate(entry.date)}</p>
        {entry.summary ? <p className="muted">{entry.summary}</p> : null}
        {entry.tags.length > 0 ? (
          <ul className="tag-list">
            {entry.tags.map((tag) => (
              <li className="tag" key={tag}>
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <section className="prose">
        <MDXContent source={entry.body} />
      </section>
    </article>
  );
}
