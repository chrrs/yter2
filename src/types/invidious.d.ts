export interface InvidiousApiComments {
    commentCount?: number;
    id: string;
    comments: Array<{
        author: string;
        authorThumbnails: Array<{
            url: string;
            width: number;
            height: number;
        }>;
        authorId: string;
        authorUrl: string;
        isEdited: boolean;
        content: string;
        contentHtml: string;
        published: number;
        publishedText: string;
        likeCount: number;
        commentId: string;
        authorIsChannelOwner: boolean;
        creatorHeart:
            | {
                  creatorThumbnail: string;
                  creatorName: string;
              }
            | undefined;
        replies:
            | {
                  replyCount: number;
                  continuation: string;
              }
            | undefined;
    }>;
    continuation?: string;
}
