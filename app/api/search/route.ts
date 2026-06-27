import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const UTHM_BASE = "http://digitalcollection.uthm.edu.my";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json({ error: "Query is required" }, { status: 400 });

  try {
    const response = await fetch(
      `${UTHM_BASE}/global-search?query=${encodeURIComponent(query)}`,
      { cache: "no-store" }
    );
    const html = await response.text();
    const $ = cheerio.load(html);

    const results = $(".list-group-item")
      .map((_, item) => {
        const heading = $(item).find(".list-group-item-heading");
        if (!heading.length) return null;

        const titleTag = heading.find("a");
        const title = titleTag.text().trim();
        const handle = titleTag.attr("href")?.replace("/handle/", "") || "";
        const link = titleTag.attr("href") || "";
        const author = heading.find(".text-muted").text().trim();
        const date = $(item).find(".list-group-item-text").first().text().trim();

        return { title, handle, author, date, link };
      })
      .get()
      .filter(Boolean);

    return NextResponse.json({ query, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
