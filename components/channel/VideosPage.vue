<template>
    <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
        class="container px-4 lg:px-16 mx-auto pt-4"
    >
        <div
            v-if="!$fetchState.pending"
            class="flex gap-x-1 gap-y-8 flex-row flex-wrap"
        >
            <NuxtLink
                v-for="video in videos"
                :key="video.id"
                :to="`/watch?v=${video.id}`"
                class="flex-1 max-w-md"
                style="min-width: 14em"
            >
                <div
                    v-lazy-container="{ selector: 'img' }"
                    class="relative w-full"
                    style="padding-top: 56.25%"
                >
                    <img
                        class="w-full h-full object-cover absolute top-0 left-0 bg-gray-300"
                        :data-src="
                            bestFittingImage(video.thumbnails, 200 * 2).url
                        "
                        alt=""
                    />
                    <div
                        v-if="!video.live"
                        class="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 font-semibold"
                    >
                        {{
                            video.upcoming
                                ? 'PREMIERE'
                                : formatDuration(video.lengthSeconds)
                        }}
                    </div>
                </div>
                <p class="text-sm font-medium mt-2">{{ video.title }}</p>
                <p class="text-sm text-gray-600 mt-2">
                    <VideoBadge
                        v-for="badge in video.badges"
                        :key="badge.text"
                        :badge="badge"
                    />
                    {{ videoSubtitle(video) }}
                </p>
            </NuxtLink>
        </div>
        <div
            v-if="continuation && continuation.length !== 0"
            class="flex items-center justify-center py-4"
        >
            <span
                class="mdi mdi-loading mdi-spin text-5xl text-gray-500"
            ></span>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
    ApiChannelVideosResponse,
    bestFittingImage,
    Video,
    videoSubtitle,
    formatDuration,
} from '~/assets/api_types';

export default Vue.extend({
    name: 'VideosPage',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            videos: [] as Video[],
            continuation: '',
            busy: true,
        };
    },
    async fetch() {
        const response = (await this.$axios.$get(
            `/api/v1/channel/${this.$route.params.id}/videos`
        )) as ApiChannelVideosResponse;

        this.videos = response.videos;
        this.continuation = response.continuation;
    },
    mounted() {
        setTimeout(() => (this.busy = false), 100);
    },
    methods: {
        bestFittingImage,
        videoSubtitle,
        formatDuration,
        async loadMore() {
            if (!this.continuation || this.continuation.length === 0) return;

            this.busy = true;

            const response = (await this.$axios.$get(
                `/api/v1/channel/${this.$route.params.id}/videos?continuation=${this.continuation}`
            )) as ApiChannelVideosResponse;

            this.videos = this.videos.concat(response.videos);
            this.continuation = response.continuation;

            setTimeout(() => (this.busy = false), 100);
        },
    },
    fetchOnServer: false,
});
</script>
