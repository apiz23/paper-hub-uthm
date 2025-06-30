import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
        return new NextResponse(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json(
            { error: "Query parameter is required" },
            { status: 400, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }

    try {
        const url = "http://digitalcollection.uthm.edu.my/simple-search";
        const params = {
            location: "publications",
            crisID: "",
            relationName: "",
            query,
            rpp: 200,
            sort_by: "score",
            order: "desc",
        };

        const response = await axios.get(url, { params });
        const $ = cheerio.load(response.data);
        const rows = $("table.table tbody tr");
        const papers: any[] = [];

        rows.each((index, element) => {
            if (index === 0) return;

            const no = $(element).find("td:nth-child(1)").text().trim();
            const date = $(element).find("td:nth-child(2)").text().trim();
            const title = $(element).find("td:nth-child(3) a").text().trim();
            const link = $(element).find("td:nth-child(3) a").attr("href");
            const author = $(element).find("td:nth-child(4)").text().trim();

            papers.push({
                no,
                title,
                link,
                author,
                date,
            });
        });

        return NextResponse.json(papers, { headers: { "Access-Control-Allow-Origin": "*" } });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch data" },
            { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
        );
    }
}

// Also export OPTIONS handler for Next.js API route
export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}
