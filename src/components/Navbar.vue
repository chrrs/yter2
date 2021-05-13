<template>
    <div class="navbar-wrapper">
        <div class="container">
            <form class="search-form" @submit.prevent="search()">
                <div class="input-wrapper">
                    <input
                        placeholder="Search"
                        v-model="query"
                        @focusin="showSuggestions = true"
                        @focusout="focusOut()"
                    />

                    <div
                        v-if="showSuggestions && suggestions.length !== 0"
                        class="suggestions"
                    >
                        <a
                            v-for="suggestion in suggestions"
                            :key="suggestion.text"
                            href="javascript:void(0)"
                            @click="search(suggestion.text)"
                            v-html="suggestion.display"
                        ></a>
                    </div>
                </div>
                <button type="submit">
                    <span class="mdi mdi-magnify" />
                </button>
            </form>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { debounce } from '../util';

export default {
    name: 'Navbar',
    setup() {
        const showSuggestions = ref(false);
        const query = ref('');
        const router = useRouter();
        const suggestions = ref<Array<{ display: string; text: string }>>([]);

        const focusOut = () =>
            setTimeout(() => {
                showSuggestions.value = false;
            }, 100);

        const search = (searchQuery: string = query.value) => {
            showSuggestions.value = false;

            query.value = searchQuery;
            if (searchQuery.length === 0) {
                return;
            }

            router.push({
                path: '/results',
                query: {
                    search_query: searchQuery,
                },
            });
        };

        const fetchSuggestions = async () => {
            if (query.value.length === 0) {
                suggestions.value = [];
                return;
            }

            suggestions.value = (
                await axios.get(
                    `/api/v1/search/suggest?q=${encodeURIComponent(
                        query.value
                    )}`
                )
            ).data.map((suggestion) => {
                return {
                    display: suggestion
                        .toLowerCase()
                        .replaceAll('<', '&lt;')
                        .replaceAll(
                            query.value.toLowerCase(),
                            `<span>${query.value.toLowerCase()}</span>`
                        ),
                    text: suggestion,
                };
            });
        };

        const fetchSuggestionsDebounced = debounce(fetchSuggestions, 200);

        watch(query, () => {
            showSuggestions.value = true;
            fetchSuggestionsDebounced();
        });

        return {
            showSuggestions,
            focusOut,
            query,
            search,
            suggestions,
        };
    },
};
</script>

<style lang="scss">
.navbar-wrapper .suggestions a > span {
    font-weight: normal;
}
</style>

<style scoped lang="scss">
.navbar-wrapper {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 50;

    background-color: white;
    padding: 0.75rem 0;

    & > .container {
        @include flexCenter();
    }

    .search-form {
        flex-grow: 1;
        max-width: 42rem;

        display: flex;
        flex-direction: row;

        & > .input-wrapper {
            position: relative;
            flex-grow: 1;

            border: 1px solid $gray-300;

            &:focus-within {
                border-color: $indigo-500;
            }

            & > input {
                @include fontSans();

                width: 100%;
                padding: 0.4rem 0.5rem;

                border: none;
                outline: none;
                background: none;

                &::placeholder {
                    color: $gray-600;
                }
            }

            & > .suggestions {
                position: absolute;
                top: 1.8125rem + 1rem;
                left: 0;
                width: 100%;
                padding: 1rem 0;

                display: flex;
                flex-direction: column;

                background-color: white;
                border: 1px solid $gray-300;
                border-top: none;

                & > a {
                    width: 100%;
                    padding: 0.5rem 1rem;

                    color: inherit;

                    text-decoration: none;
                    font-weight: 500;

                    &:hover {
                        background-color: $gray-200;
                    }
                }
            }
        }

        & > button {
            padding: 0.4rem 1.5rem;

            border: 1px solid $gray-300;
            border-left: none;
            color: $gray-600;
            background-color: $gray-50;

            &:hover {
                color: black;
                background-color: $gray-100;
            }

            &:focus {
                background-color: $gray-200;
            }
        }
    }
}
</style>
