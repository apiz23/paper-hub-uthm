"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { menuSlide } from "@/lib/animation";
import Link from "next/link";
import { Github, Home, Info, Linkedin } from "lucide-react";

export default function Navbar() {
	const [isActive, setIsActive] = useState(false);

	const primaryLinks = [
		{
			icon: <Home className="w-5 h-5" />,
			label: "Home",
			href: "/",
		},
		{
			icon: <Info className="w-5 h-5" />,
			label: "About",
			href: "/about",
		},
	];

	const icons = [
		{
			icon: (
				<Image
					src="https://upload.wikimedia.org/wikipedia/commons/9/95/UTHM_Logo.png?20221014163012"
					alt="logo"
					width={300}
					height={300}
					className="w-5 h-5"
				/>
			),
			label: "Library UTHM",
			href: "https://library.uthm.edu.my/",
		},
		{
			icon: <Github className="w-5 h-5" />,
			label: "GitHub Apiz23",
			href: "https://github.com/apiz23",
		},
		{
			icon: <Linkedin className="w-5 h-5" />,
			label: "LinkedIn Me",
			href: "https://www.linkedin.com/in/muh-hafizuddin/",
		},
	];

	return (
		<>
			<div
				onClick={() => setIsActive(!isActive)}
				className="fixed right-0 m-5 z-50 w-14 md:w-20 h-14 md:h-20 rounded-full bg-neutral-700/60 flex items-center justify-center cursor-pointer"
			>
				<div className="relative w-full">
					<span
						className={`block w-2/5 h-0.5 bg-white mx-auto transition-transform duration-300 ${
							isActive ? "transform rotate-45 translate-y-0.5" : "-translate-y-1.5"
						}`}
					></span>
					<span
						className={`block w-2/5 h-0.5 bg-white mx-auto transition-transform duration-300 ${
							isActive ? "transform -rotate-45" : "translate-y-1.5"
						}`}
					></span>
				</div>
			</div>
			<AnimatePresence mode="wait">
				{isActive && <Nav linkNav={primaryLinks} socialIcons={icons} />}
			</AnimatePresence>
		</>
	);
}

const Nav = ({
	linkNav,
	socialIcons,
}: {
	linkNav: { icon: JSX.Element; label: string; href: string }[];
	socialIcons: { icon: JSX.Element; label: string; href: string }[];
}) => {
	const pathname = usePathname();
	const [selectedIndicator, setSelectedIndicator] = useState(pathname);

	return (
		<motion.div
			variants={menuSlide}
			initial="initial"
			animate="enter"
			exit="exit"
			className="fixed right-0 top-0 md:w-2/6 w-full h-full md:border-y md:border-l md:rounded-l-2xl md:border-white bg-gray-950 text-white z-30"
		>
			<div className="box-border h-full p-14 lg:p-24 flex flex-col justify-between">
				<div
					onMouseLeave={() => setSelectedIndicator(pathname)}
					className="flex flex-col gap-3 mt-20 text-5xl"
				>
					<div className="text-gray-400 uppercase text-base border-b border-gray-400 mb-10">
						Navigation
					</div>
					{linkNav.map((data, index) => (
						<Link
							key={index}
							href={data.href}
							className={`${
								selectedIndicator === data.href ? "font-bold" : "font-light"
							} text-white no-underline`}
							onMouseEnter={() => setSelectedIndicator(data.href)}
						>
							{data.label}
						</Link>
					))}
				</div>

				<div className="flex justify-between text-xs gap-10">
					{socialIcons.map((icon, index) => (
						<Link
							key={index}
							href={icon.href}
							className="no-underline text-white flex items-center gap-2"
						>
							{icon.icon}
							<span>{icon.label}</span>
						</Link>
					))}
				</div>
			</div>
		</motion.div>
	);
};

// return (
// 	<>
// 		<div className="fixed bottom-20 md:bottom-14 left-0 right-0 z-50">
// 			<div className="relative flex justify-center">
// 				<TooltipProvider>
// 					<Dock
// 						direction="middle"
// 						className="bg-neutral-300/50 dark:bg-neutral-900"
// 					>
// 						{primaryLinks.map((item, index) => (
// 							<DockIcon key={index}>
// 								<Tooltip>
// 									<TooltipTrigger asChild>
// 										<Link href={item.href}>{item.icon}</Link>
// 									</TooltipTrigger>
// 									<TooltipContent>
// 										<p>{item.label}</p>
// 									</TooltipContent>
// 								</Tooltip>
// 							</DockIcon>
// 						))}
// 						<Separator orientation="vertical" />
// 						{icons.map((item, index) => (
// 							<DockIcon key={index}>
// 								<Tooltip>
// 									<TooltipTrigger asChild>
// 										<Link href={item.href} target="_blank">
// 											{item.icon}
// 										</Link>
// 									</TooltipTrigger>
// 									<TooltipContent>
// 										<p>{item.label}</p>
// 									</TooltipContent>
// 								</Tooltip>
// 							</DockIcon>
// 						))}
// 						{/* <Separator orientation="vertical" />
// 						<DockIcon>
// 							<ModeToggle />
// 						</DockIcon> */}
// 					</Dock>
// 				</TooltipProvider>
// 			</div>
// 		</div>
// 	</>
// );
