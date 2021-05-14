import { ApiSearchResults } from './api_v1';
import ytsr from 'ytsr';
import { parseDuration, parseNumberSuffix } from '../util';

export async function getSearchResults(
    query: string
): Promise<ApiSearchResults> {
    const results = await ytsr(query, { pages: 1 });

    return {
        count: results.results,
        results: results.items
            .filter((item) => item.type === 'video' || item.type === 'channel')
            .map((item) => {
                switch (item.type) {
                    case 'video':
                        return {
                            type: 'video',
                            video: {
                                id: item.id,
                                title: item.title,
                                description: item.description || '',
                                live: item.isLive,
                                thumbnail: item.thumbnails.map((thumbnail) => {
                                    return {
                                        url: thumbnail.url || '',
                                        width: thumbnail.width,
                                        height: thumbnail.height,
                                    };
                                }),
                                date: item.uploadedAt || '',
                                views: item.views || 0,
                                author: {
                                    id: item.author?.channelID || '',
                                    name: item.author?.name || '',
                                    avatar:
                                        item.author?.avatars?.map(
                                            (thumbnail) => {
                                                return {
                                                    url: thumbnail.url || '',
                                                    width: thumbnail.width,
                                                    height: thumbnail.height,
                                                };
                                            }
                                        ) || [],
                                    verified: item.author?.verified || false,
                                    subscribers: 0,
                                },
                                lengthSeconds: parseDuration(
                                    item.duration || '0'
                                ),
                            },
                        };
                    case 'channel':
                        return {
                            type: 'channel',
                            channel: {
                                id: item.channelID,
                                name: item.name,
                                subscribers: parseNumberSuffix(
                                    item.subscribers || '0'
                                ),
                                verified: item.verified,
                                avatar: item.avatars.map((thumbnail) => {
                                    return {
                                        url: thumbnail.url || '',
                                        width: thumbnail.width,
                                        height: thumbnail.height,
                                    };
                                }),
                                description: item.descriptionShort || undefined,
                            },
                        };
                    default:
                        throw Error('Unexpected search result type');
                }
            }),
    };
}
