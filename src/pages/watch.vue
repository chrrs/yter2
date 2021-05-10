<template>
    <div class="watch-container">
        <div class="main-content">
            <div v-if="true || error || fetching" class="video-placeholder">
                <p class="error-text" v-if="error">
                    <i class="mdi mdi-alert-circle-outline"></i>
                    Video not available
                </p>
            </div>
            <div v-if="!fetching" class="video-info">
                <h1 class="title">{{ video.title }}</h1>
                <p class="subtitle">{{ formattedViews }} views</p>
            </div>
            <p v-if="!fetching" style="white-space: pre-line; font-size: 0.875rem">
                {{ video.description }}
            </p>
        </div>
        <div class="sidebar"></div>
    </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from 'vue';

import SkeletonLine from '../components/skeleton/SkeletonLine.vue';
import SkeletonRecommendedVideo from '../components/skeleton/SkeletonRecommendedVideo.vue';
import { useRoute } from 'vue-router';
import axios, { AxiosResponse } from 'axios';
import { ApiError, ApiVideo, Video } from '../api_v1/api_v1';

export default {
    components: {
        SkeletonLine,
        SkeletonRecommendedVideo,
    },
    setup() {
        const route = useRoute();

        const error = ref(false);
        const fetching = ref(true);
        const video = ref<Video>(null);

        const formattedViews = computed(() =>
            video.value.views.toLocaleString('en-US')
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
            formattedViews,

            error,
            fetching,
            fetch,
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
    }

    & > .sidebar {
        flex: 0 0 402px;
    }
}
</style>
