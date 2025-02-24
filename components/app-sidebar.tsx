"use client";

import {
	Home,
	Info,
	Github,
	Linkedin,
	ChevronUp,
	Settings2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
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
	{
		icon: <Home className="w-5 h-5" />,
		label: "Home",
		href: "/",
	},
	{
		icon: <Info className="w-5 h-5" />,
		label: "About",
		href: "/about",
	},
];

const ContactLink = [
	{
		icon: <Github className="w-5 h-5" />,
		label: "GitHub Repository",
		href: "https://github.com/apiz23",
	},
	{
		icon: <Linkedin className="w-5 h-5" />,
		label: "LinkedIn Profile",
		href: "https://www.linkedin.com/in/muh-hafizuddin/",
	},
];

const SourceLink = [
	{
		icon: (
			<Image
				src="https://upload.wikimedia.org/wikipedia/commons/9/95/UTHM_Logo.png?20221014163012"
				alt="UTHM Logo"
				width={300}
				height={300}
				className="w-5 h-5"
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
			<SidebarHeader>
				<h1 className="text-center">Paper Hub UTHM</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{primaryLinks.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild>
										<Link href={item.href}>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{ContactLink.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild>
										<Link href={item.href} target="_blank" rel="noopener noreferrer">
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{SourceLink.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton asChild>
										<Link href={item.href} target="_blank" rel="noopener noreferrer">
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<h3 className="text-sm font-medium">Search History:</h3>
							</SidebarMenuItem>
							<div className="max-h-[55vh] overflow-y-auto">
								{searchHistory.length > 0 ? (
									searchHistory.map((term, index) => (
										<SidebarMenuItem key={index}>
											<SidebarMenuButton asChild>
												<button
													onClick={() => {
														if (term.trim()) {
															router.push(`/courses/${encodeURIComponent(term.trim())}`);
														}
													}}
												>
													<span>
														{"> "}
														{term}
													</span>
												</button>
											</SidebarMenuButton>
										</SidebarMenuItem>
									))
								) : (
									<SidebarMenuItem>
										<p className="text-sm text-muted-foreground">
											No search history found.
										</p>
									</SidebarMenuItem>
								)}
							</div>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton>
									<Settings2 /> Settings
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem onClick={clearSearchHistory}>
									<span>Clear History</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
