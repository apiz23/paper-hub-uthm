"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const LibraryToast = () => {
	const toastShownRef = useRef(false);

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

	return null;
};

export default LibraryToast;
