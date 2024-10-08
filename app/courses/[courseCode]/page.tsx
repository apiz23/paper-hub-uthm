"use client";

import { useState, useMemo, useCallback } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import { Download, LoaderIcon } from "lucide-react";
import { CourseCodeList, CourseData } from "@/lib/interface/interface";
import Link from "next/link";
import { useQuery } from "react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchCourseList, fetchCourseDetails } from "@/lib/api/courseApi";
import confetti from "canvas-confetti";
import { SearchBar } from "@/components/placeholder-vanish";

export default function CoursePage({
	params,
}: {
	params: { courseCode: string };
}) {
	const { courseCode } = params;
	const [courseData, setCourseData] = useState<CourseData | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 15;
	const [drawerOpen, setDrawerOpen] = useState(false);

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const { data: courseList, isLoading: loadingCourseList } = useQuery(
		["courseList", courseCode],
		() => fetchCourseList(apiUrl!, courseCode),
		{
			enabled: !!courseCode,
			staleTime: 300000,
			onSuccess: (data) => {
				data.sort((a: CourseCodeList, b: CourseCodeList) => {
					const dateA = new Date(a.date);
					const dateB = new Date(b.date);
					return dateB.getTime() - dateA.getTime();
				});
			},
		}
	);

	const handleFetchCourseDetails = useCallback(
		async (link: string) => {
			try {
				const data = await fetchCourseDetails(apiUrl!, link);
				setCourseData(data);
				setDrawerOpen(true);
			} catch (error: any) {
				console.error(error);
			}
		},
		[apiUrl]
	);

	const paginatedCourseList = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;
		return courseList?.slice(startIndex, endIndex);
	}, [courseList, currentPage, itemsPerPage]);

	const courseListCards = useMemo(() => {
		return paginatedCourseList?.map((course: CourseCodeList, index: number) => (
			<Card
				key={index}
				className="dark:bg-black bg-slate-200/70 dark:hover:bg-neutral-800 hover:bg-neutral-100 min-h-[18vh] flex flex-col justify-between"
			>
				<CardHeader>
					<CardTitle className="text-lg">{course.title}</CardTitle>
					<CardDescription className="shadow-none">
						{course.author} -{" "}
						{course.date && course.date !== "-" ? course.date : "Null"}
					</CardDescription>
				</CardHeader>
				<div className="flex-grow"></div>
				<CardContent className="flex justify-end">
					<Button
						variant="ghost"
						className="cursor-pointer border shadow-sm bg-white dark:bg-neutral-600 dark:hover:bg-neutral-500"
						onClick={() => handleFetchCourseDetails(course.link)}
					>
						View
					</Button>
				</CardContent>
			</Card>
		));
	}, [paginatedCourseList, handleFetchCourseDetails]);

	const triggerConfetti = () => {
		const end = Date.now() + 3 * 1000;
		const colors = ["#FF204E", "#836FFF", "#15F5BA", "#F0F3FF"];
		const frame = () => {
			if (Date.now() > end) return;

			confetti({
				particleCount: 2,
				angle: 60,
				spread: 55,
				startVelocity: 60,
				origin: { x: 0, y: 0.5 },
				colors: colors,
			});
			confetti({
				particleCount: 2,
				angle: 120,
				spread: 55,
				startVelocity: 60,
				origin: { x: 1, y: 0.5 },
				colors: colors,
			});

			requestAnimationFrame(frame);
		};

		frame();
	};

	const totalPages = useMemo(() => {
		return courseList ? Math.ceil(courseList.length / itemsPerPage) : 1;
	}, [courseList, itemsPerPage]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="h-[100vh] px-2.5 md:px-20 mx-auto pb-10 pt-5">
			<div className="flex flex-col md:flex-row justify-between px-4 md:px-6 mb-4 md:mb-6">
				<h1 className="order-2 md:order-1 text-2xl md:text-3xl font-thin my-4 ms-5">
					Results for &quot;
					<strong className="font-extrabold underline underline-offset-8">
						{decodeURIComponent(courseCode)}
					</strong>
					&quot;
				</h1>
				<div className="order-1 md:order-2 flex justify-center md:justify-end mt-4 md:mt-0">
					<SearchBar />
				</div>
			</div>
			{loadingCourseList ? (
				<div className="h-[70vh] flex justify-center items-center">
					<LoaderIcon className="animate-spin h-20 w-20" />
				</div>
			) : courseList?.length > 0 ? (
				<>
					<Pagination>
						<PaginationContent className="mb-5">
							<PaginationItem>
								<PaginationPrevious
									onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink className="bg-black text-white dark:bg-white dark:text-black">
									{currentPage}
								</PaginationLink>
							</PaginationItem>
							{currentPage < totalPages && (
								<>
									<PaginationItem>
										<PaginationNext
											onClick={() =>
												handlePageChange(Math.min(currentPage + 1, totalPages))
											}
										/>
									</PaginationItem>
								</>
							)}
						</PaginationContent>
					</Pagination>
					<ScrollArea className="h-[54vh] md:h-[70vh] p-4">
						<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
							{courseListCards}
						</div>
					</ScrollArea>
				</>
			) : (
				<div className="px-4 pt-20 md:pt-40 text-center gap-4">
					<h1 className="text-9xl font-black text-gray-700 dark:text-gray-200">
						404
					</h1>

					<p className="text-2xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
						Uh-oh!
					</p>
					<p className="my-4 text-gray-300">We can&apos;t find that course code</p>

					<Link href="/" className="rounded px-5 py-3 text-sm font-medium">
						<Button variant="destructive">Go Back Home</Button>
					</Link>
				</div>
			)}
			{courseData && (
				<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
					<DrawerContent className="md:max-w-3xl mx-2 md:mx-auto">
						<DrawerHeader>
							<DrawerTitle className="text-3xl mb-10">
								{typeof courseData?.details["Title"] === "string"
									? courseData?.details["Title"]
									: "-"}
							</DrawerTitle>
							<DrawerDescription>
								<div className="flow-root">
									<dl className="-my-3 text-left divide-y divide-gray-100 text-base text-black dark:text-white">
										{Object.keys(courseData.details).map((key) => {
											const detail = courseData.details[key];
											if (key === "" && detail === "") return null;
											return (
												<div
													key={key}
													className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
												>
													<dt className="font-medium">{key}:</dt>
													<dd className="sm:col-span-2">
														{typeof detail === "string" ? (
															detail
														) : detail?.data &&
														  (key === "Authors" ||
																key === "Appears in Collections" ||
																key === "URI") ? (
															<span>{detail.data}</span>
														) : (
															"-"
														)}
													</dd>
												</div>
											);
										})}
									</dl>
								</div>
							</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter className="grid grid-cols-2 gap-4">
							{courseData?.downloadLinks.map((link, index) => (
								<a key={index} href={link.fileUrl} download className="block w-full">
									<Button
										key={index}
										className="w-full bg-blue-800 text-white hover:bg-blue-900"
										onClick={() => {
											triggerConfetti();
										}}
									>
										<Download className="mr-2 h-4 w-4" /> Download
									</Button>
								</a>
							))}
							<DrawerClose asChild>
								<Button variant="destructive" className="w-full">
									Close
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			)}
		</div>
	);
}
