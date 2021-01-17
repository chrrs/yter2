<template>
    <div class="flex w-full">
        <div
            v-lazy-container="{ selector: 'img' }"
            class="relative flex-none w-80"
            :style="`height: ${20 * (9 / 16)}rem`"
        >
            <img
                class="w-full h-full max-w-none object-cover bg-gray-300"
                :data-src="bestFittingImage(playlist.thumbnails, 320 * 2).url"
                alt=""
            />

            <div
                class="flex flex-col justify-center items-center absolute bottom-0 right-0 w-1/3 h-full bg-black bg-opacity-80 text-white"
            >
                <p>{{ playlist.video_count.toLocaleString('en-US') }}</p>
                <span class="mdi mdi-playlist-play text-xl"></span>
            </div>
        </div>
        <div class="ml-4">
            <p class="text-lg">
                {{ playlist.name }}
            </p>
            <NuxtLink :to='`/channel/${playlist.owner.id}`' class="text-sm text-gray-600 hover:underline">
                {{ playlist.owner.name }}
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { bestFittingImage, Playlist } from '~/assets/api_types';

export default Vue.extend({
    name: 'SearchResultPlaylist',
    props: {
        playlist: {
            type: Object as PropType<Playlist>,
            required: true,
        },
    },
    methods: {
        bestFittingImage,
    },
});
</script>
