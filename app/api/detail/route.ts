import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const BASE_URL = "http://digitalcollection.uthm.edu.my";

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate",
  Connection: "keep-alive",
  Referer: BASE_URL,
};

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle");
  if (!handle)
    return NextResponse.json({ error: "Handle is required" }, { status: 400 });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(`${BASE_URL}/handle/${handle}`, {
      cache: "no-store",
      headers: BROWSER_HEADERS,
      signal: controller.signal,
    });
    clearTimeout(timer);

    const html = await response.text();
    const $ = cheerio.load(html);

    const wrapper = $("#wrapperDisplayItem");
    if (!wrapper.length)
      return NextResponse.json(
        { error: "Detail section not found" },
        { status: 404 }
      );

    const data: Record<string, any> = {};
    wrapper.find("table.itemDisplayTable tr").each((_, row) => {
      const label = $(row)
        .find("td.metadataFieldLabel")
        .text()
        .trim()
        .replace(":", "");
      const value = $(row).find("td.metadataFieldValue").text().trim();
      if (label && value) data[label] = value;
    });

    const files: {
      file: string | null;
      link: string | null;
      size: string;
      format: string;
    }[] = [];
    wrapper
      .find("div.panel.panel-default tr")
      .slice(1)
      .each((_, row) => {
        const cols = $(row).find("td");
        if (cols.length >= 4) {
          const fileTag = $(cols[0]).find("a");
          const fileLink = fileTag.attr("href");
          files.push({
            file: fileTag.text().trim() || null,
            link: fileLink ? `${BASE_URL}${fileLink}` : null,
            size: $(cols[2]).text().trim(),
            format: $(cols[3]).text().trim(),
          });
        }
      });

    data["files"] = files;
    return NextResponse.json({ handle, detail: data });
  } catch (err: any) {
    clearTimeout(timer);
    const isTimeout = err.name === "AbortError";
    return NextResponse.json(
      { error: isTimeout ? "UTHM library took too long to respond" : err.message },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
