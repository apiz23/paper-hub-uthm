import { toast } from "sonner";

export const fetchCourseList = async (courseCode: string) => {
	try {
		const response = await fetch(
			`/api/uthm-lib/list-courses-paper?query=${courseCode}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error: any) {
		toast.error("Failed to fetch course list:", error);
		throw error;
	}
};

export const fetchCourseDetails = async (link: string) => {
	try {
		const response = await fetch(
			`/api/uthm-lib/course-link-details?url=${link}`
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error: any) {
		toast.error("Failed to fetch course details:", error);
		throw error;
	}
};
