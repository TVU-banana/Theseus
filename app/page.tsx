import Link from "next/link";
import { siteConfig } from "@/lib/site";

const sections = [
  {
    href: "/blog",
    title: "Blog",
    description: "Long-form writing about thinking, decisions, and reflection.",
  },
  {
    href: "/notes",
    title: "Notes",
    description: "Short study notes focused on concrete ideas and takeaways.",
  },
  {
    href: "/resume",
    title: "Resume",
    description: "Resume page rendered from local YAML content.",
  },
];

export default function HomePage() {
  return (
    <section className="stack">
      <header className="stack-sm">
        <h1>{siteConfig.name}</h1>
        <p>{siteConfig.intro}</p>
      </header>

      <ul className="entry-list">
        {sections.map((item) => (
          <li className="entry-item" key={item.href}>
            <h2 className="entry-title">
              <Link href={item.href}>{item.title}</Link>
            </h2>
            <p className="muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
