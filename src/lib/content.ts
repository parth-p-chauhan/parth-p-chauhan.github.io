import fs from "node:fs";
import path from "node:path";

import { marked } from "marked";

export interface SiteMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  locale: string;
  ogImage?: string;
}

export interface Brand {
  initials: string;
  ariaLabel: string;
}

export interface Hero {
  kicker: string;
  name: string;
  intro: string;
}

export interface SectionLabels {
  profile: string;
  networking: string;
  experience: string;
  stack: string;
}

export interface FactWithValue {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface FactWithLink {
  label: string;
  link: {
    label: string;
    href: string;
    download?: boolean;
  };
}

export type Fact = FactWithValue | FactWithLink;

export interface Profile {
  facts: Fact[];
}

export interface NetworkingLink {
  id: string;
  label: string;
  href: string;
  external?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  description: string;
}

export interface StackGroup {
  id: string;
  label: string;
  items: string[];
}

export interface SiteFooter {
  copyrightHolder: string;
  note: string;
}

export interface SiteContent {
  meta: SiteMeta;
  brand: Brand;
  hero: Hero;
  labels: SectionLabels;
  profile: Profile;
  networking: NetworkingLink[];
  experience: ExperienceItem[];
  stack: StackGroup[];
  footer: SiteFooter;
}

export interface LoadedContent {
  content: SiteContent;
  profileHtml: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content");
const SITE_FILE = path.join(CONTENT_DIR, "site.json");
const PROFILE_FILE = path.join(CONTENT_DIR, "profile.md");
const PUBLIC_DIR = path.join(process.cwd(), "public");

function fail(field: string, message: string): never {
  throw new Error(`content/site.json: ${field} ${message}`);
}

function expectRecord(value: unknown, field: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(field, "must be an object");
  }
  return value as Record<string, unknown>;
}

function expectArray(value: unknown, field: string): unknown[] {
  if (!Array.isArray(value)) fail(field, "must be an array");
  return value;
}

function expectString(value: unknown, field: string): string {
  if (typeof value !== "string") fail(field, "must be a string");
  return value;
}

function expectNonEmptyString(value: unknown, field: string): string {
  const result = expectString(value, field);
  if (result.trim() === "") fail(field, "must not be empty");
  return result;
}

function expectBoolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") fail(field, "must be a boolean");
  return value;
}

function expectUniqueIds(
  items: Record<string, unknown>[],
  field: string,
): void {
  const seen = new Set<string>();
  items.forEach((item, index) => {
    const id = expectNonEmptyString(item.id, `${field}[${index}].id`);
    if (seen.has(id)) fail(`${field}[${index}].id`, `duplicates "${id}"`);
    seen.add(id);
  });
}

function expectHref(value: unknown, field: string): string {
  const href = expectNonEmptyString(value, field);
  const allowed =
    href.startsWith("https://") ||
    href.startsWith("http://") ||
    href.startsWith("mailto:") ||
    (href.startsWith("/") && !href.startsWith("//"));
  if (!allowed) {
    fail(field, 'must start with "https://", "http://", "mailto:", or "/"');
  }
  return href;
}

function validateMeta(value: unknown): void {
  const meta = expectRecord(value, "meta");
  expectNonEmptyString(meta.title, "meta.title");
  expectNonEmptyString(meta.description, "meta.description");
  const canonicalUrl = expectNonEmptyString(
    meta.canonicalUrl,
    "meta.canonicalUrl",
  );
  if (!canonicalUrl.startsWith("https://")) {
    fail("meta.canonicalUrl", 'must start with "https://"');
  }
  expectNonEmptyString(meta.locale, "meta.locale");
  if (meta.ogImage !== undefined) {
    expectHref(meta.ogImage, "meta.ogImage");
  }
}

function validateBrand(value: unknown): void {
  const brand = expectRecord(value, "brand");
  expectNonEmptyString(brand.initials, "brand.initials");
  expectNonEmptyString(brand.ariaLabel, "brand.ariaLabel");
}

function validateHero(value: unknown): void {
  const hero = expectRecord(value, "hero");
  expectNonEmptyString(hero.kicker, "hero.kicker");
  expectNonEmptyString(hero.name, "hero.name");
  expectNonEmptyString(hero.intro, "hero.intro");
}

function validateLabels(value: unknown): void {
  const labels = expectRecord(value, "labels");
  expectNonEmptyString(labels.profile, "labels.profile");
  expectNonEmptyString(labels.networking, "labels.networking");
  expectNonEmptyString(labels.experience, "labels.experience");
  expectNonEmptyString(labels.stack, "labels.stack");
}

function validateFacts(value: unknown): void {
  const facts = expectArray(value, "profile.facts");
  if (facts.length === 0) fail("profile.facts", "must not be empty");

  facts.forEach((fact, index) => {
    const field = `profile.facts[${index}]`;
    const record = expectRecord(fact, field);
    expectNonEmptyString(record.label, `${field}.label`);

    const hasValue = "value" in record;
    const hasLink = "link" in record;
    if (hasValue === hasLink) {
      fail(field, 'must have exactly one of "value" or "link"');
    }

    if (hasValue) {
      expectString(record.value, `${field}.value`);
      if (record.highlight !== undefined) {
        expectBoolean(record.highlight, `${field}.highlight`);
      }
      return;
    }

    const link = expectRecord(record.link, `${field}.link`);
    expectNonEmptyString(link.label, `${field}.link.label`);
    expectHref(link.href, `${field}.link.href`);
    if (link.download !== undefined) {
      expectBoolean(link.download, `${field}.link.download`);
    }
  });
}

function validateNetworking(value: unknown): void {
  const links = expectArray(value, "networking");
  if (links.length === 0) fail("networking", "must not be empty");

  const records = links.map((link, index) => {
    const field = `networking[${index}]`;
    const record = expectRecord(link, field);
    expectNonEmptyString(record.label, `${field}.label`);
    expectHref(record.href, `${field}.href`);
    if (record.external !== undefined) {
      expectBoolean(record.external, `${field}.external`);
    }
    return record;
  });

  expectUniqueIds(records, "networking");
}

function validateExperience(value: unknown): void {
  const jobs = expectArray(value, "experience");
  if (jobs.length === 0) fail("experience", "must not be empty");

  const records = jobs.map((job, index) => {
    const field = `experience[${index}]`;
    const record = expectRecord(job, field);
    expectNonEmptyString(record.company, `${field}.company`);
    expectNonEmptyString(record.role, `${field}.role`);
    expectNonEmptyString(record.start, `${field}.start`);
    expectNonEmptyString(record.end, `${field}.end`);
    expectNonEmptyString(record.description, `${field}.description`);
    return record;
  });

  expectUniqueIds(records, "experience");
}

function validateStack(value: unknown): void {
  const groups = expectArray(value, "stack");
  if (groups.length === 0) fail("stack", "must not be empty");

  const records = groups.map((group, index) => {
    const field = `stack[${index}]`;
    const record = expectRecord(group, field);
    expectNonEmptyString(record.label, `${field}.label`);
    const items = expectArray(record.items, `${field}.items`);
    if (items.length === 0) fail(`${field}.items`, "must not be empty");
    items.forEach((item, itemIndex) => {
      expectNonEmptyString(item, `${field}.items[${itemIndex}]`);
    });
    return record;
  });

  expectUniqueIds(records, "stack");
}

function validateFooter(value: unknown): void {
  const footer = expectRecord(value, "footer");
  expectNonEmptyString(footer.copyrightHolder, "footer.copyrightHolder");
  expectNonEmptyString(footer.note, "footer.note");
}

export function assertSiteContent(
  value: unknown,
): asserts value is SiteContent {
  const root = expectRecord(value, "root");
  validateMeta(root.meta);
  validateBrand(root.brand);
  validateHero(root.hero);
  validateLabels(root.labels);

  const profile = expectRecord(root.profile, "profile");
  validateFacts(profile.facts);

  validateNetworking(root.networking);
  validateExperience(root.experience);
  validateStack(root.stack);
  validateFooter(root.footer);
}

function assertLocalAssets(content: SiteContent): void {
  const hrefs = content.profile.facts.flatMap((fact) =>
    "link" in fact ? [fact.link.href] : [],
  );

  for (const href of hrefs) {
    if (!href.startsWith("/")) continue;
    const assetPath = path.join(PUBLIC_DIR, href.slice(1));
    if (!fs.existsSync(assetPath)) {
      fail("profile.facts", `references missing asset public${href}`);
    }
  }

  if (content.meta.ogImage?.startsWith("/")) {
    const ogPath = path.join(PUBLIC_DIR, content.meta.ogImage.slice(1));
    if (!fs.existsSync(ogPath)) {
      fail(
        "meta.ogImage",
        `references missing asset public${content.meta.ogImage}`,
      );
    }
  }
}

export function loadContent(): LoadedContent {
  let parsed: unknown;
  try {
    parsed = JSON.parse(fs.readFileSync(SITE_FILE, "utf8"));
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`content/site.json: invalid JSON (${error.message})`, {
        cause: error,
      });
    }
    throw error;
  }

  assertSiteContent(parsed);
  assertLocalAssets(parsed);

  const markdown = fs.readFileSync(PROFILE_FILE, "utf8");
  if (markdown.trim() === "") {
    throw new Error("content/profile.md: bio must not be empty");
  }
  const profileHtml = marked.parse(markdown, { async: false });

  return { content: parsed, profileHtml };
}
