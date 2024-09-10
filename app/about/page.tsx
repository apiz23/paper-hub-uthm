"use client";

import CodeBlock from "@/components/codeBlock";
import BlurIn from "@/components/magicui/blur-in";
import HyperText from "@/components/magicui/hyper-text";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RiNextjsFill } from "react-icons/ri";
import { SiNestjs, SiTypescript } from "react-icons/si";
import React, { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { Library, ServerIcon, User } from "lucide-react";

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

export default function About() {
	const containerRef = useRef<HTMLDivElement>(null);
	const div1Ref = useRef<HTMLDivElement>(null);
	const div2Ref = useRef<HTMLDivElement>(null);
	const div3Ref = useRef<HTMLDivElement>(null);

	const fetchListCode = `
		async listCoursesPaper(query: string): Promise<any[]> {
			const url = 'http://digitalcollection.uthm.edu.my/simple-search';
			const params = {
				location: 'publications',
				crisID: '',
				relationName: '',
				query,
				rpp: 200,
				sort_by: 'score',
				order: 'desc',
			};

			const response = await axios.get(url, { params });
			const $ = cheerio.load(response.data);
			const rows = $('table.table tbody tr');
			const papers = [];

			rows.each((index, element) => {
				if (index === 0) return;

				const no = $(element).find('td:nth-child(1)').text().trim();
				const date = $(element).find('td:nth-child(2)').text().trim();
				const title = $(element).find('td:nth-child(3) a').text().trim();
				const link = $(element).find('td:nth-child(3) a').attr('href');
				const author = $(element).find('td:nth-child(4)').text().trim();

				papers.push({
					no,
					title,
					link,
					author,
					date,
				});
			});
			return papers;
		}
	`;

	const fetchDetailsCode = `
		async courseLinkDetails(pageUrl: string): Promise<{
			downloadLinks: any[];
			details: Record<string, string | { data: string; URL: string | null }>;
		}> {
			const baseUrl = 'http://digitalcollection.uthm.edu.my';
			const response = await axios.get(\`\${baseUrl}\${pageUrl}\`);
			const $ = cheerio.load(response.data);

			const downloadLinks = [];
			const seenUrls = new Set<string>();

			$('a[href]').each((_, element) => {
				const link = $(element).attr('href');
				if (link && link.includes('bitstream')) {
					const fileName = $(element).text().trim();
					const fileUrl = \`\${baseUrl}\${link}\`;

					if (!seenUrls.has(fileUrl)) {
						seenUrls.add(fileUrl);
						downloadLinks.push({ fileName, fileUrl });
					}
				}
			});

			const details: Record<
				string,
				string | { data: string; URL: string | null }
			> = {};

			$('tbody tr').each((_, element) => {
				const label = $(element)
				.find('td.metadataFieldLabel')
				.text()
				.trim()
				.replace(/:\\s*$/, '');

				let value: string | { data: string; URL: string | null } = $(element)
				.find('td.metadataFieldValue')
				.text()
				.trim();

				const linkElement = $(element).find('td.metadataFieldValue a');

				if (linkElement.length) {
				const link = linkElement.attr('href');
				const linkText = linkElement.text().trim();

				if (
					label === 'URI' ||
					label === 'Authors' ||
					label === 'Appears in Collections'
				) {
					value = {
					data: linkText,
					URL: link ? \`\${baseUrl}\${link}\` : null,
					};
				}
				}

				details[label] = value;
			});

			return { downloadLinks, details };
		}
	`;
	return (
		<>
			<section className="min-h-screen p-4">
				<ScrollArea className="rounded-lg h-[90vh] w-full md:pb-20">
					<div className="max-w-4xl mx-auto pt-28 md:px-0 px-10 mb-20">
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
					<div className="max-w-4xl mx-auto mt-20">
						<div
							className="relative mx-auto max-w-2xl flex items-center justify-center md:p-0 p-10 md:shadow-xl"
							ref={containerRef}
						>
							<div className="flex h-full w-full flex-col items-stretch justify-between gap-10">
								<div className="flex flex-row justify-between">
									<Circle ref={div1Ref}>
										<User className="text-black size-7" />
									</Circle>
									<Circle ref={div2Ref}>
										<ServerIcon className="text-black size-7" />
									</Circle>
									<Circle ref={div3Ref}>
										<Library className="text-black size-7" />
									</Circle>
								</div>
							</div>

							<AnimatedBeam
								containerRef={containerRef}
								fromRef={div1Ref}
								toRef={div2Ref}
								startYOffset={10}
								endYOffset={10}
								curvature={-20}
							/>

							<AnimatedBeam
								containerRef={containerRef}
								fromRef={div2Ref}
								toRef={div3Ref}
								startYOffset={10}
								endYOffset={10}
								curvature={-20}
							/>

							<AnimatedBeam
								containerRef={containerRef}
								fromRef={div3Ref}
								toRef={div2Ref}
								startYOffset={-10}
								endYOffset={-10}
								curvature={20}
								reverse
							/>

							<AnimatedBeam
								containerRef={containerRef}
								fromRef={div2Ref}
								toRef={div1Ref}
								startYOffset={-10}
								endYOffset={-10}
								curvature={20}
								reverse
							/>
						</div>
					</div>
					<div className="max-w-4xl mx-auto md:p-10 px-10">
						<div className="flex justify-between max-w-2xl mx-auto pb-20 px-5">
							<p>User</p>
							<p>Backend</p>
							<p>Library</p>
						</div>
					</div>
					<BlurIn
						word="Nest.js code sample"
						className="text-3xl md:text-7xl capitalize text-center font-bold text-black dark:text-white"
					/>
					<div className="max-w-4xl mx-auto md:block hidden md:pb-20">
						<div className="max-w-4xl p-4 mx-auto mt-10">
							<h3 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
								How to Fetch the list of searched subject
							</h3>
							<ScrollArea className="rounded-lg h-[40vh]">
								<CodeBlock language="javascript" codeString={fetchListCode} />
							</ScrollArea>
						</div>
						<div className="max-w-4xl p-4 mx-auto mt-10">
							<h3 className="mb-4 scroll-m-20 text-2xl font-semibold tracking-tight">
								How to Fetch the details of the subject paper
							</h3>
							<ScrollArea className="rounded-lg h-[40vh]">
								<CodeBlock language="javascript" codeString={fetchDetailsCode} />
							</ScrollArea>
						</div>
					</div>
					<div className="lg:hidden flex justify-center md:pb-20">
						<p className="mt-6 border-l-2 rounded-r-md pl-6 bg-neutral-800 bg-opacity-70 p-2">
							Open in Desktop View
						</p>
					</div>
				</ScrollArea>
			</section>
		</>
	);
}
