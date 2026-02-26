import { MDXRemote } from "next-mdx-remote/rsc";
import React, { isValidElement } from "react";
import rehypePrettyCode from "rehype-pretty-code";
import Callout from "@/components/Callout";
import CodeCopyButton from "@/components/CodeCopyButton";

type MDXContentProps = {
  source: string;
  enhanceCodeBlocks?: boolean;
};

const components = {
  Callout,
};

type PreProps = React.ComponentPropsWithoutRef<"pre"> & {
  children?: React.ReactNode;
};

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map((item) => extractText(item)).join("");
  }

  if (isValidElement(node)) {
    const props = node.props as { children?: React.ReactNode };
    return extractText(props.children ?? "");
  }

  return "";
}

function normalizeLanguage(raw: string | null | undefined): string {
  if (!raw) {
    return "Text";
  }

  const clean = raw.trim();
  if (!clean) {
    return "Text";
  }

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function EnhancedPre({ children, ...props }: PreProps) {
  let language = "Text";
  let code = "";

  if (isValidElement(children)) {
    const childProps = children.props as {
      className?: string;
      "data-language"?: string;
      children?: React.ReactNode;
    };

    const classLanguage =
      typeof childProps.className === "string"
        ? childProps.className.match(/language-([a-z0-9_-]+)/i)?.[1]
        : null;

    language = normalizeLanguage(childProps["data-language"] ?? classLanguage);
    code = extractText(childProps.children ?? "");
  } else {
    code = extractText(children);
  }

  return (
    <div className="code-block">
      <CodeCopyButton code={code.replace(/\n$/, "")} language={language} />
      <pre {...props}>{children}</pre>
    </div>
  );
}

const mdxOptions = {
  rehypePlugins: [
    [
      rehypePrettyCode,
      {
        theme: {
          dark: "github-dark",
          light: "github-light",
        },
        keepBackground: false,
        defaultLang: "text",
      },
    ],
  ],
} as const;

export default function MDXContent({ source, enhanceCodeBlocks = true }: MDXContentProps) {
  if (!enhanceCodeBlocks) {
    return <MDXRemote source={source} components={components} />;
  }

  return (
    <MDXRemote
      source={source}
      components={{ ...components, pre: EnhancedPre }}
      options={{ mdxOptions: mdxOptions as never }}
    />
  );
}
