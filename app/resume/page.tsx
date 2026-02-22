import type { Metadata } from "next";
import { getResumeData } from "@/lib/resume";

export const metadata: Metadata = {
  title: "Resume",
  description: "Resume rendered from local YAML content.",
};

export default async function ResumePage() {
  const resume = await getResumeData();

  return (
    <article className="stack">
      <header className="stack-sm">
        <h1>{resume.basics.name}</h1>
        <p>{resume.basics.title}</p>
        <p className="resume-meta">
          <span>{resume.basics.email}</span>
          <span>{resume.basics.location}</span>
        </p>
        <p>{resume.basics.summary}</p>
      </header>

      <section className="stack-sm">
        <h2>Experience</h2>
        <ul className="resume-list">
          {resume.experience.map((item) => (
            <li className="resume-item" key={`${item.company}-${item.role}-${item.start}`}>
              <div className="resume-row">
                <h3>{item.role}</h3>
                <p className="entry-meta">
                  {item.start} - {item.end}
                </p>
              </div>
              <p>{item.company}</p>
              <p className="muted">{item.summary}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack-sm">
        <h2>Education</h2>
        <ul className="resume-list">
          {resume.education.map((item) => (
            <li className="resume-item" key={`${item.school}-${item.degree}-${item.start}`}>
              <div className="resume-row">
                <h3>{item.degree}</h3>
                <p className="entry-meta">
                  {item.start} - {item.end}
                </p>
              </div>
              <p>{item.school}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack-sm">
        <h2>Skills</h2>
        <ul className="tag-list">
          {resume.skills.map((skill) => (
            <li className="tag" key={skill}>
              {skill}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
