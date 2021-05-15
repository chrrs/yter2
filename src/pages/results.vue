<template>
    <div class="results container">
        <SearchResults v-if="!error && !fetching" :results="results" />
        <InfiniteScroll
            v-if="!fetching && continuation"
            class="spinner"
            :disabled="fetchingMore"
            @loadMore="fetchMore()"
        ></InfiniteScroll>
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { ApiSearchResults, SearchResult } from '../api_v1/api_v1';
import axios, { AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';
import SearchResults from '../components/search/SearchResults.vue';
import InfiniteScroll from '../components/InfiniteScroll.vue';

export default {
    components: { SearchResults, InfiniteScroll },
    setup() {
        const route = useRoute();
        const fetching = ref(true);
        const fetchingMore = ref(false);
        const error = ref(false);
        const results = ref<Array<SearchResult>>([]);
        const continuation = ref<string | undefined>(undefined);

        const fetch = () => {
            fetching.value = true;

            if (typeof window === 'undefined') {
                return;
            }

            if (typeof route.query.search_query === 'undefined') {
                error.value = true;
                fetching.value = false;
                return;
            }

            axios
                .get(`/api/v1/search?q=${route.query.search_query}`)
                .then((response: AxiosResponse<ApiSearchResults>) => {
                    results.value = response.data.results;
                    continuation.value = response.data.continuation;
                })
                .catch((e) => {
                    console.log(e);
                    error.value = true;
                })
                .finally(() => (fetching.value = false));
        };

        const fetchMore = () => {
            if (typeof continuation.value === 'undefined') {
                return;
            }

            fetchingMore.value = true;

            axios
                .get(`/api/v1/search?continuation=${continuation.value}`)
                .then((response: AxiosResponse<ApiSearchResults>) => {
                    results.value.push(...response.data.results);
                    continuation.value = response.data.continuation;
                })
                .finally(() => (fetchingMore.value = false));
        };

        watch(() => route.query.search_query, fetch);

        fetch();

        return {
            fetching,
            fetchingMore,
            continuation,
            fetchMore,
            error,
            results,
        };
    },
};
</script>

<style scoped lang="scss">
.results {
    margin-bottom: 3rem;

    display: flex;
    flex-direction: column;

    .spinner {
        align-self: center;
    }
}
</style>
