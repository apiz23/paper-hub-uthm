export interface FileItem {
    file: string;
    link: string;
    size: string;
    format: string;
}

export interface CourseDetailResponse {
    handle: string;
    detail: {
        [key: string]: string | FileItem[]; // metadata string OR files array
        files: FileItem[];
    };
}

export interface CourseDetail {
    data: string;
    URL?: string;
}

export interface CourseDetails {
    [key: string]: string | CourseDetail | undefined;
}

export interface DownloadLink {
    fileName: string;
    fileUrl: string;
}

export interface CourseData {
    details: CourseDetails;
    downloadLinks: DownloadLink[];
}

export interface CourseCodeList {
    handle: string; // ini penting sebab kau panggil handle untuk detail
    link: string;
    title: string;
    author: string;
    date: string;
}
