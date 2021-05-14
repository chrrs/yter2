<template>
    <div class="container">
        <SearchResults v-if="!error && !fetching" :results="results" />
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { ApiSearchResults, SearchResult } from '../api_v1/api_v1';
import axios, { AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';
import SearchResults from '../components/search/SearchResults.vue';

export default {
    components: { SearchResults },
    setup() {
        const route = useRoute();
        const fetching = ref(true);
        const error = ref(false);
        const results = ref<Array<SearchResult>>([]);

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
                })
                .catch((e) => {
                    console.log(e);
                    error.value = true;
                })
                .finally(() => (fetching.value = false));
        };

        watch(() => route.query.search_query, fetch);

        fetch();

        return {
            fetching,
            error,
            results,
        };
    },
};
</script>

<style scoped lang="scss"></style>
