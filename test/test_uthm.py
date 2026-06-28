import requests
import time

UTHM_BASE = "http://digitalcollection.uthm.edu.my"

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Connection": "keep-alive",
    "Referer": UTHM_BASE,
}

PLAIN_HEADERS = {}  # no headers — simulates what the old code was doing

def test(label, url, headers, timeout=15):
    print(f"\n{'='*60}")
    print(f"TEST: {label}")
    print(f"URL:  {url}")
    print(f"{'='*60}")
    try:
        start = time.time()
        r = requests.get(url, headers=headers, timeout=timeout)
        elapsed = time.time() - start
        print(f"STATUS:  {r.status_code}")
        print(f"TIME:    {elapsed:.2f}s")
        print(f"SIZE:    {len(r.content)} bytes")
        print(f"CONTENT-TYPE: {r.headers.get('Content-Type', 'unknown')}")
        snippet = r.text[:300].replace("\n", " ").strip()
        print(f"BODY:    {snippet}...")
    except requests.exceptions.Timeout:
        print(f"RESULT:  TIMEOUT after {timeout}s — server not responding")
    except requests.exceptions.ConnectionError as e:
        print(f"RESULT:  CONNECTION ERROR — {e}")
    except Exception as e:
        print(f"RESULT:  ERROR — {type(e).__name__}: {e}")

SEARCH_URL = f"{UTHM_BASE}/simple-search?query=BIC10603&location=global"
HANDLE_URL = f"{UTHM_BASE}/handle/123456789/9"  # sample handle

# 1. No headers (old behaviour)
test("No headers (bare fetch)", SEARCH_URL, PLAIN_HEADERS)

# 2. Browser headers
test("Browser headers", SEARCH_URL, BROWSER_HEADERS)

# 3. Browser headers on a detail page
test("Browser headers — detail page", HANDLE_URL, BROWSER_HEADERS)

# 4. Ping root
test("Root page reachable?", UTHM_BASE, BROWSER_HEADERS)