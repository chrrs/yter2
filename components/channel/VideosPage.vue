<template>
    <div class="container px-4 lg:px-16 mx-auto pt-4">
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
                        class="w-full h-full object-cover absolute top-0 left-0"
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
    async fetch() {
        const response = (await this.$axios.$get(
            `/api/v1/channel/${this.$route.params.id}/videos`
        )) as ApiChannelVideosResponse;

        this.videos = response.videos;
    },
    data() {
        return {
            videos: [] as Video[],
        };
    },
    methods: {
        bestFittingImage,
        videoSubtitle,
        formatDuration,
    },
    fetchOnServer: false,
});
</script>
