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
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationEllipsis,
	PaginationPrevious,
	PaginationNext,
} from "@/components/ui/pagination";
import { Download, LoaderIcon } from "lucide-react";
import { CourseCodeList, CourseData } from "@/lib/interface/interface";
import Link from "next/link";
import { toast } from "sonner";
import { useQuery } from "react-query";
import useRefreshOnResize from "@/components/refreshOnSize";

export default function CoursePage({
	params,
}: {
	params: { courseCode: string };
}) {
	useRefreshOnResize();
	const { courseCode } = params;
	const [courseData, setCourseData] = useState<CourseData | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	const itemsPerPage = useMemo(() => {
		if (typeof window !== "undefined") {
			const width = window.innerWidth;
			return width < 640 ? 3 : 15;
		}
		return 15;
	}, [window.innerWidth]);

	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	const { data: courseList, isLoading: loadingCourseList } = useQuery(
		["courseList", courseCode],
		async () => {
			const response = await fetch(
				`${apiUrl}uthm-lib/list-courses-paper?query=${courseCode}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			return response.json();
		},
		{
			enabled: !!courseCode,
			onError: (error: any) => {
				toast.error("Failed to fetch course list:", error);
			},
			staleTime: 300000,
		}
	);

	const fetchCourseDetails = useCallback(
		async (link: string) => {
			try {
				const response = await fetch(
					`${apiUrl}uthm-lib/course-link-details?url=${link}`
				);
				if (!response.ok) {
					toast.error("Network response was not ok");
				}
				const data = await response.json();
				setCourseData(data);
			} catch (error: any) {
				toast.error("Failed to fetch course details:", error);
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
			<Card key={index} className="dark:hover:bg-neutral-800 hover:bg-neutral-200">
				<CardHeader>
					<CardTitle className="text-lg">{course.title}</CardTitle>
					<CardDescription className="shadow-none">{course.author}</CardDescription>
				</CardHeader>
				<CardContent className="py-4 flex justify-end">
					<DrawerTrigger>
						<Button
							variant="ghost"
							className="cursor-pointer border shadow-sm"
							onClick={() => fetchCourseDetails(course.link)}
						>
							View
						</Button>
					</DrawerTrigger>
				</CardContent>
			</Card>
		));
	}, [paginatedCourseList, fetchCourseDetails]);

	const totalPages = useMemo(() => {
		return courseList ? Math.ceil(courseList.length / itemsPerPage) : 1;
	}, [courseList, itemsPerPage]);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	return (
		<div className="h-[100vh] px-2.5 md:px-20 mx-auto py-10">
			<h1 className="text-3xl font-bold my-4 ms-5">
				Results for &quot;{courseCode}&quot;
			</h1>
			<Drawer>
				{loadingCourseList ? (
					<div className="flex justify-center items-center pt-52">
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
									<PaginationLink href="#">{currentPage}</PaginationLink>
								</PaginationItem>
								{currentPage < totalPages && (
									<>
										<PaginationItem>
											<PaginationEllipsis />
										</PaginationItem>
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
						<div className="h-fit p-4 overflow-y-auto">
							<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
								{courseListCards}
							</div>
						</div>
					</>
				) : (
					<div className="flex justify-center items-center pt-20 px-4">
						<div className="text-center">
							<h1 className="text-9xl font-black text-gray-700 dark:text-gray-200">
								404
							</h1>

							<p className="text-2xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
								Uh-oh!
							</p>
							<p className="mt-4 text-gray-500">We can&apos;t find that course code</p>

							<Link
								href="/"
								className="mt-6 inline-block rounded bg-red-500 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring"
							>
								Go Back Home
							</Link>
						</div>
					</div>
				)}
				{courseData && (
					<DrawerContent className="md:max-w-3xl mx-2 md:mx-auto">
						<DrawerHeader>
							<DrawerTitle className="text-3xl mb-10">
								{typeof courseData?.details["Title"] === "string"
									? courseData?.details["Title"]
									: "-"}
							</DrawerTitle>
							<DrawerDescription>
								<div className="flow-root">
									<dl className="-my-3 text-left divide-y divide-gray-100 text-lg text-black dark:text-white">
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
									<Button variant="default" className="w-full">
										<Download className="ml-2" />
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
				)}
			</Drawer>
		</div>
	);
}
