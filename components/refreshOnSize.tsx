"use client";

import { useEffect, useRef } from "react";

const useRefreshOnResize = () => {
	const previousWidthRef = useRef(window.innerWidth);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const handleResize = () => {
		if (debounceTimeoutRef.current) {
			clearTimeout(debounceTimeoutRef.current);
		}

		debounceTimeoutRef.current = setTimeout(() => {
			if (Math.abs(window.innerWidth - previousWidthRef.current) > 50) {
				previousWidthRef.current = window.innerWidth;
				window.location.reload();
			}
		}, 300);
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);

		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
			window.removeEventListener("resize", handleResize);
		};
	}, []);
};

export default useRefreshOnResize;
