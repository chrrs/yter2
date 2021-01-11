declare module 'yt-channel-info' {
    export interface ChannelVideos {
        items: Video[];
        continuation: string;
    }

    export interface ChannelInfo {
        author: string;
        authorId: string;
        authorUrl: string;
        authorBanners: Image[];
        authorThumbnails: Image[];
        subscriberText: string;
        subscriberCount: number;
        description: string;
        isFamilyFriendly: boolean;
        relatedChannels: unknown[];
        allowedRegions: string[];
        isVerified: boolean;
    }

    export interface Image {
        url: string;
        width: number;
        height: number;
    }

    export interface Video {
        type: 'video';
        title: string;
        videoId: string;
        author: string;
        authorId: string;
        videoThumbnails: Image[];
        viewCountText: string;
        viewCount: number;
        publishedText: string;
        durationText: string;
        lengthSeconds: number;
        liveNow: boolean;
        premiere: boolean;
    }

    export function getChannelInfo(channelId: string): Promise<ChannelInfo>;

    export function getChannelVideos(
        channelId: string,
        sortBy?: string
    ): Promise<ChannelVideos>;

    export function getChannelVideosMore(
        continuation: string
    ): Promise<ChannelVideos>;
}
