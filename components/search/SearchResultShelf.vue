<template>
    <div class="flex flex-col pb-4 border-t border-b border-gray-300">
        <p class="my-6 font-medium">{{ title }}</p>
        <div class="flex flex-col gap-4">
            <SearchResultVideo
                v-for="video in expanded ? videos : videos.slice(0, 2)"
                :key="video.id"
                :video="video"
            />
        </div>
        <a
            v-if="!expanded"
            href="javascript:void(0)"
            class="inline-block self-center pt-4 font-medium uppercase text-gray-600"
            @click="expanded = true"
        >
            + {{ videos.length - 2 }} more
        </a>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'SearchResultShelf',
    props: {
        title: {
            type: String,
            default: 'Shelf',
        },
        videos: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            expanded: false,
        };
    },
});
</script>
