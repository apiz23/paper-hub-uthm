"use client";

import { Home, Info, Code2, Briefcase, ChevronUp, Settings2, CornerDownRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useSearchHistory } from "./searchHistoryContext";
import { useRouter } from "next/navigation";

const primaryLinks = [
	{ icon: <Home className="w-4 h-4" />, label: "Home", href: "/" },
	{ icon: <Info className="w-4 h-4" />, label: "About", href: "/about" },
];

const socialLinks = [
	{ icon: <Code2 className="w-4 h-4" />, label: "GitHub", href: "https://github.com/apiz23" },
	{ icon: <Briefcase className="w-4 h-4" />, label: "LinkedIn", href: "https://www.linkedin.com/in/muh-hafizuddin/" },
];

const sourceLinks = [
	{
		icon: (
			<Image
				src="https://upload.wikimedia.org/wikipedia/commons/9/95/UTHM_Logo.png?20221014163012"
				alt="UTHM"
				width={16}
				height={16}
				className="w-4 h-4 object-contain"
			/>
		),
		label: "Library UTHM",
		href: "https://library.uthm.edu.my/",
	},
];

export function AppSidebar() {
	const { searchHistory, clearSearchHistory } = useSearchHistory();
	const router = useRouter();

	return (
		<Sidebar>
			<SidebarHeader className="px-4 py-4 border-b border-sidebar-border">
				<Link href="/" className="block">
					<span className="font-display font-700 text-lg leading-none text-sidebar-foreground">
						Paper Hub{" "}
						<span className="text-sidebar-primary">UTHM</span>
					</span>
				</Link>
			</SidebarHeader>

			<SidebarContent>
				{/* Navigation */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{primaryLinks.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild>
										<Link href={item.href}>
											{item.icon}
											<span className="font-body">{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				{/* Search History */}
				<SidebarGroup>
					<SidebarGroupLabel className="font-body text-xs uppercase tracking-widest text-sidebar-foreground/50">
						Recent searches
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<div className="max-h-[45vh] overflow-y-auto space-y-0.5">
								{searchHistory.length > 0 ? (
									searchHistory.map((term, index) => (
										<SidebarMenuItem key={index}>
											<SidebarMenuButton
												asChild
												className="font-body text-sm"
											>
												<button
													onClick={() => {
														if (term.trim()) {
															router.push(`/courses/${encodeURIComponent(term.trim())}`);
														}
													}}
												>
													<CornerDownRight className="w-3.5 h-3.5 text-sidebar-primary shrink-0" />
													<span className="truncate">{term}</span>
												</button>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))
								) : (
									<SidebarMenuItem>
										<p className="font-body text-xs text-sidebar-foreground/40 px-2 py-1.5">
											No recent searches
										</p>
									</SidebarMenuItem>
								)}
							</div>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				{/* Social + Source */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{[...socialLinks, ...sourceLinks].map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild>
										<Link href={item.href} target="_blank" rel="noopener noreferrer">
											{item.icon}
											<span className="font-body">{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t border-sidebar-border">
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton className="font-body">
									<Settings2 className="w-4 h-4" />
									Settings
									<ChevronUp className="ml-auto w-4 h-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem
									onClick={clearSearchHistory}
									className="font-body text-sm text-destructive focus:text-destructive"
								>
									Clear history
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
