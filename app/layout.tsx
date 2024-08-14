import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import Navbar from "@/components/navbar";
import DotPattern from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "UTHM Paper Hub",
	description: "UTHM Exam Paper Finder",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Navbar />
					<div className="relative">
						<DotPattern
							width={15}
							height={15}
							cx={1}
							cy={1}
							cr={1}
							className={cn(
								"absolute inset-0 z-0 [mask-image:radial-gradient(200px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]"
							)}
						/>
						<div className="relative z-10">{children}</div>
					</div>
					<Footer />
				</ThemeProvider>
			</body>
		</html>
	);
}
