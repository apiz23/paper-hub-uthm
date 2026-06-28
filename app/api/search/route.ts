import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const UTHM_BASE = "http://digitalcollection.uthm.edu.my";
const BACKEND = process.env.UTHM_PROXY_URL; // e.g. https://paper-hub-uthm.piz230601.workers.dev

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json({ error: "Query is required" }, { status: 400 });

  // If a backend is configured, forward the request there instead
  if (BACKEND) {
    const res = await fetch(
      `${BACKEND}/api/search?query=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  }

  // Local fallback (direct UTHM scrape)
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(
      `${UTHM_BASE}/simple-search?query=${encodeURIComponent(query)}&location=global`,
      {
        cache: "no-store",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          Referer: UTHM_BASE,
        },
        signal: controller.signal,
      }
    );
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
