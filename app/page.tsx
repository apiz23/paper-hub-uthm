"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BlurIn from "@/components/magicui/blur-in";
import TypingAnimation from "@/components/magicui/typing-animation";
import { PlaceholdersAndVanishInput } from "@/components/placeholder-vanish";

export default function Home() {
	const router = useRouter();
	const [courseCode, setCourseCode] = useState("");
	const placeholders = [
		"Computer Architecture",
		"BIC10303",
		"Fluid Mechanics I",
		"BIT10403",
		"BIC10103",
		"Object-Oriented Programming",
	];
	const handleSearch = (e: any) => {
		e.preventDefault();
		if (courseCode.trim()) {
			router.push(`/courses/${courseCode}`);
		}
	};

	return (
		<>
			<div className="min-h-screen">
				<div className="max-w-4xl mx-auto py-40">
					<TypingAnimation
						className="text-4xl lg:text-7xl text-black dark:text-white font-bold inter-var text-center uppercase"
						text="paper hub uthm"
					/>
					<BlurIn
						word="search your course subject exam paper here"
						className="text-base md:text-lg mt-4 text-black dark:text-white font-normal inter-var text-center capitalize"
					/>
				</div>
				<div className="max-w-xl mx-auto flex w-full items-center md:px-0 px-2">
					<PlaceholdersAndVanishInput
						placeholders={placeholders}
						onChange={(e) => setCourseCode(e.target.value)}
						onSubmit={handleSearch}
					/>
				</div>
			</div>
		</>
	);
}
