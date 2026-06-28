const ALLOWED_HOST = "digitalcollection.uthm.edu.my";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url");

    if (!target) {
      return new Response("Missing ?url= param", { status: 400 });
    }

    let targetUrl;
    try {
      targetUrl = new URL(target);
    } catch {
      return new Response("Invalid URL", { status: 400 });
    }

    if (targetUrl.hostname !== ALLOWED_HOST) {
      return new Response("Forbidden host", { status: 403 });
    }

    const response = await fetch(targetUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        Referer: "http://digitalcollection.uthm.edu.my",
      },
    });

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};
