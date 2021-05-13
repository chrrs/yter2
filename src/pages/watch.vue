<template>
    <div class="container watch-container">
        <div class="main-content">
            <div v-if="error || fetching" class="video-placeholder">
                <p class="error-text" v-if="error">
                    <i class="mdi mdi-alert-circle-outline"></i>
                    Video not available
                </p>
            </div>
            <Player
                v-else
                :sources="suitableSources"
                :poster="chooseImage(video?.thumbnail || []).url"
                :storyboards="`/api/v1/video/${video?.id}/storyboards.vtt`"
            />
            <div v-if="!error && !fetching" class="video-info">
                <h1 class="title">{{ video?.title }}</h1>
                <p class="subtitle">
                    {{ video?.views?.toLocaleString('en-US') }} views •
                    {{ formattedDate }}
                </p>
            </div>
            <div v-if="!error && !fetching" class="video-details">
                <img
                    :src="chooseImage(video?.author.avatar || [], 96).url"
                    :alt="`${video?.author.name}'s profile picture`"
                    class="author-image"
                />
                <div class="details">
                    <div class="author-info">
                        <p>
                            <a href="#" class="author-name">
                                {{ video?.author.name }}
                            </a>
                            <i
                                v-if="video?.author.verified"
                                class="verified mdi mdi-check-circle"
                            ></i>
                        </p>
                        <p class="author-subtitle">
                            {{ formatNumber(video?.author.subscribers || 0) }}
                            subscribers
                        </p>
                    </div>
                    <div class="video-description">
                        {{ video?.description }}
                    </div>
                </div>
            </div>
            <div v-if="!error && !fetching" class="comments">
                <div class="comment-count">
                    {{ commentCount.toLocaleString('en-US') }} Comment{{
                        commentCount === 1 ? '' : 's'
                    }}
                </div>
                <div v-for="comment in comments" class="comment">
                    <img
                        class="author-image"
                        :src="chooseImage(comment.author.avatar, 80).url"
                        :alt="`${comment.author.name}'s profile picture`"
                    />
                    <div class="content">
                        <p class="header">
                            <a href="#" class="author-name">{{
                                comment.author.name
                            }}</a>
                            <span class="timestamp">{{ comment.date }}</span>
                        </p>
                        <p class="comment-body">
                            {{ comment.text }}
                        </p>
                        <div class="likes">
                            <div class="like">
                                <i class="mdi mdi-thumb-up"></i>
                                <span v-if="comment.likes !== 0" class="amount">
                                    {{ comment.likes.toLocaleString('en-US') }}
                                </span>
                            </div>
                            <i class="mdi mdi-thumb-down"></i>
                            <div v-if="comment.heart" class="creator-heart">
                                <img
                                    :src="
                                        chooseImage(
                                            video?.author?.avatar || [],
                                            32
                                        ).url
                                    "
                                    :alt="`${video?.author?.name}'s profile picture`"
                                />
                                <i class="heart mdi mdi-heart"></i>
                            </div>
                        </div>
                        <div v-if="comment.replies !== 0" class="replies">
                            <a href="#" class="expand">
                                <i class="mdi mdi-chevron-down"></i>
                                View
                                {{
                                    comment.replies === 1
                                        ? 'reply'
                                        : `${comment.replies} replies`
                                }}
                            </a>
                        </div>
                    </div>
                </div>
                <InfiniteScroll
                    v-if="commentContinuation"
                    class="spinner"
                    :disabled="fetchingComments"
                    @loadMore="fetchComments()"
                ></InfiniteScroll>
            </div>
        </div>
        <div class="sidebar">
            <div v-if="!fetching && !error" class="related-videos">
                <router-link
                    v-for="relatedVideo in related"
                    class="related-video"
                    @click=""
                    :to="`/watch?v=${relatedVideo.id}`"
                >
                    <div class="thumbnail">
                        <img
                            :src="chooseImage(relatedVideo.thumbnail, 320).url"
                            alt="Video thumbnail"
                        />
                        <span class="video-length">
                            {{ formatSeconds(relatedVideo.lengthSeconds) }}
                        </span>
                    </div>
                    <div class="video-info">
                        <p class="title">{{ relatedVideo.title }}</p>
                        <p class="author">
                            <a href="#">{{ relatedVideo.author.name }}</a>
                            <i
                                v-if="relatedVideo.author.verified"
                                class="verified mdi mdi-check-circle"
                            ></i>
                        </p>
                        <p class="details">
                            {{ relatedVideo.views.toLocaleString('en-US') }}
                            views •
                            {{ relatedVideo.date }}
                        </p>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, ref, watch } from 'vue';

import Player from '../components/Player.vue';
import InfiniteScroll from '../components/InfiniteScroll.vue';

import { useRoute } from 'vue-router';
import axios, { AxiosResponse } from 'axios';
import {
    ApiVideo,
    ApiVideoComments,
    Comment,
    Video,
    VideoFormat,
} from '../api_v1/api_v1';
import { chooseImage, formatNumber, formatSeconds } from '../util';

export default {
    components: {
        InfiniteScroll,
        Player,
    },
    setup() {
        const route = useRoute();

        const error = ref(false);
        const fetching = ref(true);
        const video = ref<Video | null>(null);
        const sources = ref<Array<VideoFormat>>([]);
        const related = ref<Array<Video>>([]);

        const comments = ref<Array<Comment>>([]);
        const commentCount = ref(0);
        const commentContinuation = ref<string | undefined>();
        const fetchingComments = ref(true);

        const suitableSources = computed(() =>
            sources.value.filter((format) => format.hasAudio && format.hasVideo)
        );

        const formattedDate = computed(() =>
            new Date(video.value?.date || '').toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            })
        );

        const fetch = () => {
            fetching.value = true;

            if (typeof window === 'undefined') {
                return;
            }

            if (
                !/^([A-Za-z0-9\-_]){11}$/.test((route.query.v as string) || '')
            ) {
                error.value = true;
                fetching.value = false;
                return;
            }

            axios
                .get(`/api/v1/video/${route.query.v}`)
                .then((response: AxiosResponse<ApiVideo>) => {
                    video.value = response.data.info;
                    sources.value = response.data.formats;
                    related.value = response.data.related;
                })
                .catch((e) => {
                    console.log(e);
                    error.value = true;
                })
                .finally(() => (fetching.value = false));
        };

        const fetchComments = () => {
            fetchingComments.value = true;

            if (typeof window === 'undefined') {
                return;
            }

            axios
                .get(
                    `/api/v1/video/${route.query.v}/comments${
                        typeof commentContinuation.value !== 'undefined'
                            ? `?continuation=${commentContinuation.value}`
                            : ''
                    }`
                )
                .then((response: AxiosResponse<ApiVideoComments>) => {
                    commentCount.value = response.data.count;
                    comments.value.push(...response.data.comments);
                    commentContinuation.value = response.data.continuation;
                })
                .catch((e) => {
                    console.log(e);
                })
                .finally(() => (fetchingComments.value = false));
        };

        watch(
            () => route.query.v,
            () => {
                commentCount.value = 0;
                comments.value = [];
                commentContinuation.value = undefined;

                fetch();
                fetchComments();
            }
        );

        fetch();
        fetchComments();

        return {
            video,
            sources,
            related,
            suitableSources,
            formattedDate,

            commentCount,
            comments,
            commentContinuation,
            fetchingComments,

            error,
            fetching,
            fetch,
            fetchComments,

            chooseImage,
            formatNumber,
            formatSeconds,
        };
    },
};
</script>

<style scoped lang="scss">
.watch-container {
    margin-top: 1rem;

    display: flex;
    gap: 1rem;

    & > .main-content {
        flex-grow: 1;

        .video-placeholder {
            position: relative;
            padding-top: (100% * 9 / 16);

            background-color: black;

            & > .error-text {
                position: absolute;
                @include absoluteCenter();

                display: flex;
                align-items: center;
                gap: 1rem;

                color: white;

                font-size: 1.5rem;

                & > i {
                    color: $gray-500;

                    font-size: 8rem;
                }
            }
        }

        .video-info {
            border-bottom: 1px solid $gray-300;

            h1.title {
                margin-top: 1.25rem;

                font-size: 1.125rem;
                font-weight: normal;
            }

            p.subtitle {
                color: $gray-700;

                font-size: 0.875rem;
            }
        }

        .video-details {
            margin-top: 1rem;
            padding-bottom: 1rem;

            display: flex;
            gap: 1rem;

            border-bottom: 1px solid $gray-300;

            .author-image {
                flex: 0 0 3rem;

                width: 3rem;
                height: 3rem;

                border-radius: 100%;
                background-color: $gray-300;
            }

            .details {
                flex-grow: 1;

                .author-info {
                    height: 3rem;

                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    gap: 0.125rem;

                    p {
                        margin: 0;
                    }

                    .author-name {
                        color: inherit;

                        text-decoration: none;
                        font-size: 0.875rem;
                        font-weight: 500;

                        &:hover {
                            text-decoration: underline;
                        }
                    }

                    .verified {
                        margin-left: 0.25rem;

                        color: $gray-700;

                        font-size: 0.875rem;
                    }

                    .author-subtitle {
                        color: $gray-700;

                        font-size: 0.75rem;
                    }
                }

                .video-description {
                    margin-top: 1rem;

                    font-size: 0.875rem;
                    white-space: pre-line;
                    line-height: 1.5;
                }
            }
        }

        .comments {
            margin-top: 1rem;
            margin-bottom: 3rem;

            display: flex;
            flex-direction: column;
            gap: 2rem;

            .comment-count {
                margin-top: 0.5rem;
            }

            .comment {
                display: flex;
                gap: 1rem;

                & > .author-image {
                    background-color: $gray-300;

                    width: 2.5rem;
                    height: 2.5rem;

                    border-radius: 100%;
                }

                & > .content {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;

                    & > .header {
                        margin: 0;

                        font-size: 0.875rem;
                        font-weight: 500;

                        & > .author-name {
                            color: inherit;

                            text-decoration: none;

                            &:hover {
                                text-decoration: underline;
                            }
                        }

                        & > .timestamp {
                            margin-left: 0.25rem;

                            color: $gray-700;

                            font-size: 0.75rem;
                            font-weight: normal;
                        }
                    }

                    & > .comment-body {
                        margin: 0;

                        font-size: 0.875rem;
                    }

                    & > .likes {
                        margin-top: 0.5rem;

                        display: flex;
                        align-items: center;
                        gap: 1rem;

                        color: $gray-700;

                        & > .like {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;

                            & > .amount {
                                font-size: 0.75rem;
                            }
                        }

                        & > .creator-heart {
                            position: relative;
                            width: 1rem;
                            height: 1rem;

                            & > img {
                                width: 100%;
                                height: 100%;

                                border-radius: 100%;
                            }

                            & > .heart {
                                position: absolute;
                                top: 0.5rem;
                                left: 0.6rem;

                                color: red;

                                font-size: 0.75rem;
                            }
                        }
                    }

                    & > .replies {
                        margin-top: 0.5rem;

                        & > .expand {
                            color: $blue-800;

                            font-weight: 500;
                            font-size: 0.875rem;
                            text-decoration: none;

                            & > .mdi {
                                margin-right: 0.5rem;
                            }
                        }
                    }
                }
            }
        }

        .spinner {
            align-self: center;
        }
    }

    & > .sidebar {
        flex: 0 0 402px;

        .related-videos {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            .related-video {
                display: flex;
                gap: 0.5rem;

                color: inherit;
                text-decoration: none;

                cursor: pointer;

                &:active {
                    background-color: $gray-300;
                    box-shadow: 0 0 0 5px $gray-300;
                }

                & > .thumbnail {
                    flex: 0 0 168px;
                    height: 94px;

                    position: relative;

                    background-color: black;

                    & > img {
                        width: 100%;
                        height: 100%;
                    }

                    & > .video-length {
                        position: absolute;
                        bottom: 0.25rem;
                        right: 0.25rem;
                        padding: 0.1rem 0.2rem;

                        color: white;
                        background-color: rgba(black, 80%);
                        border-radius: 0.1rem;

                        font-size: 0.75rem;
                        font-weight: 500;
                    }
                }

                & > .video-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.375rem;

                    & > .title {
                        margin: 0;

                        font-size: 0.875rem;
                        font-weight: 500;
                    }

                    & > .author {
                        margin: 0;

                        color: $gray-700;

                        font-size: 0.75rem;

                        & > a {
                            color: inherit;
                            text-decoration: none;

                            &:hover {
                                text-decoration: underline;
                            }
                        }

                        .verified {
                            margin-left: 0.25rem;

                            color: $gray-700;

                            font-size: 0.75rem;
                        }
                    }

                    & > .details {
                        margin: 0;

                        color: $gray-700;

                        font-size: 0.75rem;
                    }
                }
            }
        }
    }
}
</style>
