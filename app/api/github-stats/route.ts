import { NextResponse } from "next/server";

export const revalidate = 3600; // revalidate every 1 hour

export async function GET() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch("https://api.github.com/users/gunawan1608", {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }),
      fetch(
        "https://api.github.com/users/gunawan1608/repos?per_page=100&type=public",
        {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 3600 },
        }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      return NextResponse.json({ error: "GitHub API error" }, { status: 502 });
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Count total stars across all public repos
    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (sum: number, r: { stargazers_count?: number }) =>
            sum + (r.stargazers_count ?? 0),
          0
        )
      : 0;

    return NextResponse.json({
      publicRepos: user.public_repos as number,
      followers: user.followers as number,
      following: user.following as number,
      totalStars,
      updatedAt: user.updated_at as string,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
