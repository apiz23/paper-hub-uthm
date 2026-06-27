"use client";

import { Clock } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useSearchHistory } from "./searchHistoryContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function HistorySheet() {
	const { searchHistory, clearSearchHistory } = useSearchHistory();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative shrink-0"
					aria-label="Search history"
				>
					<Clock className="h-4 w-4" />
					{mounted && searchHistory.length > 0 && (
						<span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
					)}
				</Button>
			</SheetTrigger>

			<SheetContent side="left" className="w-[280px] p-0 flex flex-col">
				<SheetHeader className="px-5 pt-5 pb-3">
					<SheetTitle className="font-display text-sm font-700">
						Search history
					</SheetTitle>
				</SheetHeader>

				<Separator />

				<ScrollArea className="flex-1">
					{searchHistory.length > 0 ? (
						<ul className="py-2">
							{searchHistory.map((term, i) => (
								<li key={i}>
									<button
										onClick={() =>
											router.push(
												`/courses/${encodeURIComponent(term.trim())}`
											)
										}
										className="w-full flex items-baseline gap-3 px-5 py-2.5 hover:bg-muted/50 transition-colors text-left group"
									>
										<span className="font-display tabular-nums text-xs font-700 text-primary/50 w-4 text-right shrink-0 group-hover:text-primary transition-colors">
											{i + 1}
										</span>
										<span className="font-body text-sm text-foreground truncate">
											{term}
										</span>
									</button>
								</li>
							))}
						</ul>
					) : (
						<div className="px-5 py-6">
							<p className="font-body text-xs text-muted-foreground">
								No searches yet.
							</p>
						</div>
					)}
				</ScrollArea>

				<Separator />

				<div className="px-5 py-3">
					<Button
						variant="ghost"
						size="sm"
						onClick={clearSearchHistory}
						className="font-body text-xs text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start px-0 h-auto py-1"
					>
						Clear history
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}
