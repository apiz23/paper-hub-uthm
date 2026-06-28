import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Toaster } from "sonner";
import LibraryToast from "@/components/libToast";
import { Analytics } from "@vercel/analytics/react";
import { SearchHistoryProvider } from "@/components/searchHistoryContext";

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	variable: "--font-display",
	weight: ["300", "400", "500", "600", "700", "800"],
});

const figtree = Figtree({
	subsets: ["latin"],
	variable: "--font-body",
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Paper Hub UTHM",
	description: "Past exam papers, fast.",
	icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${bricolage.variable} ${figtree.variable}`} suppressHydrationWarning>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<SearchHistoryProvider>
						<div className="bg-background min-h-dvh">
							<LibraryToast />
							<Toaster richColors position="bottom-right" />
							<div className="max-w-4xl mx-auto min-h-dvh">
								{children}
							</div>
						</div>
						<Analytics />
					</SearchHistoryProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
