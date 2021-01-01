<template>
    <NuxtLink :to="`/channel/${channel.id}`" class="flex items-center w-full">
        <div
            v-lazy-container="{ selector: 'img' }"
            class="relative flex-none w-80"
        >
            <img
                class="w-32 h-32 rounded-full m-auto"
                :data-src="bestFittingImage(channel.avatars, 128 * 2).url"
                alt=""
            />
        </div>
        <div class="ml-4">
            <p class="text-lg">
                {{ channel.name }}
                <span
                    v-if="channel.verified"
                    class="mdi mdi-check text-gray-600"
                ></span>
            </p>
            <p class="text-sm text-gray-600">
                {{ formatNumber(channel.subscribers) }} subscribers •
                {{ channel.videos }} videos
            </p>
            <p class="mt-1 text-sm text-gray-600">
                {{ channel.description }}
            </p>
        </div>
    </NuxtLink>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { bestFittingImage, formatNumber, Channel } from '~/assets/api_types';

export default Vue.extend({
    name: 'SearchResultChannel',
    props: {
        channel: {
            type: Object as PropType<Channel>,
            required: true,
        },
    },
    methods: {
        bestFittingImage,
        formatNumber,
    },
});
</script>
