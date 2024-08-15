"use client";

import { useEffect, useState } from "react";
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
import { Download, LoaderIcon } from "lucide-react";
import { CourseCodeList, CourseData } from "@/lib/interface/interface";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { toast } from "sonner";

export default function CoursePage({
	params,
}: {
	params: { courseCode: string };
}) {
	const { courseCode } = params;
	const [courseList, setCourseList] = useState<CourseCodeList[]>([]);
	const [courseData, setCourseData] = useState<CourseData | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (courseCode) {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			const fetchCourseList = async () => {
				setLoading(true);
				try {
					const response = await fetch(
						`${apiUrl}uthm-lib/list-courses-paper?query=${courseCode}`
					);
					if (!response.ok) {
						throw new Error("Network response was not ok");
					}
					const data = await response.json();
					setCourseList(data);
				} catch (error) {
					console.error("Failed to fetch course list:", error);
				} finally {
					setLoading(false);
				}
			};
			fetchCourseList();
		}
	}, [courseCode]);

	const fetchCourseDetails = async (link: string) => {
		const apiUrl = "https://jg160007-api.vercel.app";
		try {
			const response = await fetch(
				`${apiUrl}/uthm-lib/course-link-details?url=${link}`
			);
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			const data = await response.json();
			setCourseData(data);
		} catch (error) {
			console.error("Failed to fetch course details:", error);
		}
	};
	return (
		<div className="min-h-screen px-2.5 md:px-20 mx-auto py-10">
			<Drawer>
				<h1 className="text-3xl font-bold my-4 ms-5">
					Results for &quot;{courseCode}&quot;
				</h1>

				{loading ? (
					<div className="flex justify-center items-center pt-52">
						<LoaderIcon className="animate-spin h-20 w-20" />
					</div>
				) : courseList.length > 0 ? (
					<ScrollArea className="h-[70vh] p-4">
						<div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
							{courseList.map((course, index) => (
								<Card
									key={index}
									className="dark:hover:bg-neutral-800 hover:bg-neutral-200"
								>
									<CardHeader>
										<CardTitle className="text-lg">{course.title}</CardTitle>
										<CardDescription className="shadow-none">
											{course.author}
										</CardDescription>
									</CardHeader>
									<CardContent className="py-4 rounded-md shadow-md flex justify-end">
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
							))}
						</div>
					</ScrollArea>
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
									<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
										<dt className="font-medium">Issue Date:</dt>
										<dd className="sm:col-span-2">
											{typeof courseData?.details["Issue Date"] === "string"
												? courseData?.details["Issue Date"]
												: "-"}
										</dd>
									</div>

									<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
										<dt className="font-medium">Description:</dt>
										<dd className="sm:col-span-2">
											{typeof courseData?.details["Description"] === "string"
												? courseData?.details["Description"]
												: "-"}
										</dd>
									</div>

									<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
										<dt className="font-medium">Author:</dt>
										<dd className="sm:col-span-2">
											{courseData?.details["Authors"] &&
											typeof courseData.details["Authors"] !== "string"
												? courseData.details["Authors"].data
												: "-"}
										</dd>
									</div>

									<div className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
										<dt className="font-medium">Collection:</dt>
										<dd className="sm:col-span-2">
											{courseData?.details["Appears in Collections"] &&
											typeof courseData.details["Appears in Collections"] !== "string"
												? courseData.details["Appears in Collections"].data
												: "-"}
										</dd>
									</div>
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
			</Drawer>
		</div>
	);
}
