<template>
    <div
        v-infinite-scroll="loadMore"
        class="container px-16 mx-auto mt-4"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10"
    >
        <div v-if="$fetchState.pending" class="flex flex-col gap-4">
            <SkeletonSearchResult />
            <SkeletonSearchResult class="opacity-75" />
            <SkeletonSearchResult class="opacity-50" />
            <SkeletonSearchResult class="opacity-25" />
        </div>
        <div v-else>
            <SearchResults :results="results" />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ApiSearchResponse, SearchResult } from '~/assets/api_types';

export default Vue.extend({
    async fetch() {
        const result = (await this.$axios.$get(
            `/api/v1/search?q=${this.$route.query.search_query}`
        )) as ApiSearchResponse;

        this.results = result.results;
        this.continuation = result.continuation;
        this.busy = false;
    },
    data() {
        return {
            results: [] as SearchResult[],
            continuation: '',
            busy: true,
        };
    },
    validate({ query }) {
        return !!query.search_query;
    },
    watch: {
        '$route.query.search_query'() {
            this.$fetch();
        },
    },
    methods: {
        async loadMore() {
            this.busy = true;

            const result = (await this.$axios.$get(
                `/api/v1/search?q=${
                    this.$route.query.search_query
                }&continuation=${encodeURIComponent(this.continuation)}`
            )) as ApiSearchResponse;

            this.results = this.results.concat(result.results);
            this.continuation = result.continuation;

            setTimeout(() => (this.busy = false), 100);
        },
    },
    fetchOnServer: false,
});
</script>
