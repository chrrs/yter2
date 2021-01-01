<template>
    <div class="flex flex-col gap-4">
        <template v-for="(result, index) in results">
            <SearchResultVideo
                v-if="result.type === 'video'"
                :key="index"
                :video="result.video"
            />
            <SearchResultChannel
                v-else-if="result.type === 'channel'"
                :key="index"
                :channel="result.channel"
            />
            <SearchResultShelf
                v-else-if="result.type === 'shelf'"
                :key="index"
                :title="result.shelf.title"
                :videos="result.shelf.videos"
            />
        </template>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { SearchResult } from '~/assets/api_types';

export default Vue.extend({
    name: 'SearchResults',
    props: {
        results: {
            type: Array as PropType<Array<SearchResult>>,
            required: true,
        },
    },
});
</script>
