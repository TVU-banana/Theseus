import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import WidthSettings from "@/components/WidthSettings";
import { navItems, siteConfig } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-brand" href="/">
        {siteConfig.name}
      </Link>

      <div className="site-header-right">
        <nav aria-label="Main navigation" className="site-nav">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <ThemeToggle />
        <WidthSettings />
      </div>
    </header>
  );
}
