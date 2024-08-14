export interface CourseDetails {
	[key: string]: string;
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
	link: string;
	title: string;
	author: string;
}
