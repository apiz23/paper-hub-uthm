import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Circle = forwardRef<
	HTMLDivElement,
	{ className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
	return (
		<div
			ref={ref}
			className={cn(
				"z-10 flex h-12 md:h-20 w-12 md:w-20 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
				className
			)}
		>
			{children}
		</div>
	);
});

Circle.displayName = "Circle";

export default Circle;
