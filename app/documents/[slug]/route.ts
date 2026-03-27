import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { achievements } from "@/lib/site-data";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const achievement = achievements.find((item) => item.documentSlug === slug);

  if (!achievement) {
    return new NextResponse("Document not found.", { status: 404 });
  }

  const filePath = path.join(
    process.cwd(),
    "assets",
    "documents",
    achievement.documentFileName,
  );

  try {
    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(
          achievement.documentFileName,
        )}`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Document file is missing.", { status: 404 });
  }
}
