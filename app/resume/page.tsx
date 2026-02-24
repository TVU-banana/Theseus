import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";

const RESUME_PDF_URL = "/resume/resume.pdf";
const RESUME_PDF_FILE = path.join(process.cwd(), "public", "resume", "resume.pdf");

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume rendered from a local PDF file.",
};

export default async function ResumePage() {
  let hasResumePdf = true;

  try {
    await fs.access(RESUME_PDF_FILE);
  } catch {
    hasResumePdf = false;
  }

  return (
    <article className="resume-viewer stack-sm">
      <header className="stack-sm">
        <h1>Resume</h1>
      </header>

      {hasResumePdf ? (
        <iframe
          className="resume-frame"
          src={`${RESUME_PDF_URL}#view=FitH`}
          title="Resume PDF"
        />
      ) : (
        <p className="resume-missing">
          Missing resume PDF. Put your file at <code>public/resume/resume.pdf</code>.
        </p>
      )}

      <p className="resume-hint">
        If the embedded viewer is blocked by your browser, open{" "}
        <a href={RESUME_PDF_URL} target="_blank" rel="noreferrer">
          the PDF in a new tab
        </a>
        .
      </p>
    </article>
  );
}
