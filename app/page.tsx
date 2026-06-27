"use client";

import { SearchBar } from "@/components/placeholder-vanish";
import { ModeToggle } from "@/components/theme-btn";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";

const EXAMPLE_CODES = ["BIC10603", "BIE33003", "BIT10403", "BIC10303"];

export default function Home() {
	const router = useRouter();

	return (
		<div className="min-h-dvh flex flex-col">
			{/* Top bar */}
			<header className="flex items-center justify-between px-4 py-3 border-b border-border/60">
				<SidebarTrigger className="-ml-1" />
				<ModeToggle />
			</header>

			{/* Hero */}
			<main className="flex-1 flex flex-col items-center justify-center px-6 pb-24 pt-8">
				<div className="w-full max-w-xl space-y-12">
					{/* Brand */}
					<div className="text-center space-y-3">
						<h1 className="font-display font-700 tracking-tight leading-none">
							<span className="block text-6xl sm:text-7xl md:text-8xl text-foreground">
								Paper Hub
							</span>
							<span className="block text-6xl sm:text-7xl md:text-8xl text-primary">
								UTHM
							</span>
						</h1>
						<p className="text-muted-foreground text-xs tracking-[0.25em] uppercase font-body">
							past exam papers, fast
						</p>
					</div>

					{/* Search */}
					<div className="w-full">
						<SearchBar />
					</div>

					{/* Example codes */}
					<div className="flex flex-wrap gap-2 justify-center">
						{EXAMPLE_CODES.map((code) => (
							<button
								key={code}
								onClick={() => router.push(`/courses/${encodeURIComponent(code)}`)}
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
					Data sourced from{" "}
					<a
						href="http://digitalcollection.uthm.edu.my"
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline"
					>
						digitalcollection.uthm.edu.my
					</a>
					{" "}· for learning purposes only
				</p>
			</footer>
		</div>
	);
}
