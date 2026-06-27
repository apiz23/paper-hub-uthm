"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	Download,
	LoaderIcon,
	X,
	FileText,
} from "lucide-react";
import { CourseCodeList, CourseData } from "@/lib/interface/interface";
import Link from "next/link";
import { fetchCourseDetails, fetchCourseList } from "@/lib/api/courseApi";
import confetti from "canvas-confetti";
import { SearchBar } from "@/components/placeholder-vanish";
import { ModeToggle } from "@/components/theme-btn";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";

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
						(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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

	const triggerConfetti = () => {
		confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
	};

	const closePanel = () => setPanelOpen(false);

	// ── Loading state ──────────────────────────────────────────────────────────
	if (loading) {
		return (
			<div className="min-h-dvh flex flex-col">
				<PageHeader courseCode={courseCode} />
				<div className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
					<SkeletonTable />
				</div>
			</div>
		);
	}

	// ── Empty state ────────────────────────────────────────────────────────────
	if (courseList.length === 0) {
		return (
			<div className="min-h-dvh flex flex-col">
				<PageHeader courseCode={courseCode} />
				<div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center pb-24">
					<span className="font-display text-8xl font-700 text-muted-foreground/30">
						404
					</span>
					<p className="font-display text-xl font-600 text-foreground">
						No papers found
					</p>
					<p className="font-body text-sm text-muted-foreground max-w-sm">
						&ldquo;{decodeURIComponent(courseCode)}&rdquo; didn&apos;t match anything in the
						UTHM collection. Check the course code and try again.
					</p>
					<Link href="/">
						<Button variant="outline" size="sm" className="mt-2 font-body">
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to search
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	// ── Results ────────────────────────────────────────────────────────────────
	return (
		<div className="min-h-dvh flex flex-col">
			<PageHeader courseCode={courseCode} />

			<div className="flex-1 px-4 md:px-8 py-6 max-w-5xl mx-auto w-full">
				{/* Result count */}
				<p className="font-body text-xs text-muted-foreground mb-4 uppercase tracking-widest">
					{courseList.length} result{courseList.length !== 1 ? "s" : ""} for{" "}
					<span className="text-foreground font-600">
						{decodeURIComponent(courseCode)}
					</span>
				</p>

				{/* Table */}
				<div className="border border-border rounded-sm overflow-hidden">
					<table className="w-full font-body text-sm">
						<thead>
							<tr className="border-b border-border bg-muted/40">
								<th className="text-left px-4 py-3 font-500 text-muted-foreground text-xs uppercase tracking-wider">
									Title
								</th>
								<th className="text-left px-4 py-3 font-500 text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
									Author
								</th>
								<th className="text-left px-4 py-3 font-500 text-muted-foreground text-xs uppercase tracking-wider w-20">
									Year
								</th>
								<th className="px-4 py-3 w-24" />
							</tr>
						</thead>
						<tbody>
							{courseList.map((course, idx) => (
								<tr
									key={course.handle}
									className={`border-b border-border/60 last:border-0 transition-colors duration-100 hover:bg-muted/30 ${
										idx % 2 === 0 ? "" : "bg-muted/10"
									}`}
								>
									<td className="px-4 py-3.5 text-foreground font-400 leading-snug max-w-xs md:max-w-sm">
										<span className="line-clamp-2">{course.title}</span>
									</td>
									<td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell text-xs">
										{course.author || "—"}
									</td>
									<td className="px-4 py-3.5 text-muted-foreground text-xs tabular-nums">
										{course.date || "—"}
									</td>
									<td className="px-4 py-3.5 text-right">
										<button
											onClick={() => handleViewDetails(course.handle)}
											disabled={!!loadingHandle}
											className="inline-flex items-center gap-1.5 text-xs font-500 text-primary border border-primary/30 px-3 py-1.5 rounded-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
										>
											{loadingHandle === course.handle ? (
												<LoaderIcon className="h-3.5 w-3.5 animate-spin" />
											) : (
												<>
													<FileText className="h-3.5 w-3.5" />
													View
												</>
											)}
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Detail panel — slide in from right */}
			{/* Backdrop */}
			<div
				onClick={closePanel}
				className={`fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-200 ${
					panelOpen ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				aria-hidden="true"
			/>

			{/* Panel */}
			<aside
				className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-popover border-l border-border flex flex-col shadow-2xl transition-transform duration-250 ease-out ${
					panelOpen ? "translate-x-0" : "translate-x-full"
				}`}
				aria-label="Paper details"
			>
				{courseData && (
					<>
						{/* Panel header */}
						<div className="flex items-start justify-between gap-4 px-6 pt-6 pb-4 border-b border-border">
							<h2 className="font-display font-600 text-base leading-snug text-foreground flex-1">
								{typeof courseData.details["Title"] === "string"
									? courseData.details["Title"]
									: "Paper Details"}
							</h2>
							<button
								onClick={closePanel}
								className="shrink-0 mt-0.5 text-muted-foreground hover:text-foreground transition-colors"
								aria-label="Close panel"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						{/* Metadata */}
						<div className="flex-1 overflow-y-auto px-6 py-4">
							<dl className="space-y-0 font-body text-sm">
								{Object.keys(courseData.details)
									.filter((key) => key !== "" && courseData.details[key] !== "")
									.map((key) => {
										const detail = courseData.details[key];
										const value =
											typeof detail === "string"
												? detail
												: detail?.data
												? detail.data
												: null;
										if (!value) return null;
										return (
											<div
												key={key}
												className="grid grid-cols-5 gap-3 py-3 border-b border-border/50 last:border-0"
											>
												<dt className="col-span-2 text-xs text-muted-foreground uppercase tracking-wide font-500 pt-0.5">
													{key}
												</dt>
												<dd className="col-span-3 text-foreground text-sm leading-relaxed">
													{value}
												</dd>
											</div>
										);
									})}
							</dl>
						</div>

						{/* Download buttons */}
						{courseData.downloadLinks.length > 0 && (
							<div className="px-6 py-4 border-t border-border space-y-2">
								<p className="font-body text-xs text-muted-foreground uppercase tracking-widest mb-3">
									Downloads
								</p>
								{courseData.downloadLinks.map((link, idx) => (
									<a
										key={idx}
										href={link.fileUrl}
										target="_blank"
										rel="noopener noreferrer"
										onClick={triggerConfetti}
										className="flex items-center gap-3 w-full px-4 py-3 bg-primary text-primary-foreground rounded-sm hover:opacity-90 transition-opacity duration-150 font-body text-sm font-500"
									>
										<Download className="h-4 w-4 shrink-0" />
										<span className="truncate">
											{link.fileName || `Download ${idx + 1}`}
										</span>
									</a>
								))}
							</div>
						)}
					</>
				)}
			</aside>
		</div>
	);
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function PageHeader({ courseCode }: { courseCode: string }) {
	return (
		<header className="flex items-center gap-4 px-4 py-3 border-b border-border/60 bg-background sticky top-0 z-30">
			<SidebarTrigger className="-ml-1" />
			<Link
				href="/"
				className="text-muted-foreground hover:text-foreground transition-colors"
				aria-label="Back to home"
			>
				<ArrowLeft className="h-4 w-4" />
			</Link>
			<span className="font-display font-600 text-sm text-foreground hidden sm:block">
				{decodeURIComponent(courseCode)}
			</span>
			<div className="flex-1 max-w-xs ml-auto">
				<SearchBar />
			</div>
			<ModeToggle />
		</header>
	);
}

function SkeletonTable() {
	return (
		<div className="border border-border rounded-sm overflow-hidden animate-pulse">
			<div className="border-b border-border bg-muted/40 px-4 py-3 h-10" />
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="flex items-center gap-4 px-4 py-4 border-b border-border/60 last:border-0"
				>
					<div className="h-3 bg-muted rounded flex-1 max-w-xs" />
					<div className="h-3 bg-muted rounded w-24 hidden md:block" />
					<div className="h-3 bg-muted rounded w-10" />
					<div className="h-6 bg-muted rounded w-14 ml-auto" />
				</div>
			))}
		</div>
	);
}
