import type { Metadata } from "next";
import Link from "next/link";
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
    description: `Blog post: ${entry.title}`,
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
        {entry.tags.length > 0 ? (
          <ul className="tag-list">
            {entry.tags.map((tag) => (
              <li className="tag" key={tag}>
                <Link href={`/blog/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
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
