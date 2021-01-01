<template>
    <nav class="sticky top-0 z-50 bg-white py-3">
        <div class="container px-16 mx-auto">
            <form class="flex" @submit.prevent="search()">
                <div
                    class="border border-gray-300 w-1/2 focus-within:border-indigo-700"
                >
                    <input
                        v-model="query"
                        class="px-2 py-1 w-full focus:outline-none"
                        type="text"
                        placeholder="Search"
                        @focusin="showSuggestions = true"
                        @focusout="focusout()"
                    />
                    <div
                        v-if="
                            showSuggestions && suitableSuggestions.length !== 0
                        "
                        class="relative"
                    >
                        <div
                            class="border border-gray-300 border-t-0 absolute top-3 w-full bg-white"
                        >
                            <a
                                v-for="suggestion in suitableSuggestions"
                                :key="suggestion"
                                href="javascript:void(0)"
                                class="block px-3 py-1 hover:bg-gray-200 font-medium"
                                @click="search(suggestion)"
                            >
                                {{ suggestion }}
                            </a>
                        </div>
                    </div>
                </div>
                <button
                    type="submit"
                    class="group border border-l-0 border-gray-300 px-2 py-1 bg-gray-50 w-16 hover:bg-gray-100 focus:bg-gray-200 focus:outline-none"
                >
                    <span
                        class="mdi mdi-magnify text-gray-500 group-hover:text-black"
                    />
                </button>
            </form>
        </div>
    </nav>
</template>

<script lang="ts">
import Vue from 'vue';
import { debounce } from '~/assets/util';

export default Vue.extend({
    name: 'Navbar',
    data() {
        return {
            showSuggestions: false,
            query: '',
            suggestions: [],
            // @ts-ignore
            refreshSuggestions: debounce(this.refreshSuggestionsNow, 200),
        };
    },
    computed: {
        suitableSuggestions() {
            // @ts-ignore
            return this.suggestions.filter((s: string) =>
                s.includes(this.query)
            );
        },
    },
    watch: {
        query(_newValue) {
            this.refreshSuggestions();
        },
    },
    methods: {
        async refreshSuggestionsNow() {
            if (this.query.length === 0) {
                this.suggestions = [];
            } else {
                this.suggestions = await this.$axios.$get(
                    `/api/v1/search/suggest?q=${this.query}`
                );
            }
        },
        focusout() {
            setTimeout(() => {
                this.showSuggestions = false;
            }, 100);
        },
        search(query: string | null = null) {
            this.showSuggestions = false;

            if (query == null) {
                query = this.query;
            } else {
                this.query = query;
            }

            if (this.query.length === 0) {
                return;
            }

            this.$router.push({
                path: '/results',
                query: {
                    search_query: query,
                },
            });
        },
    },
});
</script>
