import { format } from 'date-fns';

export interface ApiVideoResponse {
    video: Video;
    related: Video[];
    sources: VideoSource[];
}

export interface ApiSearchResponse {
    results: SearchResult[];
    continuation: string;
}

export interface ApiChannelVideosResponse {
    videos: Video[];
    continuation: string;
}

export interface SearchResult {
    type: 'video' | 'channel' | 'shelf' | 'playlist';
    video?: Video;
    channel?: Channel;
    shelf?: SearchShelf;
    playlist?: Playlist;
}

export interface SearchShelf {
    title: string;
    videos: Video[];
}

export interface VideoSource {
    url: string;
    type: string;
    width: number;
    height: number;
    fps: number;
    itag: number;
    qualityLabel: string;
    hasVideo: boolean;
    hasAudio: boolean;
}

export interface Video {
    id: string;
    title: string;
    description?: string;
    views: number;
    publishDate?: string;
    relativePublishDate: string;
    live: boolean;
    upcoming: boolean;
    lengthSeconds: number;
    likes?: number;
    dislikes?: number;
    badges?: VideoBadge[];
    author?: Channel;
    thumbnails: Image[];
}

export interface VideoBadge {
    type: 'live' | 'normal';
    text: string;
}

export interface Channel {
    id: string;
    name: string;
    subscribers?: number;
    description?: string;
    avatars: Image[];
    banners?: Image[];
    verified: boolean;
    videos?: number;
}

export interface Image {
    url: string;
    width: number;
    height: number;
}

export interface Playlist {
    id: string;
    name: string;
    owner: Channel;
    video_count: number;
    thumbnails: Image[];
}

export function bestFittingImage(
    images: Image[],
    width: number = 0,
    height: number = 0,
): Image | null {
    if (images.length === 0) {
        return null;
    }

    return (
        images
            .slice()
            .filter((t) => width <= t.width && height <= t.height)
            .sort((a, b) => a.width - b.width)[0] ||
        images.slice().sort((a, b) => b.width - a.width)[0]
    );
}

export function formatNumber(n: number): string {
    if (n >= 1000000) {
        return n / 1000000 + 'M';
    } else if (n >= 1000) {
        return n / 1000 + 'K';
    }

    return n.toString();
}

export function videoSubtitle(video: Video): string {
    if (video.live) {
        return `${video.views.toLocaleString('en-US')} viewers`;
    } else if (video.upcoming) {
        return `Premieres on ${format(
            new Date(video.publishDate || '0'),
            'Pp',
        )}`;
    } else {
        return `${video.views.toLocaleString('en-US')} views • ${
            video.relativePublishDate
        }`;
    }
}

export function formatDuration(lengthSeconds: number): string {
    // @ts-ignore
    const hours = (lengthSeconds / 3600) >> 0;
    // @ts-ignore
    const minutes = (lengthSeconds / 60) % 60 >> 0;
    // @ts-ignore
    const seconds = lengthSeconds % 60 >> 0;

    if (hours !== 0) {
        return `${hours}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
