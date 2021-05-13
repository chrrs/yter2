import { ApiVideo, ApiVideoComments, Image } from './api_v1';
import ytdl from 'ytdl-core';
import axios from 'axios';
import { InvidiousApiComments } from '../types/invidious';

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
        related: info.related_videos.map((related) => {
            if (typeof related.author === 'string') {
                throw new Error('Unexpected result');
            }

            return {
                id: related.id || '',
                title: related.title || '',
                views: parseInt(related.view_count || '0'),
                author: {
                    id: related.author.id,
                    name: related.author.name,
                    subscribers: related.author.subscriber_count || 0,
                    verified: related.author.verified,
                    avatar: related.author.thumbnails || [],
                },
                date: related.published || '',
                live: related.isLive,
                thumbnail: related.thumbnails as Array<Image>,
                lengthSeconds: related.length_seconds || 0,
            };
        }),
    };
}

export async function getVideoComments(
    id: string,
    continuation?: string
): Promise<ApiVideoComments> {
    const info = (
        await axios.get(
            `https://invidious.tube/api/v1/comments/${id}${
                typeof continuation !== 'undefined'
                    ? `?continuation=${continuation}`
                    : ''
            }`
        )
    ).data as InvidiousApiComments;

    return {
        count: info.commentCount || 0,
        comments: info.comments.map((comment) => {
            return {
                id: comment.commentId,
                date: comment.publishedText,
                replies: comment.replies?.replyCount || 0,
                likes: comment.likeCount,
                heart: typeof comment.creatorHeart !== 'undefined',
                author: {
                    id: comment.authorId,
                    name: comment.author,
                    avatar: comment.authorThumbnails as Array<Image>,
                    verified: false, // TODO: This should be gotten somewhere
                    subscribers: 0,
                },
                edited: comment.isEdited,
                text: comment.content,
                continuation: comment.replies?.continuation,
            };
        }),
        continuation: info.continuation,
    };
}
