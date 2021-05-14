export interface Video {
    id: string;
    title: string;
    description?: string;
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
    description?: string;
    videos?: number;
}

export interface Comment {
    id: string;
    author: Channel;
    text: string;
    edited: boolean;
    heart: boolean;
    likes: number;
    date: string;
    replies: number;
    continuation?: string;
}

export interface Image {
    url: string;
    width: number;
    height: number;
}

export interface SearchResult {
    type: 'video' | 'channel' | 'shelf';
    video?: Video;
    channel?: Channel;
    shelf?: Shelf;
}

export interface Shelf {
    name: string;
    items: Array<SearchResult>;
}

export interface ApiVideo {
    info: Video;
    formats: Array<VideoFormat>;
    related: Array<Video>;
}

export interface ApiVideoComments {
    count: number;
    comments: Array<Comment>;
    continuation?: string;
}

export interface ApiSearchResults {
    count?: number;
    results: Array<SearchResult>;
}

export interface ApiError {
    error: string;
}
