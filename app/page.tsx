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
		<div className="min-h-dvh flex flex-col">
			{/* Header */}
			<header className="flex items-center justify-between px-5 h-14 border-b border-border/60">
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

			{/* Hero */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 pb-28 pt-8">
				<div className="w-full max-w-xl space-y-12">
					{/* Brand */}
					<div className="space-y-2">
						<h1 className="font-display font-800 tracking-tight leading-[0.9]">
							<span className="block text-6xl sm:text-7xl md:text-8xl text-foreground">
								Paper Hub
							</span>
							<span className="block text-6xl sm:text-7xl md:text-8xl text-primary">
								UTHM
							</span>
						</h1>
						<p className="font-body text-xs text-muted-foreground tracking-[0.25em] uppercase ml-0.5">
							past exam papers, fast
						</p>
					</div>

					{/* Search */}
					<SearchBar />

					{/* Example codes */}
					<div className="flex flex-wrap gap-2">
						{EXAMPLE_CODES.map((code) => (
							<button
								key={code}
								onClick={() =>
									router.push(`/courses/${encodeURIComponent(code)}`)
								}
								className="font-body text-xs text-muted-foreground border border-border px-3 py-1.5 hover:border-primary hover:text-primary transition-colors duration-150 rounded-sm"
							>
								{code}
							</button>
						))}
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="flex items-center justify-center px-6 py-4 border-t border-border/60">
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
