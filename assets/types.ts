import ytdl from 'ytdl-core';
import ytsr from 'ytsr';

export class VideoInfo {
    public title: string;
    public description: string;
    public views: number;
    public publishDate: Date;
    public author: Author;

    constructor(details: ytdl.MoreVideoDetails) {
        this.title = details.title;
        // @ts-ignore
        this.description = details.description;
        this.views = parseInt(details.viewCount);
        this.publishDate = new Date(details.publishDate);
        this.author = new Author(details.author);
    }
}

export class Author {
    public name: string;
    public subscriberCount: number;
    public verified: boolean;
    public thumbnail: Thumbnail;

    constructor(author: ytdl.Author) {
        this.name = author.name;
        this.subscriberCount = author.subscriber_count || 0;
        this.verified = author.verified;
        this.thumbnail = new Thumbnail(author.thumbnails || []);
    }

    public formattedSubscriberCount(): string {
        if (this.subscriberCount >= 1000000) {
            return this.subscriberCount / 1000000 + 'M';
        } else if (this.subscriberCount >= 1000) {
            return this.subscriberCount / 1000 + 'K';
        }

        return this.subscriberCount.toString();
    }
}

export class RecommendedVideo {
    public id: string;
    public title: string;
    public views: number;
    public viewsText: string;
    public length: number;
    public published: string;
    public author?: Author;
    public thumbnail: Thumbnail;
    public live: boolean;

    constructor(video: ytdl.relatedVideo) {
        this.id = video.id || '';
        this.title = video.title || 'Invalid Title';
        this.views = parseInt(video.view_count || '0');
        this.viewsText = video.short_view_count_text || '0';
        this.length = video.length_seconds || 0;
        this.published = video.published || 'now';
        // @ts-ignore
        this.author = new Author(video.author);
        this.thumbnail = new Thumbnail(video.thumbnails);
        this.live = video.isLive;
    }
}

export class Thumbnail {
    private thumbnails: {
        url: string;
        width: number;
        height: number;
    }[];

    constructor(thumbnails: ytdl.thumbnail[] | ytsr.Image[]) {
        // @ts-ignore
        this.thumbnails = thumbnails;
    }

    public bestFitting(width: number = 0, height: number = 0): string {
        if (this.thumbnails.length === 0) {
            return '';
        }

        return (
            this.thumbnails
                .filter((t) => width <= t.width && height <= t.height)
                .sort((a, b) => b.width * b.height - a.width * a.height)[0] ||
            this.thumbnails.sort(
                (a, b) => b.width * b.height - a.width * a.height
            )[0]
        ).url;
    }
}
