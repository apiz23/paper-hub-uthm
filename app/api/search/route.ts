import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const UTHM_BASE = "http://digitalcollection.uthm.edu.my";
const PROXY = process.env.UTHM_PROXY_URL;

function buildFetchUrl(uthmUrl: string) {
  if (PROXY) return `${PROXY}?url=${encodeURIComponent(uthmUrl)}`;
  return uthmUrl;
}

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json({ error: "Query is required" }, { status: 400 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const uthmUrl = `${UTHM_BASE}/simple-search?query=${encodeURIComponent(query)}&location=global`;
    const response = await fetch(buildFetchUrl(uthmUrl), {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timer);

    const html = await response.text();
    const $ = cheerio.load(html);

    const results = $(".discovery-result-results .list-group-item")
      .map((_, item) => {
        const heading = $(item).find(".list-group-item-heading");
        if (!heading.length) return null;

        const titleTag = heading.find("h4 a");
        if (!titleTag.length) return null;

        const title = titleTag.text().trim();
        const handle = titleTag.attr("href")?.replace("/handle/", "") || "";
        const link = titleTag.attr("href") || "";
        const author = heading.find(".text-muted em").text().trim();

        const h4Text = heading.find("h4").text().trim();
        const dateMatch = h4Text.match(/\[(\d{4})\]/);
        const date = dateMatch ? dateMatch[1] : "";

        return { title, handle, author, date, link };
      })
      .get()
      .filter(Boolean);

    return NextResponse.json({ query, results });
  } catch (err: any) {
    clearTimeout(timer);
    const isTimeout = err.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "UTHM library took too long to respond" : err.message },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
