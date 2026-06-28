"use client";

import { SearchBar } from "@/components/placeholder-vanish";
import { ModeToggle } from "@/components/theme-btn";
import { HistorySheet } from "@/components/history-sheet";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const EXAMPLE_CODES = ["BIC10603", "BIE33003", "BIT10403", "BIC10303"];

export default function Home() {
	const router = useRouter();

	return (
		<div className="min-h-dvh flex flex-col relative overflow-hidden">
			{/* ── Background layers ── */}
			<div
				className="absolute inset-0 pointer-events-none select-none"
				aria-hidden="true"
			>
				{/* Dot grid */}
				<div
					className="absolute inset-0"
					style={{
						backgroundImage:
							"radial-gradient(circle, hsl(var(--muted-foreground) / 0.18) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				{/* Amber radial glow — sits behind the hero search area */}
				<div
					className="absolute inset-0"
					style={{
						background:
							"radial-gradient(ellipse 65% 55% at 50% 62%, hsl(var(--primary) / 0.11) 0%, transparent 72%)",
					}}
				/>
				{/* Edge vignettes so the grid doesn't clash with header/footer */}
				<div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background to-transparent" />
				<div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background to-transparent" />
			</div>

			{/* ── Header ── */}
			<header className="relative z-10 flex items-center justify-between px-6 h-14 border-b border-border/60 bg-background/70 backdrop-blur-md">
				<Link href="/" className="font-display font-700 text-sm text-foreground">
					Paper Hub <span className="text-primary">UTHM</span>
				</Link>
				<nav className="flex items-center gap-1">
					<Button variant="ghost" size="sm" asChild className="font-body text-sm">
						<Link href="/about">
							<Info className="h-3.5 w-3.5 mr-1.5" />
							About
						</Link>
					</Button>
					<HistorySheet />
					<ModeToggle />
				</nav>
			</header>

			{/* ── Hero ── */}
			<main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-28 pt-8">
				<div className="w-full max-w-2xl space-y-12">
					{/* Brand */}
					<div className="space-y-3">
						<h1 className="font-display font-800 tracking-tight leading-[0.88]">
							<span className="block text-6xl sm:text-7xl md:text-8xl text-foreground">
								Paper Hub
							</span>
							<span className="block text-6xl sm:text-7xl md:text-8xl text-primary">
								UTHM
							</span>
						</h1>
						<p className="font-body text-xs text-muted-foreground tracking-[0.28em] uppercase ml-0.5">
							past exam papers, fast
						</p>
					</div>

					{/* Search */}
					<SearchBar />

					{/* Example codes */}
					<div className="flex flex-wrap gap-2">
						<span className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-widest self-center mr-1">
							Try
						</span>
						{EXAMPLE_CODES.map((code) => (
							<button
								key={code}
								onClick={() => router.push(`/courses/${encodeURIComponent(code)}`)}
								className="font-body text-xs text-muted-foreground border border-border/80 px-3 py-1.5 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-150 rounded-sm"
							>
								{code}
							</button>
						))}
					</div>
				</div>
			</main>

			{/* ── Footer ── */}
			<footer className="relative z-10 flex items-center justify-center px-6 py-4 border-t border-border/60">
				<p className="font-body text-xs text-muted-foreground">
					Data from{" "}
					<a
						href="http://digitalcollection.uthm.edu.my"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline underline-offset-4"
					>
						digitalcollection.uthm.edu.my
					</a>{" "}
					· for learning only
				</p>
			</footer>
		</div>
	);
}
