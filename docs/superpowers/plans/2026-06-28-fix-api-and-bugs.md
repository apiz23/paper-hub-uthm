# Fix API Routes, Data Fetching & Bugs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken App Router API routes, point client at own API instead of localhost:8000, and fix all bugs identified in code review.

**Architecture:** Next.js 14 App Router. Client calls own `/api/search` and `/api/detail` routes (relative URLs). Those routes scrape `digitalcollection.uthm.edu.my` via `cheerio`. No external backend needed.

**Tech Stack:** Next.js 14 App Router, TypeScript, cheerio, Tailwind CSS, Radix UI

## Global Constraints

- Next.js 14 App Router route handlers: `export async function GET(request: NextRequest)` — NOT `export default handler`
- No new dependencies — fix using what's already installed
- Keep `framer-motion` imports (used in `placeholder-vanish.tsx`), remove `motion` package reference
- Native `fetch` only — remove `node-fetch` usage and `axios`
- All API routes return `NextResponse.json()`

---

### Task 1: Fix `/api/search` Route Handler + Add Date Scraping

**Files:**
- Modify: `app/api/search/route.ts`

**Interfaces:**
- Produces: `GET /api/search?query=BIC10603` → `{ query: string, results: { title, handle, author, date, link }[] }`

- [ ] **Step 1: Rewrite `app/api/search/route.ts` to App Router format**

```ts
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
```

- [ ] **Step 2: Verify route file saved correctly**

Run: `Get-Content "app/api/search/route.ts" | Select-Object -First 5`
Expected: first line is `import { NextRequest, NextResponse } from "next/server";`

---

### Task 2: Fix `/api/detail` Route Handler

**Files:**
- Modify: `app/api/detail/route.ts`

**Interfaces:**
- Produces: `GET /api/detail?handle=123456/7890` → `{ handle, detail: { [key]: string, files: { file, link, size, format }[] } }`

- [ ] **Step 1: Rewrite `app/api/detail/route.ts` to App Router format**

```ts
import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

const BASE_URL = "http://digitalcollection.uthm.edu.my";

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle");
  if (!handle)
    return NextResponse.json({ error: "Handle is required" }, { status: 400 });

  try {
    const response = await fetch(`${BASE_URL}/handle/${handle}`, {
      cache: "no-store",
    });
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify route file saved**

Run: `Get-Content "app/api/detail/route.ts" | Select-Object -First 5`
Expected: first line is `import { NextRequest, NextResponse } from "next/server";`

---

### Task 3: Fix `courseApi.ts` — Point at Own API Routes

**Files:**
- Modify: `lib/api/courseApi.ts`

**Interfaces:**
- Consumes: `/api/search?query=` from Task 1, `/api/detail?handle=` from Task 2
- Produces: `fetchCourseList(code)` → `CourseCodeList[]`, `fetchCourseDetails(handle)` → `CourseData`

- [ ] **Step 1: Rewrite `lib/api/courseApi.ts`**

```ts
import { toast } from "sonner";
import { CourseData, CourseDetails, DownloadLink } from "@/lib/interface/interface";

export const fetchCourseList = async (courseCode: string) => {
  try {
    const response = await fetch(
      `/api/search?query=${encodeURIComponent(courseCode)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.results;
  } catch (error: any) {
    toast.error(`Failed to fetch course list: ${error.message}`);
    throw error;
  }
};

export const fetchCourseDetails = async (handle: string): Promise<CourseData> => {
  try {
    const response = await fetch(
      `/api/detail?handle=${encodeURIComponent(handle)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    const { files: rawFiles, ...rest } = data.detail;
    const details: CourseDetails = { ...rest };
    const downloadLinks: DownloadLink[] = (rawFiles || []).map(
      (file: { file: string; link: string }) => ({
        fileName: file.file,
        fileUrl: file.link,
      })
    );

    return { details, downloadLinks };
  } catch (error: any) {
    toast.error(`Failed to fetch course details: ${error.message}`);
    throw error;
  }
};
```

- [ ] **Step 2: Verify no localhost:8000 reference remains**

Run: `Select-String -Path "lib/api/courseApi.ts" -Pattern "localhost"`
Expected: no output (zero matches)

---

### Task 4: Fix Search History Deduplication

**Files:**
- Modify: `components/searchHistoryContext.tsx`

- [ ] **Step 1: Add deduplication + cap history at 20 items**

In `addSearchTerm`, replace:
```ts
const addSearchTerm = (term: string) => {
    const updatedHistory = [term, ...searchHistory];
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
};
```
With:
```ts
const addSearchTerm = (term: string) => {
    const filtered = searchHistory.filter((t) => t !== term);
    const updatedHistory = [term, ...filtered].slice(0, 20);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
};
```

---

### Task 5: Fix `courses/[courseCode]/page.tsx` — isMobile, Key Prop, Loading State, Files Key Filter

**Files:**
- Modify: `app/courses/[courseCode]/page.tsx`

**Issues fixed in this task:**
1. `isMobile` initial state `true` → `false` (fixes hydration mismatch)
2. `key={index}` → `key={course.handle}` on table rows
3. View button shows per-row loading state
4. `renderDetailsContent` filters out `files` and empty keys

- [ ] **Step 1: Fix `isMobile` initial state**

Change line:
```ts
const [isMobile, setIsMobile] = useState(true);
```
To:
```ts
const [isMobile, setIsMobile] = useState(false);
```

- [ ] **Step 2: Add `loadingHandle` state and fix `handleViewDetails`**

Add after existing state declarations:
```ts
const [loadingHandle, setLoadingHandle] = useState<string | null>(null);
```

Replace `handleViewDetails`:
```ts
const handleViewDetails = async (handle: string) => {
    if (loadingHandle) return;
    setLoadingHandle(handle);
    try {
        const data = await fetchCourseDetails(handle);
        setCourseData(data);
        setModalOpen(true);
    } catch (error: any) {
        toast.error("Error fetching course details: " + error.message);
    } finally {
        setLoadingHandle(null);
    }
};
```

- [ ] **Step 3: Fix table row key and View button**

Replace `{courseList.map((course, index) => (` → `{courseList.map((course) => (`

Replace `<TableRow key={index}>` → `<TableRow key={course.handle}>`

Replace View button:
```tsx
<Button
    onClick={() => handleViewDetails(course.handle)}
    variant="outline"
    size="sm"
    disabled={!!loadingHandle}
>
    {loadingHandle === course.handle ? (
        <LoaderIcon className="animate-spin h-4 w-4" />
    ) : (
        "View"
    )}
</Button>
```

- [ ] **Step 4: Fix `renderDetailsContent` to skip `files` and empty keys**

Replace the `Object.keys(courseData!.details).map(...)` block filter:
```tsx
{Object.keys(courseData!.details)
    .filter((key) => key !== "" && courseData!.details[key] !== "")
    .map((key) => {
        const detail = courseData!.details[key];
        return (
            <div
                key={key}
                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
            >
                <dt className="font-medium">{key}:</dt>
                <dd className="sm:col-span-2">
                    {typeof detail === "string"
                        ? detail
                        : detail?.data &&
                          (key === "Authors" ||
                              key === "Appears in Collections" ||
                              key === "URI")
                        ? detail.data
                        : "-"}
                </dd>
            </div>
        );
    })}
```

---

### Task 6: Fix Layout Overflow

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/courses/[courseCode]/page.tsx`

- [ ] **Step 1: Fix layout overflow in `app/layout.tsx`**

Change:
```tsx
<div className="bg-black w-full h-screen overflow-hidden">
```
To:
```tsx
<div className="bg-black w-full min-h-screen overflow-x-hidden">
```

- [ ] **Step 2: Fix course page height in `app/courses/[courseCode]/page.tsx`**

Change:
```tsx
<div className="h-[100vh] px-2.5 md:px-20 mx-auto pb-10 pt-5">
```
To:
```tsx
<div className="min-h-screen px-2.5 md:px-20 mx-auto pb-10 pt-5">
```

---

### Task 7: Remove Duplicate Packages

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Remove `axios`, `node-fetch`, and `motion` from dependencies**

In `package.json`, remove these three lines from `"dependencies"`:
```json
"axios": "^1.10.0",
"motion": "^12.0.3",
"node-fetch": "^3.3.2",
```

- [ ] **Step 2: Remove @types/node-fetch if present, reinstall**

Run: `pnpm remove axios motion node-fetch`
Expected: packages removed, pnpm-lock.yaml updated

- [ ] **Step 3: Verify no remaining imports of removed packages**

Run: `Select-String -Path "**/*.ts","**/*.tsx" -Pattern "from 'axios'|from 'motion'|from 'node-fetch'" -Recurse`
Expected: no matches (cheerio imports in API routes already use named import `* as cheerio`)

---

### Task 8: Manual Verification

- [ ] **Step 1: Start dev server**

Run: `pnpm dev`

- [ ] **Step 2: Test search API directly**

Open: `http://localhost:3000/api/search?query=BIC10603`
Expected: JSON with `results` array containing objects with `title`, `handle`, `author`, `date`, `link`

- [ ] **Step 3: Test detail API**

Take a `handle` from Step 2 result, open: `http://localhost:3000/api/detail?handle=<handle>`
Expected: JSON with `detail` object and `files` array

- [ ] **Step 4: Test search flow in UI**

- Go to `http://localhost:3000`
- Search for `BIC10603`
- Expect redirect to `/courses/BIC10603` with results table
- Click View on a result — expect loading spinner then modal/drawer opens
- Verify no `files` key shown in modal detail list

- [ ] **Step 5: Test search history deduplication**

- Search same term twice
- Open sidebar
- Expect term appears once, not twice

---

## Data Fetching Architecture Summary

```
Browser
  └─▶ GET /api/search?query=BIC10603   (Next.js route handler)
        └─▶ fetch digitalcollection.uthm.edu.my/global-search?query=BIC10603
              └─▶ cheerio scrapes HTML → returns JSON

  └─▶ GET /api/detail?handle=123/456   (Next.js route handler)
        └─▶ fetch digitalcollection.uthm.edu.my/handle/123/456
              └─▶ cheerio scrapes HTML → returns JSON

lib/api/courseApi.ts
  fetchCourseList()  → calls /api/search  (relative URL, works in browser)
  fetchCourseDetails() → calls /api/detail (relative URL, works in browser)
```

No external backend (localhost:8000) needed. All scraping happens server-side in Next.js route handlers, which avoids CORS issues and keeps the UTHM library URL server-only.
