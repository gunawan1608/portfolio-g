import { type NextRequest, NextResponse } from "next/server";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

type ContributionDay = {
  date: string;
  count: number;
  level: ContributionLevel;
};

type GitHubUser = {
  login: string;
  createdAt: string;
};

type ContributionSource = "github-graphql" | "github-profile";

type ProfileContributions = {
  days: ContributionDay[];
  years: number[];
};

const REVALIDATE_SECONDS = 3600;
const USER_AGENT = "portfolio-github-snake";
const GITHUB_API_VERSION = "2022-11-28";

export const revalidate = 3600;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function validUsername(username: string) {
  return /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(username);
}

function githubToken() {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? "";
}

function apiHeaders(withAuth = true): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
  const token = githubToken();
  if (withAuth && token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function utcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day));
}

function dateKey(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildYears(createdAt: string, currentYear: number) {
  const createdYear = new Date(createdAt).getUTCFullYear();
  const firstYear = Number.isFinite(createdYear) ? createdYear : currentYear;
  const years: number[] = [];

  for (let year = currentYear; year >= firstYear; year--) {
    years.push(year);
  }

  return years.length ? years : [currentYear];
}

function yearFromRequest(rawYear: string | null, currentYear: number) {
  const requested = Number(rawYear);
  if (Number.isInteger(requested) && requested >= 2008 && requested <= currentYear) {
    return requested;
  }
  return currentYear;
}

function normalizeYear(rawYear: string | null, years: number[]) {
  const requested = Number(rawYear);
  if (Number.isInteger(requested) && years.includes(requested)) {
    return requested;
  }
  return years[0]!;
}

function clampLevel(level: number): ContributionLevel {
  return Math.max(0, Math.min(4, level)) as ContributionLevel;
}

function numberFrom(value: string | null) {
  if (!value) return 0;
  const parsed = Number.parseInt(value.replace(/[^\d]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function textContributionCount(text: string) {
  const normalized = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  if (/^no contributions/i.test(normalized)) return 0;
  const match = normalized.match(/([\d,]+)\s+contribution/i);
  return numberFrom(match?.[1] ?? null);
}

function getAttr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
}

function levelFromColor(color: string | null, count: number): ContributionLevel {
  if (count <= 0) return 0;

  const normalized = color?.trim().toLowerCase() ?? "";
  const map: Record<string, ContributionLevel> = {
    "#ebedf0": 0,
    "#eeeeee": 0,
    "#161b22": 0,
    "#9be9a8": 1,
    "#d6e685": 1,
    "#0e4429": 1,
    "#40c463": 2,
    "#8cc665": 2,
    "#006d32": 2,
    "#30a14e": 3,
    "#44a340": 3,
    "#26a641": 3,
    "#216e39": 4,
    "#1e6823": 4,
    "#39d353": 4,
  };

  return map[normalized] ?? 1;
}

async function fetchGitHubUser(username: string): Promise<GitHubUser | null> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: apiHeaders(),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error("GitHub user lookup failed.");
  }

  const data = (await response.json()) as { login?: unknown; created_at?: unknown };
  if (typeof data.login !== "string" || typeof data.created_at !== "string") {
    throw new Error("GitHub user response was not usable.");
  }

  return {
    login: data.login,
    createdAt: data.created_at,
  };
}

function contributionRangeForYear(year: number) {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const end = year === currentYear ? now : utcDate(year, 11, 31);
  const from = utcDate(end.getUTCFullYear(), end.getUTCMonth(), 1);

  return {
    from: dateKey(from),
    to: dateKey(end),
  };
}

function parseProfileContributions(html: string, year: number): ContributionDay[] {
  const tags = html.match(/<(?:td|rect)\b[^>]*(?:data-date|data-count|data-level)[^>]*>/gi) ?? [];
  const tooltipCounts = new Map<string, number>();
  const days = new Map<string, ContributionDay>();

  for (const match of html.matchAll(/<tool-tip\b[^>]*\bfor=(["'])(.*?)\1[^>]*>([\s\S]*?)<\/tool-tip>/gi)) {
    tooltipCounts.set(match[2], textContributionCount(match[3]));
  }

  for (const tag of tags) {
    const date = getAttr(tag, "data-date");
    if (!date?.startsWith(`${year}-`)) continue;

    const id = getAttr(tag, "id");
    const attrCount = numberFrom(getAttr(tag, "data-count"));
    const count = attrCount || (id ? tooltipCounts.get(id) ?? 0 : 0);
    const levelAttr = getAttr(tag, "data-level");
    const level = levelAttr === null ? levelFromColor(getAttr(tag, "fill"), count) : clampLevel(numberFrom(levelAttr));

    days.set(date, { date, count, level });
  }

  return [...days.values()].sort((a, b) => a.date.localeCompare(b.date));
}

function parseProfileYears(html: string, currentYear: number) {
  const years = new Set<number>();

  for (const match of html.matchAll(/year-link-(\d{4})/g)) {
    years.add(Number(match[1]));
  }

  for (const match of html.matchAll(/contributions\?from=(\d{4})-/g)) {
    years.add(Number(match[1]));
  }

  return [...years]
    .filter((year) => Number.isInteger(year) && year >= 2008 && year <= currentYear)
    .sort((a, b) => b - a);
}

async function fetchProfileContributions(username: string, year: number): Promise<ProfileContributions> {
  const range = contributionRangeForYear(year);
  const url = new URL(`https://github.com/users/${username}/contributions`);
  url.searchParams.set("from", range.from);
  url.searchParams.set("to", range.to);

  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": USER_AGENT,
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error("GitHub contribution calendar failed to load.");
  }

  const html = await response.text();
  const days = parseProfileContributions(html, year);
  const years = parseProfileYears(html, new Date().getUTCFullYear());

  if (!days.length) {
    throw new Error("GitHub contribution calendar markup was not found.");
  }

  return { days, years };
}

async function fetchProfileYears(username: string) {
  const url = new URL(`https://github.com/${username}`);
  url.searchParams.set("action", "show");
  url.searchParams.set("controller", "profiles");
  url.searchParams.set("tab", "contributions");
  url.searchParams.set("user_id", username);

  const response = await fetch(url, {
    headers: {
      Accept: "text/html",
      "User-Agent": USER_AGENT,
      "X-Requested-With": "XMLHttpRequest",
    },
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) return [];

  const html = await response.text();
  return parseProfileYears(html, new Date().getUTCFullYear());
}

async function fetchGraphqlContributions(username: string, year: number) {
  const token = githubToken();
  if (!token) return null;

  const query = `
    query PortfolioContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": USER_AGENT,
      "X-GitHub-Api-Version": GITHUB_API_VERSION,
    },
    body: JSON.stringify({
      query,
      variables: {
        login: username,
        from: `${year}-01-01T00:00:00Z`,
        to: `${year}-12-31T23:59:59Z`,
      },
    }),
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new Error("GitHub GraphQL contribution lookup failed.");
  }

  const body = (await response.json()) as {
    errors?: unknown[];
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions?: number;
            weeks?: Array<{
              contributionDays?: Array<{
                date?: string;
                contributionCount?: number;
                color?: string;
              }>;
            }>;
          };
        };
      } | null;
    };
  };

  if (body.errors?.length) {
    throw new Error("GitHub GraphQL returned an error.");
  }

  const calendar = body.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar?.weeks) return null;

  const days: ContributionDay[] = [];
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays ?? []) {
      if (typeof day.date !== "string" || !day.date.startsWith(`${year}-`)) continue;

      const count = typeof day.contributionCount === "number" ? day.contributionCount : 0;
      days.push({
        date: day.date,
        count,
        level: levelFromColor(day.color ?? null, count),
      });
    }
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function summarize(days: ContributionDay[]) {
  return days.reduce(
    (summary, day) => ({
      totalContributions: summary.totalContributions + day.count,
      activeDays: summary.activeDays + (day.count > 0 ? 1 : 0),
    }),
    { totalContributions: 0, activeDays: 0 }
  );
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim() || "gunawan1608";

  if (!validUsername(username)) {
    return jsonError("Invalid GitHub username.", 400);
  }

  try {
    const currentYear = new Date().getUTCFullYear();
    const requestedYear = yearFromRequest(request.nextUrl.searchParams.get("year"), currentYear);
    let user: GitHubUser | null = null;
    let years: number[] = [];

    try {
      user = await fetchGitHubUser(username);
      if (!user) {
        return jsonError("GitHub user was not found.", 404);
      }
      years = buildYears(user.createdAt, currentYear);
    } catch {
      user = null;
    }

    if (!years.length) {
      years = await fetchProfileYears(username);
    }

    let year = years.length ? normalizeYear(String(requestedYear), years) : requestedYear;

    let source: ContributionSource = "github-profile";
    let days: ContributionDay[] | null = null;
    const login = user?.login ?? username;

    try {
      days = await fetchGraphqlContributions(login, year);
      if (days) source = "github-graphql";
    } catch {
      days = null;
    }

    if (!days) {
      let profile = await fetchProfileContributions(login, year);
      if (!years.length && profile.years.length) {
        years = profile.years;
      }

      if (years.length && !years.includes(year)) {
        year = normalizeYear(String(year), years);
        profile = await fetchProfileContributions(login, year);
      }

      days = profile.days;
      source = "github-profile";
    }

    if (!years.length) {
      years = [year];
    }

    const summary = summarize(days);

    return NextResponse.json({
      username: user?.login ?? username,
      year,
      years,
      createdAt: user?.createdAt ?? null,
      totalContributions: summary.totalContributions,
      activeDays: summary.activeDays,
      source,
      days,
    });
  } catch {
    return jsonError("Unable to load GitHub contribution data from GitHub.", 502);
  }
}
