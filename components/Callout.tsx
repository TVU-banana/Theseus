import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "success";

type CalloutProps = {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
};

export default function Callout({ type = "info", title, children }: CalloutProps) {
  return (
    <aside className={`callout callout-${type}`}>
      {title ? <p className="callout-title">{title}</p> : null}
      <div>{children}</div>
    </aside>
  );
}
