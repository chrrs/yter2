export interface Video {
    id: string;
    title: string;
    description: string;
    views: number;
    live: boolean;
    lengthSeconds: number;
}

export interface VideoFormat {
    url: string;
    mimeType: string;
    label: string;
    width: number;
    height: number;
    hasVideo: boolean;
    hasAudio: boolean;
}

export interface ApiVideo {
    info: Video;
    formats: Array<VideoFormat>;
}

export interface ApiError {
    error: string;
}
