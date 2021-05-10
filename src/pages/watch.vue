<template>
    <div class="watch-container">
        <div class="main-content">
            <div v-if="error || fetching" class="video-placeholder">
                <p class="error-text" v-if="error">
                    <i class="mdi mdi-alert-circle-outline"></i>
                    Video not available
                </p>
            </div>
            <Player v-else :sources="suitableSources" />
            <div v-if="!fetching" class="video-info">
                <h1 class="title">{{ video.title }}</h1>
                <p class="subtitle">{{ formattedViews }} views</p>
            </div>
            <div v-if="!fetching" class="video-details">
                <img
                    :src="chooseImage(video.author.avatar, 96).url"
                    :alt="`${video.author.name}'s profile picture`"
                    class="author-image"
                />
                <div class="details">
                    <div class="author-info">
                        <p>
                            <a href="#" class="author-name">
                                {{ video.author.name }}
                            </a>
                            <i
                                v-if="video.author.verified"
                                class="verified mdi mdi-check-circle"
                            ></i>
                        </p>
                        <p class="author-subtitle">
                            {{ formatNumber(video.author.subscribers) }}
                            subscribers
                        </p>
                    </div>
                    <div class="video-description">{{ video.description }}</div>
                </div>
            </div>
        </div>
        <div class="sidebar"></div>
    </div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';

import Player from '../components/Player.vue';
import { useRoute } from 'vue-router';
import axios, { AxiosResponse } from 'axios';
import { ApiError, ApiVideo, Video, VideoFormat } from '../api_v1/api_v1';
import { chooseImage, formatNumber } from '../util';

export default {
    components: {
        Player,
    },
    setup() {
        const route = useRoute();

        const error = ref(false);
        const fetching = ref(true);
        const video = ref<Video>(null);
        const sources = ref<Array<VideoFormat>>([]);

        const formattedViews = computed(() =>
            video.value.views.toLocaleString('en-US')
        );

        const suitableSources = computed(() =>
            sources.value.filter((format) => format.hasAudio && format.hasVideo)
        );

        const fetch = () => {
            fetching.value = true;

            if (!/^([A-Za-z0-9\-_]){11}$/.test(route.query.v)) {
                error.value = true;
                fetching.value = false;
                return;
            }

            axios
                .get(`/api/v1/video/${route.query.v}`)
                .then((response: AxiosResponse<ApiVideo | ApiError>) => {
                    if (response.data.error) {
                        throw Error(response.data.error);
                    }

                    video.value = response.data.info;
                    sources.value = response.data.formats;
                })
                .catch((e) => {
                    console.log(e);
                    error.value = true;
                })
                .finally(() => (fetching.value = false));
        };

        fetch();

        return {
            video,
            sources,
            suitableSources,
            formattedViews,

            error,
            fetching,
            fetch,

            chooseImage,
            formatNumber,
        };
    },
};
</script>

<style scoped lang="scss">
.watch-container {
    width: 100vw;
    max-width: 1536px;
    margin: 1rem auto 0;

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

            display: flex;
            gap: 1rem;

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
                }
            }
        }
    }

    & > .sidebar {
        flex: 0 0 402px;
    }
}
</style>
