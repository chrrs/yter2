import express from 'express';
import ytdl from 'ytdl-core';
import { formatDistance } from 'date-fns';
import suggest from 'youtube-suggest';
import ytsr from 'ytsr';
import ytChannelInfo from 'yt-channel-info';
import { generate_dash_file_from_formats } from 'yt-dash-manifest-generator';
import {
    ApiChannelVideosResponse,
    ApiSearchResponse,
    ApiVideoResponse,
    Channel,
    Image,
    SearchResult,
    Video,
} from '~/assets/api_types';

export const app = express();

function reverseFormatNumber(n: string): number {
    if (n.endsWith('M')) {
        return parseFloat(n.replace('M', '')) * 1000000;
    } else if (n.endsWith('K')) {
        return parseFloat(n.replace('M', '')) * 1000;
    } else {
        return parseInt(n);
    }
}

app.get('/video/:id', async (req, res) => {
    const info = await ytdl.getInfo(
        `http://www.youtube.com/watch?v=${req.params.id}`
    );

    const details = info.videoDetails;
    const author = details.author;

    res.json({
        video: {
            id: details.videoId,
            title: details.title,
            // @ts-ignore
            description: details.description,
            views: parseInt(details.viewCount),
            publishDate: details.publishDate,
            relativePublishDate:
                formatDistance(new Date(details.publishDate), new Date()) +
                ' ago',
            live: details.isLiveContent,
            lengthSeconds: parseInt(details.lengthSeconds),
            author: {
                id: author.id,
                name: author.name,
                subscribers: author.subscriber_count,
                avatars: author.thumbnails,
                verified: author.verified,
            },
            thumbnails: details.thumbnails,
        },
        related: info.related_videos.map((v) => {
            const relatedAuthor = v.author as ytdl.Author;

            return {
                id: v.id,
                title: v.title,
                views: parseInt(v.view_count || '0'),
                relativePublishDate: v.published,
                live: v.isLive,
                lengthSeconds: v.length_seconds,
                badges: v.isLive
                    ? [
                          {
                              type: 'live',
                              text: 'LIVE NOW',
                          },
                      ]
                    : [],
                author: {
                    id: relatedAuthor.id,
                    name: relatedAuthor.name,
                    avatars: relatedAuthor.thumbnails,
                    verified: relatedAuthor.verified,
                },
                thumbnails: v.thumbnails,
            };
        }),
        sources: info.formats.map((f) => {
            return {
                url: f.url,
                type: f.mimeType,
                width: f.width,
                height: f.height,
                fps: f.fps,
                itag: f.itag,
                qualityLabel: f.qualityLabel,
                hasVideo: f.hasVideo,
                hasAudio: f.hasAudio,
            };
        }),
    } as ApiVideoResponse);
});

app.get('/search/suggest', async (req, res) => {
    res.json(await suggest(req.query.q as string));
});

app.get('/search', async (req, res) => {
    const info = await ytsr(req.query.q as string);

    res.json({
        results: info.items.map((i) => {
            switch (i.type) {
                case 'video': {
                    const video = i as ytsr.Video;

                    return {
                        type: 'video',
                        video: transformYtsrVideo(video),
                    } as SearchResult;
                }
                case 'channel': {
                    const channel = i as ytsr.Channel;

                    return {
                        type: 'channel',
                        channel: {
                            id: channel.channelID,
                            name: channel.name,
                            subscribers: reverseFormatNumber(
                                channel.subscribers?.replace(
                                    ' subscribers',
                                    ''
                                ) || '0'
                            ),
                            description: channel.descriptionShort,
                            avatars: channel.avatars,
                            verified: channel.verified,
                            videos: channel.videos || 0,
                        },
                    } as SearchResult;
                }
                case 'shelf': {
                    const shelf = i as ytsr.Shelf;

                    return {
                        type: 'shelf',
                        shelf: {
                            title: shelf.title,
                            videos: shelf.items.map((v) =>
                                transformYtsrVideo(v as ytsr.Video)
                            ),
                        },
                    } as SearchResult;
                }
                default: {
                    return {
                        type: i.type,
                    };
                }
            }
        }),
    } as ApiSearchResponse);
});

app.get('/channel/:id', async (req, res) => {
    const info = await ytChannelInfo.getChannelInfo(req.params.id);

    res.json({
        id: info.authorId,
        name: info.author,
        subscribers: info.subscriberCount,
        description: info.description,
        avatars: info.authorThumbnails,
        banners: info.authorBanners,
        verified: info.isVerified,
    } as Channel);
});

app.get('/channel/:id/videos', async (req, res) => {
    const info = await ytChannelInfo.getChannelVideos(req.params.id);

    res.json({
        videos: info.items.map((v) => {
            return {
                id: v.videoId,
                title: v.title,
                views: v.viewCount,
                relativePublishDate: v.publishedText,
                live: v.liveNow,
                upcoming: v.premiere,
                lengthSeconds: v.lengthSeconds,
                badges: v.liveNow
                    ? [
                          {
                              type: 'live',
                              text: 'LIVE NOW',
                          },
                      ]
                    : [],
                thumbnails: v.videoThumbnails,
            };
        }),
        continuation: info.continuation,
    } as ApiChannelVideosResponse);
});

function transformYtsrVideo(video: ytsr.Video): Video {
    const author = video.author;

    const durationRegex = /(\d+):(\d{2})(?::(\d{2}))?/;
    const parts = (video.duration || '00:00').match(durationRegex);
    let lengthSeconds;

    if (parts === null) {
        lengthSeconds = 0;
    } else if (parts[2] !== undefined) {
        lengthSeconds =
            parseInt(parts[0]) * 3600 +
            parseInt(parts[1]) * 60 +
            parseInt(parts[2]);
    } else {
        lengthSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    const ret = {
        id: video.id,
        title: video.title,
        description: video.description || '',
        views: video.views || 0,
        relativePublishDate: video.uploadedAt,
        live: video.isLive,
        upcoming: video.isUpcoming,
        lengthSeconds,
        badges: video.badges.map((b) => {
            return {
                type:
                    b.includes('LIVE') || b.includes('PREMIERING')
                        ? 'live'
                        : 'normal',
                text: b,
            };
        }),
        author: {
            id: author?.channelID || '',
            name: author?.name || '',
            avatars: (author?.avatars as Image[]) || [],
            verified: author?.verified || false,
        },
        thumbnails: (video.thumbnails as Image[]) || [],
    } as Video;

    if (video.isUpcoming) {
        ret.publishDate = new Date(video.upcoming as number).toISOString();
    }

    return ret;
}

export default app;
