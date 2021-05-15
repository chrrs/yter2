import { ApiSearchResults, SearchResult, Shelf } from './api_v1';
import ytsr, { Item } from 'ytsr';
import { parseDuration, parseNumberSuffix } from '../util';
import base64url from 'base64url';

export async function getSearchResults(
    query: string,
    continuationString?: string
): Promise<ApiSearchResults> {
    if (typeof continuationString !== 'undefined') {
        const continuation = JSON.parse(base64url.decode(continuationString));
        continuation[3].limit = Infinity;

        const results = await ytsr.continueReq(continuation);

        return {
            results: results.items
                .filter(
                    (item) =>
                        item.type === 'video' ||
                        item.type === 'channel' ||
                        item.type === 'shelf'
                )
                .map(parseItem),
            continuation:
                typeof results.continuation === 'undefined'
                    ? undefined
                    : base64url(JSON.stringify(results.continuation)),
        };
    }

    const results = await ytsr(query, { pages: 1 });

    return {
        count: results.results,
        results: results.items
            .filter(
                (item) =>
                    item.type === 'video' ||
                    item.type === 'channel' ||
                    item.type === 'shelf'
            )
            .map(parseItem),
        continuation:
            typeof results.continuation === 'undefined'
                ? undefined
                : base64url(JSON.stringify(results.continuation)),
    };
}

function parseItem(item: Item): SearchResult {
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
                            item.author?.avatars?.map((thumbnail) => {
                                return {
                                    url: thumbnail.url || '',
                                    width: thumbnail.width,
                                    height: thumbnail.height,
                                };
                            }) || [],
                        verified: item.author?.verified || false,
                        subscribers: 0,
                    },
                    lengthSeconds: parseDuration(item.duration || '0'),
                },
            };
        case 'channel':
            return {
                type: 'channel',
                channel: {
                    id: item.channelID,
                    name: item.name,
                    subscribers: parseNumberSuffix(item.subscribers || '0'),
                    verified: item.verified,
                    avatar: item.avatars.map((thumbnail) => {
                        return {
                            url: thumbnail.url || '',
                            width: thumbnail.width,
                            height: thumbnail.height,
                        };
                    }),
                    description: item.descriptionShort || undefined,
                    videos: item.videos || undefined,
                },
            };
        case 'shelf':
            return {
                type: 'shelf',
                shelf: {
                    name: item.title,
                    items: item.items.map(parseItem),
                },
            };
        default:
            throw Error('Unexpected search result type');
    }
}
