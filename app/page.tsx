"use client";

import BlurIn from "@/components/magicui/blur-in";
import { SearchBar } from "@/components/placeholder-vanish";
import { LineShadowText } from "@/components/ui/line-shadow-text";
import { useTheme } from "next-themes";

export default function Home() {
	const theme = useTheme();
	const shadowColor = theme.resolvedTheme === "dark" ? "white" : "black";

	return (
		<>
			<div className="min-h-screen">
				<div className="max-w-4xl mx-auto py-36 md:py-28">
					{/* <TypingAnimation
						className="text-4xl lg:text-7xl text-black dark:text-white font-bold inter-var text-center uppercase"
						text="paper hub uthm"
					/> */}
					<h1 className="text-balance text-4xl text-center font-semibold leading-none tracking-tighter sm:text-6xl md:text-6xl lg:text-7xl">
						Paper Hub
						<LineShadowText className="italic mx-2" shadowColor={shadowColor}>
							UTHM
						</LineShadowText>
					</h1>
					<BlurIn
						word="search your course subject exam paper here"
						className="text-xs md:text-lg mt-4 text-black dark:text-white font-normal inter-var text-center capitalize"
					/>
					<BlurIn
						word="Pshh for learning purpose only 🤓"
						className="text-xs md:text-base text-black dark:text-white font-normal inter-var text-center capitalize"
					/>
				</div>
				<div className="max-w-xl mx-auto flex w-4/5 md:w-full items-center md:px-0 px-2">
					<SearchBar />
				</div>
			</div>
		</>
	);
}
