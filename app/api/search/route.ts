import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const UTHM_BASE = "http://digitalcollection.uthm.edu.my";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");
  if (!query)
    return NextResponse.json({ error: "Query is required" }, { status: 400 });

  try {
    const response = await fetch(
      `${UTHM_BASE}/simple-search?query=${encodeURIComponent(query)}&location=global`,
      { cache: "no-store" }
    );
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

        // date is "[2022]" text node after the <a> inside <h4>
        const h4Text = heading.find("h4").text().trim();
        const dateMatch = h4Text.match(/\[(\d{4})\]/);
        const date = dateMatch ? dateMatch[1] : "";

        return { title, handle, author, date, link };
      })
      .get()
      .filter(Boolean);

    return NextResponse.json({ query, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
