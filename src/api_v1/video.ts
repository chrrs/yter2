import { ApiVideo, Image } from './api_v1';
import ytdl from 'ytdl-core';

export async function getVideoInfo(id: string): Promise<ApiVideo> {
    const info = await ytdl.getInfo(id);

    return {
        info: {
            id,
            title: info.videoDetails.title,
            description: info.videoDetails.description || '',
            lengthSeconds: parseInt(info.videoDetails.lengthSeconds),
            live: info.videoDetails.isLiveContent,
            views: parseInt(info.videoDetails.viewCount),
            thumbnail: info.videoDetails.thumbnails as Array<Image>,
            date: info.videoDetails.publishDate,
            author: {
                id: info.videoDetails.author.id,
                name: info.videoDetails.author.name,
                subscribers: info.videoDetails.author.subscriber_count || 0,
                verified: info.videoDetails.author.verified,
                avatar: info.videoDetails.author.thumbnails as Array<Image>,
            },
        },
        formats: info.formats.map((format) => {
            return {
                url: format.url,
                mimeType: format.mimeType || 'video/mp4',
                label: format.qualityLabel,
                width: format.width || 0,
                height: format.height || 0,
                hasVideo: format.hasVideo,
                hasAudio: format.hasAudio,
            };
        }),
    };
}
