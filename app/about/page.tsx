"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/theme-btn";
import { HistorySheet } from "@/components/history-sheet";

const STACK = [
	{ name: "Next.js 15", role: "App Router, API routes, server-side rendering" },
	{ name: "TypeScript", role: "Type-safe throughout" },
	{ name: "Tailwind CSS v4", role: "Utility-first styling" },
	{ name: "Cheerio", role: "HTML parsing of library responses" },
	{ name: "shadcn/ui", role: "Accessible component primitives" },
	{ name: "Vercel", role: "Hosting and edge deployment" },
];

const FLOW = [
	{ label: "You search", sub: "course code or name" },
	{ label: "API fetches", sub: "UTHM digital library" },
	{ label: "Papers returned", sub: "sorted by year" },
];

export default function About() {
	return (
		<div className="min-h-dvh flex flex-col relative overflow-hidden">
			{/* Background */}
			<div
				className="absolute inset-0 pointer-events-none select-none"
				aria-hidden="true"
			>
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle, hsl(var(--muted-foreground) / 0.14) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
			</div>

			{/* Header */}
			<header className="sticky top-0 z-30 flex items-center gap-2 px-4 h-14 border-b border-border/60 bg-background/80 backdrop-blur-md">
				<Button variant="ghost" size="icon" className="shrink-0 -ml-1" asChild>
					<Link href="/" aria-label="Home">
						<ArrowLeft className="h-4 w-4" />
					</Link>
				</Button>
				<span className="font-display font-700 text-sm text-foreground mr-auto tracking-tight">
					Paper Hub <span className="text-primary">UTHM</span>
				</span>
				<HistorySheet />
				<ModeToggle />
			</header>

			{/* Main content */}
			<main className="relative z-10 flex-1 w-full px-6 pt-16 pb-28">
				{/* Hero */}
				<div className="mb-20">
					<p className="font-body text-[10px] text-primary uppercase tracking-[0.28em] mb-5">
						About
					</p>
					<h1 className="font-display font-800 text-5xl sm:text-6xl leading-[0.92] tracking-tight text-foreground mb-8">
						Past papers,
						<br />
						<span className="text-primary">without the friction.</span>
					</h1>
					<p className="font-body text-base text-muted-foreground leading-relaxed max-w-[46ch]">
						Paper Hub UTHM is an unofficial, open-source tool built for students who
						need fast access to past exam papers — no login, no forms, no waiting.
					</p>
				</div>

				{/* Numbered sections */}
				<div className="space-y-0">
					{/* 01 — Why */}
					<section className="grid grid-cols-[2.5rem_1fr] gap-5 py-10 border-t border-border/40">
						<div className="pt-0.5">
							<span className="font-display tabular-nums text-3xl font-800 text-muted-foreground/15 leading-none select-none">
								01
							</span>
						</div>
						<div className="space-y-3">
							<h2 className="font-display font-700 text-base text-foreground">
								Why it exists
							</h2>
							<p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[52ch]">
								UTHM's library portal wasn't built for speed. Students needed to
								navigate multiple pages just to find a single paper. Paper Hub cuts that
								to a single search — type a course code or name and get results
								immediately.
							</p>
						</div>
					</section>

					{/* 02 — How */}
					<section className="grid grid-cols-[2.5rem_1fr] gap-5 py-10 border-t border-border/40">
						<div className="pt-0.5">
							<span className="font-display tabular-nums text-3xl font-800 text-muted-foreground/15 leading-none select-none">
								02
							</span>
						</div>
						<div className="space-y-4">
							<h2 className="font-display font-700 text-base text-foreground">
								How it works
							</h2>
							<p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[52ch]">
								No database, no stored copies. Every search hits a Next.js API route
								which queries the UTHM Digital Collection in real time, parses the HTML,
								and returns structured data. The library stays the source of truth.
							</p>

							{/* Flow diagram */}
							<div className="flex items-stretch gap-2 pt-2">
								{FLOW.map((step, i) => (
									<div key={step.label} className="flex items-center gap-2 flex-1">
										<div className="flex-1 py-3 px-3 bg-muted/25 rounded-sm border border-border/50">
											<p className="font-display font-600 text-xs text-foreground leading-snug">
												{step.label}
											</p>
											<p className="font-body text-[10px] text-muted-foreground mt-0.5 leading-snug">
												{step.sub}
											</p>
										</div>
										{i < FLOW.length - 1 && (
											<span className="font-body text-muted-foreground/30 text-sm shrink-0">
												→
											</span>
										)}
									</div>
								))}
							</div>
						</div>
					</section>

					{/* 03 — Stack */}
					<section className="grid grid-cols-[2.5rem_1fr] gap-5 py-10 border-t border-border/40">
						<div className="pt-0.5">
							<span className="font-display tabular-nums text-3xl font-800 text-muted-foreground/15 leading-none select-none">
								03
							</span>
						</div>
						<div className="space-y-4">
							<h2 className="font-display font-700 text-base text-foreground">
								The stack
							</h2>
							<p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[52ch]">
								Deliberately lean. No auth layer, no backend server, no external
								database — just a Next.js app on Vercel.
							</p>
							<div className="pt-1">
								{STACK.map((item) => (
									<div
										key={item.name}
										className="flex items-baseline gap-4 py-2.5 border-b border-border/30 last:border-0"
									>
										<span className="font-display font-600 text-sm text-foreground w-32 shrink-0">
											{item.name}
										</span>
										<span className="font-body text-xs text-muted-foreground">
											{item.role}
										</span>
									</div>
								))}
							</div>
						</div>
					</section>

					{/* 04 — Disclaimer */}
					<section className="grid grid-cols-[2.5rem_1fr] gap-5 py-10 border-t border-border/40">
						<div className="pt-0.5">
							<span className="font-display tabular-nums text-3xl font-800 text-muted-foreground/15 leading-none select-none">
								04
							</span>
						</div>
						<div className="space-y-3">
							<h2 className="font-display font-700 text-base text-foreground">
								Disclaimer
							</h2>
							<p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[52ch]">
								Paper Hub is a student project, independent of and not affiliated with
								UTHM. All content is sourced from{" "}
								<a
									href="http://digitalcollection.uthm.edu.my"
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
								>
									digitalcollection.uthm.edu.my
								</a>{" "}
								and intended for academic use only. If you have concerns about content,
								please reach out.
							</p>
						</div>
					</section>
				</div>

				{/* Back CTA */}
				<div className="pt-10 border-t border-border/40">
					<Button variant="outline" size="sm" asChild className="font-body">
						<Link href="/">
							<ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
							Back to search
						</Link>
					</Button>
				</div>
			</main>
		</div>
	);
}
