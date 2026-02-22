import { MDXRemote } from "next-mdx-remote/rsc";
import Callout from "@/components/Callout";

type MDXContentProps = {
  source: string;
};

const components = {
  Callout,
};

export default function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote source={source} components={components} />;
}
