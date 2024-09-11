import React from "react";
import Image from "next/image";
import { ModeToggle } from "./theme-btn";
import Link from "next/link";
import { Dock, DockIcon } from "./magicui/dock";
import { Github, Home, Info, Linkedin } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "./ui/separator";

export default function Navbar() {
	const primaryLinks = [
		{
			icon: <Home className="w-5 h-5" />,
			label: "Home",
			href: "/",
		},
		{
			icon: <Info className="w-5 h-5" />,
			label: "About Us",
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
			<div className="fixed bottom-20 md:bottom-14 left-0 right-0 z-50">
				<div className="relative flex justify-center">
					<TooltipProvider>
						<Dock direction="middle">
							{primaryLinks.map((item, index) => (
								<DockIcon key={index}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link href={item.href}>{item.icon}</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>{item.label}</p>
										</TooltipContent>
									</Tooltip>
								</DockIcon>
							))}
							<Separator orientation="vertical" />
							{icons.map((item, index) => (
								<DockIcon key={index}>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link href={item.href} target="_blank">
												{item.icon}
											</Link>
										</TooltipTrigger>
										<TooltipContent>
											<p>{item.label}</p>
										</TooltipContent>
									</Tooltip>
								</DockIcon>
							))}
							<Separator orientation="vertical" />
							<DockIcon>
								<ModeToggle />
							</DockIcon>
						</Dock>
					</TooltipProvider>
				</div>
			</div>
		</>
	);
}
