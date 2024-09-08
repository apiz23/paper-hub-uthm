import BlurIn from "@/components/magicui/blur-in";
import HyperText from "@/components/magicui/hyper-text";
import { Badge } from "@/components/ui/badge";
import { RiNextjsFill } from "react-icons/ri";
import { SiNestjs, SiTypescript } from "react-icons/si";

export default function About() {
	return (
		<>
			<section className="min-h-screen">
				<div className="max-w-4xl mx-auto pt-28 md:px-0 px-10">
					<HyperText
						className="text-3xl md:text-7xl font-bold text-black dark:text-white"
						text="The Architecture"
						duration={1000}
					/>
					<BlurIn
						word="What Tech Were Used?"
						className="text-3xl text-start mx-2 font-bold text-black dark:text-white"
					/>
					<div className="py-10 gap-4">
						<div className="mb-10">
							<p className="max-w-2xl text-start">
								Next.js specificly in TypeScript as the Frontend Framework & Nest.js as
								the Backend Framework
							</p>
						</div>
						<div className="flex justify-center md:justify-end md:me-10 gap-10">
							<Badge
								variant="outline"
								className="rounded-xl bg-neutral-600 bg-opacity-80 hover:bg-white p-4"
							>
								<RiNextjsFill className="h-10 md:h-20 w-10 md:w-20 text-neutral-900" />
							</Badge>
							<Badge
								variant="outline"
								className="rounded-xl bg-neutral-600 bg-opacity-80 hover:bg-white p-4"
							>
								<SiTypescript className="h-10 md:h-20 w-10 md:w-20 text-blue-500" />
							</Badge>
							<Badge
								variant="outline"
								className="rounded-xl bg-neutral-600 bg-opacity-80 hover:bg-white p-4"
							>
								<SiNestjs className="h-10 md:h-20 w-10 md:w-20 text-red-500" />
							</Badge>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
