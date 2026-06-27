"use client";

import { useState, useEffect } from "react";
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
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"; // use Dialog for desktop
import { Button } from "@/components/ui/button";
import { Download, LoaderIcon } from "lucide-react";
import { CourseCodeList, CourseData } from "@/lib/interface/interface";
import Link from "next/link";
import { fetchCourseDetails, fetchCourseList } from "@/lib/api/courseApi";
import confetti from "canvas-confetti";
import { SearchBar } from "@/components/placeholder-vanish";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function CoursePage({
    params,
}: {
    params: { courseCode: string };
}) {
    const { courseCode } = params;
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [courseList, setCourseList] = useState<CourseCodeList[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [loadingHandle, setLoadingHandle] = useState<string | null>(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await fetchCourseList(courseCode);
                if (Array.isArray(data)) {
                    const sortedData = data.sort(
                        (a, b) =>
                            new Date(b.date).getTime() -
                            new Date(a.date).getTime()
                    );
                    setCourseList(sortedData);
                } else {
                    toast.error("Unexpected data format received");
                }
            } catch (error: any) {
                toast.error("Error fetching course list: " + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [courseCode]);

    const handleViewDetails = async (handle: string) => {
        if (loadingHandle) return;
        setLoadingHandle(handle);
        try {
            const data = await fetchCourseDetails(handle);
            setCourseData(data);
            setModalOpen(true);
        } catch (error: any) {
            toast.error("Error fetching course details: " + error.message);
        } finally {
            setLoadingHandle(null);
        }
    };

    const triggerConfetti = () => {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });
    };

    if (loading) {
        return (
            <div className="h-[70vh] flex justify-center items-center">
                <LoaderIcon className="animate-spin h-20 w-20" />
            </div>
        );
    }

    if (courseList.length === 0) {
        return (
            <div className="px-4 pt-20 md:pt-40 text-center gap-4">
                <h1 className="text-9xl font-black text-gray-700 dark:text-gray-200">
                    404
                </h1>
                <p className="text-2xl font-bold tracking-tight dark:text-white text-gray-900 sm:text-4xl">
                    Uh-oh!
                </p>
                <p className="my-4 text-gray-300">
                    We can&apos;t find that course code
                </p>
                <Link href="/">
                    <Button variant="destructive">Go Back Home</Button>
                </Link>
            </div>
        );
    }

    const renderDetailsContent = () => (
        <>
            <div className="flow-root">
                <dl className="-my-3 text-left divide-y divide-gray-100 text-base text-black dark:text-white">
                    {Object.keys(courseData!.details)
                        .filter((key) => key !== "" && courseData!.details[key] !== "")
                        .map((key) => {
                        const detail = courseData!.details[key];
                        return (
                            <div
                                key={key}
                                className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4"
                            >
                                <dt className="font-medium">{key}:</dt>
                                <dd className="sm:col-span-2">
                                    {typeof detail === "string"
                                        ? detail
                                        : detail?.data &&
                                          (key === "Authors" ||
                                              key ===
                                                  "Appears in Collections" ||
                                              key === "URI")
                                        ? detail.data
                                        : "-"}
                                </dd>
                            </div>
                        );
                    })}
                </dl>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                {courseData!.downloadLinks.map((link, index) => (
                    <a
                        key={index}
                        href={link.fileUrl}
                        target="_blank"
                        download
                        className="block w-full"
                    >
                        <Button
                            className="w-full bg-blue-800 text-white hover:bg-blue-900"
                            onClick={triggerConfetti}
                        >
                            <Download className="mr-2 h-4 w-4" /> Download
                        </Button>
                    </a>
                ))}
            </div>
        </>
    );

    return (
        <div className="min-h-screen px-2.5 md:px-20 mx-auto pb-10 pt-5">
            <div className="flex flex-col md:flex-row justify-between px-4 md:px-6 mb-6">
                <h1 className="order-2 md:order-1 text-2xl md:text-3xl font-thin my-4">
                    Results for &quot;
                    <strong className="font-extrabold underline underline-offset-8">
                        {decodeURIComponent(courseCode)}
                    </strong>
                    &quot;
                </h1>
                <div className="order-1 md:order-2 flex justify-center md:justify-end mt-4">
                    <SearchBar />
                </div>
            </div>

            <div className="bg-white dark:bg-black rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courseList.map((course) => (
                            <TableRow key={course.handle}>
                                <TableCell className="font-medium">
                                    {course.title}
                                </TableCell>
                                <TableCell>{course.author}</TableCell>
                                <TableCell>
                                    {course.date && course.date !== "-"
                                        ? course.date
                                        : "N/A"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        onClick={() => handleViewDetails(course.handle)}
                                        variant="outline"
                                        size="sm"
                                        disabled={!!loadingHandle}
                                    >
                                        {loadingHandle === course.handle ? (
                                            <LoaderIcon className="animate-spin h-4 w-4" />
                                        ) : (
                                            "View"
                                        )}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {courseData &&
                (isMobile ? (
                    <Drawer open={modalOpen} onOpenChange={setModalOpen}>
                        <DrawerContent className="md:max-w-3xl mx-2 md:mx-auto bg-black">
                            <DrawerHeader>
                                <DrawerTitle className="text-3xl mb-4">
                                    {typeof courseData?.details["Title"] ===
                                    "string"
                                        ? courseData?.details["Title"]
                                        : "-"}
                                </DrawerTitle>
                                <DrawerDescription>
                                    {renderDetailsContent()}
                                </DrawerDescription>
                            </DrawerHeader>
                            <DrawerFooter>
                                <DrawerClose asChild>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Close
                                    </Button>
                                </DrawerClose>
                            </DrawerFooter>
                        </DrawerContent>
                    </Drawer>
                ) : (
                    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                        <DialogContent className="md:max-w-3xl mx-2 md:mx-auto bg-black">
                            <DialogHeader>
                                <DialogTitle className="text-3xl mb-4">
                                    {typeof courseData?.details["Title"] ===
                                    "string"
                                        ? courseData?.details["Title"]
                                        : "-"}
                                </DialogTitle>
                                <DialogDescription>
                                    {renderDetailsContent()}
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Close
                                    </Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                ))}
        </div>
    );
}
