export interface Video {
    id: string;
    title: string;
    description: string;
    views: number;
    live: boolean;
    lengthSeconds: number;
    author: Channel;
    date: string;
    thumbnail: Array<Image>;
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

export interface Channel {
    id: string;
    name: string;
    subscribers: number;
    verified: boolean;
    avatar: Array<Image>;
}

export interface ApiVideo {
    info: Video;
    formats: Array<VideoFormat>;
}

export interface Image {
    url: string;
    width: number;
    height: number;
}

export interface ApiError {
    error: string;
}
