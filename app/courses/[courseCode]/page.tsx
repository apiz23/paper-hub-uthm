"use client";

import { useState, useEffect, use } from "react";
import {
	ArrowLeft,
	ArrowRight,
	Download,
	LoaderIcon,
	X,
} from "lucide-react";
import { CourseCodeList, CourseData } from "@/lib/interface/interface";
import Link from "next/link";
import { fetchCourseDetails, fetchCourseList } from "@/lib/api/courseApi";
import confetti from "canvas-confetti";
import { SearchBar } from "@/components/placeholder-vanish";
import { ModeToggle } from "@/components/theme-btn";
import { HistorySheet } from "@/components/history-sheet";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

export default function CoursePage({
	params,
}: {
	params: Promise<{ courseCode: string }>;
}) {
	const { courseCode } = use(params);
	const [courseData, setCourseData] = useState<CourseData | null>(null);
	const [courseList, setCourseList] = useState<CourseCodeList[]>([]);
	const [panelOpen, setPanelOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingHandle, setLoadingHandle] = useState<string | null>(null);

	useEffect(() => {
		const fetchCourses = async () => {
			setLoading(true);
			try {
				const data = await fetchCourseList(courseCode);
				if (Array.isArray(data)) {
					const sorted = data.sort(
						(a, b) =>
							new Date(b.date).getTime() - new Date(a.date).getTime()
					);
					setCourseList(sorted);
				} else {
					toast.error("Unexpected data format");
				}
			} catch (error: any) {
				toast.error("Failed to fetch: " + error.message);
			} finally {
				setLoading(false);
			}
		};
		fetchCourses();
	}, [courseCode]);

	const handleViewDetails = async (handle: string) => {
		if (loadingHandle) return;
		setLoadingHandle(handle);
		try {
			const data = await fetchCourseDetails(handle);
			setCourseData(data);
			setPanelOpen(true);
		} catch (error: any) {
			toast.error("Failed to load details: " + error.message);
		} finally {
			setLoadingHandle(null);
		}
	};

	const triggerConfetti = () =>
		confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });

	// ── Loading ────────────────────────────────────────────────────────────────
	if (loading) {
		return (
			<div className="min-h-dvh flex flex-col relative">
				<div
					className="fixed inset-0 pointer-events-none select-none opacity-50"
					aria-hidden="true"
					style={{
						backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground) / 0.10) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<PageHeader courseCode={courseCode} />
				<div className="flex-1 max-w-3xl mx-auto w-full px-5 py-8">
					<Skeleton className="h-3 w-36 mb-8" />
					{Array.from({ length: 7 }).map((_, i) => (
						<div key={i} className="flex items-start gap-5 py-5 border-b border-border/60">
							<Skeleton className="h-6 w-10 shrink-0 mt-0.5" />
							<div className="flex-1 space-y-2.5">
								<Skeleton className="h-3.5 w-full" />
								<Skeleton className="h-3.5 w-4/5" />
								<Skeleton className="h-2.5 w-1/3" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	// ── Empty ──────────────────────────────────────────────────────────────────
	if (courseList.length === 0) {
		return (
			<div className="min-h-dvh flex flex-col relative">
				<div
					className="fixed inset-0 pointer-events-none select-none opacity-50"
					aria-hidden="true"
					style={{
						backgroundImage: "radial-gradient(circle, hsl(var(--muted-foreground) / 0.10) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<PageHeader courseCode={courseCode} />
				<div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center pb-32">
					<span className="font-display text-[8rem] font-800 leading-none text-muted-foreground/10 select-none">
						0
					</span>
					<p className="font-display text-lg font-700 text-foreground">
						No papers found
					</p>
					<p className="font-body text-sm text-muted-foreground max-w-xs leading-relaxed">
						&ldquo;{decodeURIComponent(courseCode)}&rdquo; returned no results.
						Try a different code.
					</p>
					<Button variant="outline" size="sm" asChild className="mt-3 font-body">
						<Link href="/">
							<ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
							Back to search
						</Link>
					</Button>
				</div>
			</div>
		);
	}

	// ── Results ────────────────────────────────────────────────────────────────
	return (
		<div className="min-h-dvh flex flex-col relative">
			{/* Subtle grid texture */}
			<div
				className="fixed inset-0 pointer-events-none select-none opacity-50"
				aria-hidden="true"
				style={{
					backgroundImage:
						"radial-gradient(circle, hsl(var(--muted-foreground) / 0.10) 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
			/>
			<PageHeader courseCode={courseCode} />

			<div className="flex-1 max-w-3xl mx-auto w-full px-5 py-8">
				{/* Count */}
				<p className="font-body text-xs text-muted-foreground mb-6 uppercase tracking-[0.18em]">
					{courseList.length} paper{courseList.length !== 1 ? "s" : ""} ·{" "}
					<span className="text-primary font-600">
						{decodeURIComponent(courseCode)}
					</span>
				</p>

				{/* List */}
				<ul>
					{courseList.map((course) => (
						<li key={course.handle} className="border-b border-border/60 last:border-0">
							<button
								onClick={() => handleViewDetails(course.handle)}
								disabled={!!loadingHandle}
								className="w-full text-left flex items-start gap-5 py-5 group transition-colors duration-100 hover:bg-muted/20 -mx-2 px-2 rounded-sm disabled:pointer-events-none"
							>
								{/* Year badge */}
								<div className="w-12 shrink-0 flex justify-end pt-0.5">
									{course.date ? (
										<Badge
											variant="secondary"
											className="font-display tabular-nums text-xs font-700 px-1.5 py-0.5 text-primary bg-primary/10 border-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-100"
										>
											{course.date}
										</Badge>
									) : (
										<span className="font-body text-xs text-muted-foreground/40">
											—
										</span>
									)}
								</div>

								{/* Content */}
								<div className="flex-1 min-w-0">
									<p className="font-display font-600 text-sm leading-snug text-foreground group-hover:text-primary transition-colors duration-100 line-clamp-3">
										{course.title}
									</p>
									{course.author && (
										<p className="font-body text-xs text-muted-foreground mt-1.5 truncate">
											{course.author}
										</p>
									)}
								</div>

								{/* Arrow / spinner */}
								<div className="shrink-0 pt-0.5">
									{loadingHandle === course.handle ? (
										<LoaderIcon className="h-4 w-4 animate-spin text-primary" />
									) : (
										<ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-100" />
									)}
								</div>
							</button>
						</li>
					))}
				</ul>
			</div>

			{/* Detail panel — shadcn Sheet */}
			<Sheet open={panelOpen} onOpenChange={setPanelOpen}>
				<SheetContent
					side="right"
					className="w-full sm:w-[460px] p-0 flex flex-col gap-0"
				>
					{courseData && (
						<>
							<SheetHeader className="px-6 pt-6 pb-5 border-b border-border text-left">
								{/* Year + close row */}
								<div className="flex items-center justify-between mb-3">
									{typeof courseData.details["Date"] === "string" &&
										courseData.details["Date"] && (
											<Badge
												variant="secondary"
												className="font-display tabular-nums text-xs font-700 text-primary bg-primary/10 border-0"
											>
												{courseData.details["Date"]}
											</Badge>
										)}
								</div>

								<SheetTitle className="font-display font-700 text-base leading-snug text-foreground text-left">
									{typeof courseData.details["Title"] === "string"
										? courseData.details["Title"]
										: "Paper Details"}
								</SheetTitle>

								{typeof courseData.details["Author"] === "string" &&
									courseData.details["Author"] && (
										<p className="font-body text-xs text-muted-foreground mt-1.5">
											{courseData.details["Author"]}
										</p>
									)}
							</SheetHeader>

							{/* Metadata */}
							<ScrollArea className="flex-1">
								<div className="px-6 py-4">
									{Object.keys(courseData.details)
										.filter((key) => {
											if (!key || !courseData.details[key]) return false;
											if (["Title", "Author", "Date"].includes(key)) return false;
											return true;
										})
										.map((key) => {
											const detail = courseData.details[key];
											const value =
												typeof detail === "string"
													? detail
													: detail?.data ?? null;
											if (!value) return null;
											return (
												<div key={key} className="py-3.5 border-b border-border/50 last:border-0">
													<p className="font-body text-[10px] font-600 text-muted-foreground uppercase tracking-[0.15em] mb-1">
														{key}
													</p>
													<p className="font-body text-sm text-foreground leading-relaxed">
														{value}
													</p>
												</div>
											);
										})}
								</div>
							</ScrollArea>

							{/* Downloads */}
							{courseData.downloadLinks.length > 0 && (
								<>
									<Separator />
									<div className="px-6 py-5 space-y-2.5">
										<p className="font-body text-[10px] font-600 text-muted-foreground uppercase tracking-[0.15em] mb-3">
											Files
										</p>
										{courseData.downloadLinks.map((link, idx) => (
											<Button
												key={idx}
												asChild
												className="w-full font-body font-600 justify-start gap-3"
											>
												<a
													href={link.fileUrl}
													target="_blank"
													rel="noopener noreferrer"
													onClick={triggerConfetti}
												>
													<Download className="h-4 w-4 shrink-0" />
													<span className="truncate">
														{link.fileName || `File ${idx + 1}`}
													</span>
												</a>
											</Button>
										))}
									</div>
								</>
							)}
						</>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
}

// ── Header ─────────────────────────────────────────────────────────────────────

function PageHeader({ courseCode }: { courseCode: string }) {
	return (
		<header className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-border/60 bg-background/80 backdrop-blur-md">
			<Button variant="ghost" size="icon" className="shrink-0 -ml-1" asChild>
				<Link href="/" aria-label="Home">
					<ArrowLeft className="h-4 w-4" />
				</Link>
			</Button>

			<div className="flex items-center gap-2 mr-auto">
				<span className="font-display font-700 text-sm text-foreground tracking-tight">
					<span className="text-muted-foreground hidden sm:inline">Paper Hub · </span>
					{decodeURIComponent(courseCode)}
				</span>
			</div>

			<div className="max-w-[200px] sm:max-w-xs w-full">
				<SearchBar />
			</div>

			<HistorySheet />
			<ModeToggle />
		</header>
	);
}
