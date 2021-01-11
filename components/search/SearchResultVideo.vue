<template>
    <NuxtLink
        :to="{ name: 'watch', query: { v: video.id } }"
        class="flex w-full"
    >
        <div
            v-lazy-container="{ selector: 'img' }"
            class="relative flex-none w-80"
            :style="`height: ${20 * (9 / 16)}rem`"
        >
            <img
                class="w-full h-full max-w-none object-cover bg-gray-300"
                :data-src="bestFittingImage(video.thumbnails, 320 * 2).url"
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
        <div class="ml-4">
            <p class="text-lg">
                {{ video.title }}
            </p>
            <p class="text-sm text-gray-600">
                <VideoBadge
                    v-for="badge in video.badges"
                    :key="badge.text"
                    :badge="badge"
                />
                {{ videoSubtitle(video) }}
            </p>
            <NuxtLink
                v-lazy-container="{ selector: 'img' }"
                :to="`/channel/${video.author.id}`"
                class="flex gap-2 items-center inline-block my-4 text-sm text-gray-600 hover:underline"
            >
                <img
                    class="inline-block w-6 h-6 rounded-full"
                    :data-src="
                        bestFittingImage(video.author.avatars, 24 * 2).url
                    "
                    alt=""
                />
                <p>
                    {{ video.author.name }}
                    <span
                        v-if="video.author.verified"
                        class="mdi mdi-check text-gray-600"
                    ></span>
                </p>
            </NuxtLink>
            <p class="text-sm text-gray-600">{{ video.description }}</p>
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
    bestFittingImage,
    formatDuration,
    Video,
    videoSubtitle,
} from '~/assets/api_types';

export default Vue.extend({
    name: 'SearchResultVideo',
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
