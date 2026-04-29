import { NextResponse } from "next/server";

type GitHubUserResponse = {
  public_repos?: unknown;
  followers?: unknown;
  following?: unknown;
  updated_at?: unknown;
};

type GitHubRepoResponse = {
  stargazers_count?: unknown;
};

type GitHubStatsPayload = {
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  updatedAt: string | null;
  source: "github-api" | "cache" | "fallback";
};

const USERNAME = "gunawan1608";
const REVALIDATE_SECONDS = 3600;
const STALE_SECONDS = 86400;
const REQUEST_TIMEOUT_MS = 7000;
const USER_AGENT = "portfolio-github-stats";
const GITHUB_API_VERSION = "2022-11-28";

export const revalidate = 3600;

let cachedStats: GitHubStatsPayload | null = null;

function githubToken() {
  return process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? "";
}

function apiHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
  };
  const token = githubToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function asNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: apiHeaders(),
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function response(payload: GitHubStatsPayload) {
  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`,
    },
  });
}

export async function GET() {
  const user = await fetchJson<GitHubUserResponse>(
    `https://api.github.com/users/${USERNAME}`,
  );

  if (!user) {
    if (cachedStats) {
      return response({ ...cachedStats, source: "cache" });
    }

    return response({
      publicRepos: 0,
      followers: 0,
      following: 0,
      totalStars: 0,
      updatedAt: null,
      source: "fallback",
    });
  }

  const repos = await fetchJson<GitHubRepoResponse[]>(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&type=public`,
  );

  const totalStars = Array.isArray(repos)
    ? repos.reduce((sum, repo) => sum + asNumber(repo.stargazers_count), 0)
    : cachedStats?.totalStars ?? 0;

  const nextStats: GitHubStatsPayload = {
    publicRepos: asNumber(user.public_repos),
    followers: asNumber(user.followers),
    following: asNumber(user.following),
    totalStars,
    updatedAt: typeof user.updated_at === "string" ? user.updated_at : null,
    source: "github-api",
  };

  cachedStats = nextStats;

  return response(nextStats);
}
