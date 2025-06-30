import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const pageUrl = searchParams.get("url");

    if (!pageUrl) {
        return NextResponse.json(
            { error: "URL parameter is required" },
            { status: 400 }
        );
    }

    try {
        const baseUrl = "http://digitalcollection.uthm.edu.my";
        const response = await axios.get(`${baseUrl}${pageUrl}`);
        const $ = cheerio.load(response.data);

        const downloadLinks: { fileName: string; fileUrl: string }[] = [];
        const seenUrls = new Set();

        $("a[href]").each((_, element) => {
            const link = $(element).attr("href");
            if (link && link.includes("bitstream")) {
                const fileName = $(element).text().trim();
                const fileUrl = `${baseUrl}${link}`;

                if (!seenUrls.has(fileUrl)) {
                    seenUrls.add(fileUrl);
                    downloadLinks.push({ fileName, fileUrl });
                }
            }
        });

        const details: Record<
            string,
            string | { data: string; URL: string | null }
        > = {};

        $("tbody tr").each((_, element) => {
            const label = $(element)
                .find("td.metadataFieldLabel")
                .text()
                .trim()
                .replace(/:\s*$/, "");

            let value: string | { data: string; URL: string | null } = $(
                element
            )
                .find("td.metadataFieldValue")
                .text()
                .trim();

            const linkElement = $(element).find("td.metadataFieldValue a");

            if (linkElement.length) {
                const link = linkElement.attr("href");
                const linkText = linkElement.text().trim();

                if (
                    label === "URI" ||
                    label === "Authors" ||
                    label === "Appears in Collections"
                ) {
                    value = {
                        data: linkText,
                        URL: link ? `${baseUrl}${link}` : null,
                    };
                }
            }
            if (label) {
                details[label] = value;
            }
        });

        return NextResponse.json({ downloadLinks, details });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500 }
        );
    }
}
