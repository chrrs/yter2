<template>
    <div class="results">
        <template v-for="result in results" :key="result">
            <ShelfSearchResult
                v-if="result.type === 'shelf'"
                :shelf="result.shelf"
            />
            <ChannelSearchResult
                v-if="result.type === 'channel'"
                :channel="result.channel"
            />
            <VideoSearchResult
                v-if="result.type === 'video'"
                :video="result.video"
            />
        </template>
    </div>
</template>

<script lang="ts">
import { toRefs, PropType } from 'vue';
import { SearchResult } from '../../api_v1/api_v1';
import VideoSearchResult from './VideoSearchResult.vue';
import ChannelSearchResult from './ChannelSearchResult.vue';
import ShelfSearchResult from './ShelfSearchResult.vue';

export default {
    name: 'SearchResults',
    components: {
        ShelfSearchResult,
        ChannelSearchResult,
        VideoSearchResult,
    },
    props: {
        results: {
            type: Array as PropType<Array<SearchResult>>,
            required: true,
        },
    },
    setup(props) {
        const { results } = toRefs(props);

        return {
            results,
        };
    },
};
</script>

<style scoped lang="scss">
.results {
    margin-top: 1rem;

    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>
