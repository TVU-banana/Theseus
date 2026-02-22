import fs from "node:fs/promises";
import path from "node:path";
import { parse } from "yaml";
import type {
  ResumeBasics,
  ResumeData,
  ResumeEducationItem,
  ResumeExperienceItem,
} from "@/lib/types";

const RESUME_FILE = path.join(process.cwd(), "content", "resume", "resume.yml");

const defaultResume: ResumeData = {
  basics: {
    name: "Your Name",
    title: "Your Title",
    email: "you@example.com",
    location: "Your City",
    summary: "A short personal summary.",
  },
  experience: [],
  education: [],
  skills: [],
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item)).filter(Boolean);
}

function parseBasics(value: unknown): ResumeBasics {
  if (!value || typeof value !== "object") {
    return defaultResume.basics;
  }

  const basics = value as Record<string, unknown>;
  return {
    name: asString(basics.name, defaultResume.basics.name),
    title: asString(basics.title, defaultResume.basics.title),
    email: asString(basics.email, defaultResume.basics.email),
    location: asString(basics.location, defaultResume.basics.location),
    summary: asString(basics.summary, defaultResume.basics.summary),
  };
}

function parseExperience(value: unknown): ResumeExperienceItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      company: asString(row.company),
      role: asString(row.role),
      start: asString(row.start),
      end: asString(row.end),
      summary: asString(row.summary),
    };
  });
}

function parseEducation(value: unknown): ResumeEducationItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    return {
      school: asString(row.school),
      degree: asString(row.degree),
      start: asString(row.start),
      end: asString(row.end),
    };
  });
}

export async function getResumeData(): Promise<ResumeData> {
  try {
    const source = await fs.readFile(RESUME_FILE, "utf8");
    const parsed = (parse(source) ?? {}) as Record<string, unknown>;

    return {
      basics: parseBasics(parsed.basics),
      experience: parseExperience(parsed.experience),
      education: parseEducation(parsed.education),
      skills: asStringArray(parsed.skills),
    };
  } catch {
    return defaultResume;
  }
}
