"use client";

import { useState, useEffect } from "react";
import { Search, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useSearchHistory } from "./searchHistoryContext";

export function SearchCommand() {
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState("");
	const router = useRouter();
	const { searchHistory, addSearchTerm } = useSearchHistory();

	// Ctrl+K / Cmd+K shortcut
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);

	const navigate = (term: string) => {
		if (!term.trim()) return;
		addSearchTerm(term.trim());
		router.push(`/courses/${encodeURIComponent(term.trim())}`);
		setOpen(false);
		setValue("");
	};

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				onClick={() => setOpen(true)}
				aria-label="Search papers (⌘K)"
				className="shrink-0"
			>
				<Search className="h-4 w-4" />
			</Button>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput
					placeholder="Course code or name…"
					value={value}
					onValueChange={setValue}
					className="font-body"
				/>
				<CommandList>
					{/* Live search item */}
					{value.trim() ? (
						<CommandGroup>
							<CommandItem
								value={`__search__${value}`}
								onSelect={() => navigate(value)}
								className="font-body"
							>
								<Search className="h-3.5 w-3.5 mr-2 text-muted-foreground shrink-0" />
								Search &ldquo;{value}&rdquo;
							</CommandItem>
						</CommandGroup>
					) : (
						<CommandEmpty className="font-body text-sm py-6 text-muted-foreground">
							Type a course code or name.
						</CommandEmpty>
					)}

					{/* Recent searches */}
					{searchHistory.length > 0 && (
						<CommandGroup
							heading="Recent"
							className="[&_[cmdk-group-heading]]:font-body [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:tracking-[0.18em] [&_[cmdk-group-heading]]:uppercase"
						>
							{searchHistory.slice(0, 8).map((term) => (
								<CommandItem
									key={term}
									value={term}
									onSelect={() => navigate(term)}
									className="font-body"
								>
									<Clock className="h-3.5 w-3.5 mr-2 text-muted-foreground/50 shrink-0" />
									{term}
								</CommandItem>
							))}
						</CommandGroup>
					)}
				</CommandList>
			</CommandDialog>
		</>
	);
}
