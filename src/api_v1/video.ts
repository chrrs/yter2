import { ApiVideo } from './api_v1';
import ytdl from 'ytdl-core';

export async function getVideoInfo(id: string): Promise<ApiVideo> {
    const info = await ytdl.getBasicInfo(id);

    return {
        info: {
            id,
            title: info.videoDetails.title,
            description: info.videoDetails.description || '',
            lengthSeconds: parseInt(info.videoDetails.lengthSeconds),
            live: info.videoDetails.isLiveContent,
            views: parseInt(info.videoDetails.viewCount),
        },
        formats: info.formats.map((format) => {
            return {
                url: format.url,
                mimeType: format.mimeType || 'video/mp4',
                label: format.qualityLabel,
                width: format.width || 0,
                height: format.height || 0,
            };
        }),
    };
}
