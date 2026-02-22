import type { Metadata } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const uiInitScript = `
(() => {
  try {
    const root = document.documentElement;
    const storedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = storedTheme === "light" || storedTheme === "dark"
      ? storedTheme
      : (prefersDark ? "dark" : "light");
    root.setAttribute("data-theme", theme);

    const storedWidth = window.localStorage.getItem("width-mode");
    const width = storedWidth === "narrow" || storedWidth === "standard" || storedWidth === "wide"
      ? storedWidth
      : "standard";
    root.setAttribute("data-width", width);
  } catch {
    document.documentElement.setAttribute("data-theme", "light");
    document.documentElement.setAttribute("data-width", "standard");
  }
})();
`;

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html data-theme="light" data-width="standard" lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: uiInitScript }} />
      </head>
      <body>
        <div className="app-shell">
          <SiteHeader />
          <main className="container">{children}</main>
        </div>
      </body>
    </html>
  );
}
