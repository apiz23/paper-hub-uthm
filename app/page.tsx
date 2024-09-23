"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import BlurIn from "@/components/magicui/blur-in";
import TypingAnimation from "@/components/magicui/typing-animation";
import { PlaceholdersAndVanishInput } from "@/components/placeholder-vanish";
import { toast } from "sonner";
import { X } from "lucide-react";

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
	const toastShownRef = useRef(false);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (courseCode.trim()) {
			router.push(`/courses/${encodeURIComponent(courseCode.trim())}`);
		}
	};

	useEffect(() => {
		if (!sessionStorage.getItem("toastShown") && !toastShownRef.current) {
			const timer = setTimeout(() => {
				const toastId = toast.info("Acknowledgement", {
					description: "Library Tunku Tun Aminah UTHM",
					duration: Infinity,
					action: {
						label: <X />,
						onClick: () => toast.dismiss(toastId),
					},
				});
				toastShownRef.current = true;
				sessionStorage.setItem("toastShown", "true");
			}, 1000);

			return () => clearTimeout(timer);
		}
	}, []);

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
					<PlaceholdersAndVanishInput
						placeholders={placeholders}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCourseCode(e.target.value)}
						onSubmit={handleSearch}
					/>
				</div>
			</div>
		</>
	);
}
