<template>
    <NuxtLink :to="{ name: 'watch', query: { v: video.id } }" class="flex w-96">
        <div
            v-lazy-container="{ selector: 'img' }"
            class="relative flex-none h-24"
            :style="`width: ${6 * (16 / 9)}rem`"
        >
            <img
                class="w-full h-full max-w-none object-cover"
                :data-src="bestFittingImage(video.thumbnails, 170 * 2).url"
                alt=""
            />
            <div
                v-if="!video.live"
                class="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 font-semibold"
            >
                {{ formatDuration(video.lengthSeconds) }}
            </div>
        </div>
        <div class="ml-2">
            <p class="leading-tight font-medium text-sm">
                {{ video.title }}
            </p>
            <NuxtLink
                :to="`/channel/${video.author.id}`"
                class="inline-block mt-1 text-sm text-gray-600 hover:underline"
            >
                {{ video.author.name }}
                <span
                    v-if="video.author.verified"
                    class="mdi mdi-check text-gray-600"
                ></span>
            </NuxtLink>
            <p class="leading-tight text-sm text-gray-600">
                <VideoBadge
                    v-for="badge in video.badges"
                    :key="badge.text"
                    :badge="badge"
                />
                {{ videoSubtitle(video) }}
            </p>
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
    bestFittingImage,
    videoSubtitle,
    formatDuration,
    Video,
} from '~/assets/api_types';

export default Vue.extend({
    name: 'RecommendedVideo',
    props: {
        video: {
            type: Object as PropType<Video>,
            required: true,
        },
    },
    methods: {
        bestFittingImage,
        videoSubtitle,
        formatDuration,
    },
});
</script>
