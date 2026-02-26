"use client";

import { useEffect, useRef, useState } from "react";

type CodeCopyButtonProps = {
  code: string;
  language: string;
};

export default function CodeCopyButton({ code, language }: CodeCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    const copyByExecCommand = () => {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
      const copiedByExec = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copiedByExec;
    };

    try {
      let success = false;
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        success = true;
      } else {
        success = copyByExecCommand();
      }

      if (!success) {
        throw new Error("copy failed");
      }

      setCopyFailed(false);
      setCopied(true);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
      setCopyFailed(true);
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => setCopyFailed(false), 1200);
    }
  }

  return (
    <button className="code-block-copy" onClick={handleCopy} type="button">
      {copied ? "copied" : copyFailed ? "failed" : language}
    </button>
  );
}
