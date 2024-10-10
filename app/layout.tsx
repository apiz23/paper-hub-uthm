import type { Metadata } from "next";
import { Inter, Ubuntu, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import Navbar from "@/components/navbar";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";
import { Toaster } from "sonner";
import ReactQueryProvider from "@/lib/react-query-provider";
import LibraryToast from "@/components/libToast";
import { BackgroundLines } from "@/components/background-lines";

const inter = Inter({ subsets: ["latin"], weight: ["400"] });

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
		<html lang="en">
			<head>
				<link rel="icon" href="/icon.svg" />
				<link rel="manifest" href="/manifest.json" />
			</head>
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="bg-white dark:bg-black">
						<LibraryToast />
						<Toaster richColors position="bottom-right" />
						<Navbar />
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
							<div className="relative z-10">
								<ReactQueryProvider>{children}</ReactQueryProvider>
							</div>
						</div>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
