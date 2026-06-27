import { toast } from "sonner";
import { CourseData, CourseDetails, DownloadLink } from "@/lib/interface/interface";

export const fetchCourseList = async (courseCode: string) => {
  try {
    const response = await fetch(
      `/api/search?query=${encodeURIComponent(courseCode)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.results;
  } catch (error: any) {
    toast.error(`Failed to fetch course list: ${error.message}`);
    throw error;
  }
};

export const fetchCourseDetails = async (handle: string): Promise<CourseData> => {
  try {
    const response = await fetch(
      `/api/detail?handle=${encodeURIComponent(handle)}`
    );
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();

    const { files: rawFiles, ...rest } = data.detail;
    const details: CourseDetails = { ...rest };
    const downloadLinks: DownloadLink[] = (rawFiles || []).map(
      (file: { file: string; link: string }) => ({
        fileName: file.file,
        fileUrl: file.link,
      })
    );

    return { details, downloadLinks };
  } catch (error: any) {
    toast.error(`Failed to fetch course details: ${error.message}`);
    throw error;
  }
};
