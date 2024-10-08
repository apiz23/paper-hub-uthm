"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TypingAnimationProps {
	text: string;
	duration?: number;
	className?: string;
}

export default function TypingAnimation({
	text,
	duration = 200,
	className,
}: TypingAnimationProps) {
	const [displayedText, setDisplayedText] = useState<string>("");
	const [i, setI] = useState<number>(0);

	useEffect(() => {
		const typingEffect = setInterval(() => {
			setI((prevI) => {
				if (prevI < text.length) {
					setDisplayedText(text.substring(0, prevI + 1));
					return prevI + 1;
				} else {
					clearInterval(typingEffect);
					return prevI;
				}
			});
		}, duration);

		return () => {
			clearInterval(typingEffect);
		};
	}, [text, duration]);

	return (
		<h1
			className={cn(
				"font-display text-center text-4xl font-bold leading-[5rem] tracking-[-0.02em] drop-shadow-sm",
				className
			)}
		>
			{displayedText ? displayedText : text}
		</h1>
	);
}
