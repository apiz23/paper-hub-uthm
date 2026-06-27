import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { Toaster } from "sonner";
import LibraryToast from "@/components/libToast";
import { Analytics } from "@vercel/analytics/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SearchHistoryProvider } from "@/components/searchHistoryContext";

const poppins = Poppins({ subsets: ["latin"], weight: ["500"] });

export const metadata: Metadata = {
	title: "UTHM Paper Hub",
	description: "UTHM Exam Paper Finder",
	icons: {
		icon: "/favicon.ico",
		href: "",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={poppins.className}>
				<SidebarProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						<SearchHistoryProvider>
							<AppSidebar />
							<div className="bg-black w-full min-h-screen overflow-x-hidden">
								<LibraryToast />
								<Toaster richColors position="bottom-right" />
								{/* <Navbar /> */}
								<SidebarTrigger className="m-2" />

								<div className="relative">
									<DotPattern
										width={15}
										height={15}
										cx={1}
										cy={1}
										cr={1}
										className={cn(
											"absolute inset-0 z-0 [mask-image:radial-gradient(200px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
										)}
									/>
									<div className="relative z-10">{children}</div>
								</div>
							</div>
							<Analytics />
						</SearchHistoryProvider>
					</ThemeProvider>
				</SidebarProvider>
			</body>
		</html>
	);
}
