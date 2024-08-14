import React from "react";
import Image from "next/image";
import { ModeToggle } from "./theme-btn";
import Link from "next/link";
export default function Navbar() {
	return (
		<>
			<div className="fixed z-50 w-full flex justify-between px-7 pt-5">
				<Link href="/">
					<Image
						src="/logo.png"
						alt="Logo"
						width={500}
						height={500}
						className="w-12 h-12"
					/>
				</Link>

				<ModeToggle />
			</div>
		</>
	);
}
