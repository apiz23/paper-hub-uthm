"use client";

import BlurIn from "@/components/magicui/blur-in";
import TypingAnimation from "@/components/magicui/typing-animation";
import { SearchBar } from "@/components/placeholder-vanish";

export default function Home() {

	return (
		<>
			<div className="min-h-screen">
				<div className="max-w-4xl mx-auto py-36 md:py-28">
					<TypingAnimation
						className="text-4xl lg:text-7xl text-black dark:text-white font-bold inter-var text-center uppercase"
						text="paper hub uthm"
					/>
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
