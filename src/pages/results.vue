<template>
    <div class="container">
        <div v-if="!error && !fetching" class="results">
            <template v-for="result in results" :key="result">
                <ClickableDiv
                    v-if="result.type === 'channel'"
                    class="channel-result"
                    to=""
                >
                    <div class="avatar">
                        <LazyImage
                            :src="chooseImage(result.channel.avatar, 272).url"
                            :alt="`${result.channel.name}`"
                        />
                    </div>
                    <div class="channel-details">
                        <p class="channel-name">
                            {{ result.channel.name
                            }}<i
                                v-if="result.channel.verified"
                                class="verified mdi mdi-check-circle"
                            ></i>
                        </p>
                        <p class="subtitle">
                            {{ formatNumber(result.channel.subscribers) }}
                            subscribers •
                            {{ result.channel.videos.toLocaleString('en-US') }}
                            video{{ result.channel.videos === 1 ? '' : 's' }}
                        </p>
                        <p class="description">
                            {{ result.channel.description }}
                        </p>
                    </div>
                </ClickableDiv>
                <ClickableDiv
                    v-if="result.type === 'video'"
                    class="video-result"
                    :to="`/watch?v=${result.video.id}`"
                >
                    <LazyImage
                        :src="chooseImage(result.video.thumbnail, 640).url"
                        alt="Video thumbnail"
                        class="thumbnail"
                    />
                    <div class="video-details">
                        <p class="title">{{ result.video.title }}</p>
                        <p class="subtitle">
                            {{
                                (result.video.views || 0).toLocaleString(
                                    'en-US'
                                )
                            }}
                            views • {{ result.video.date }}
                        </p>
                        <div class="author">
                            <LazyImage
                                :src="
                                    chooseImage(result.video.author.avatar, 48)
                                        .url
                                "
                                :alt="`${result.video.author.name}'s profile picture`"
                                class="author-avatar"
                            />
                            <p class="author-name">
                                <a href="#">{{ result.video.author.name }}</a>
                                <i
                                    v-if="result.video.author.verified"
                                    class="verified mdi mdi-check-circle"
                                ></i>
                            </p>
                        </div>
                        <div class="description">
                            {{ result.video.description }}
                        </div>
                    </div>
                </ClickableDiv>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, watch } from 'vue';
import { ApiSearchResults, SearchResult } from '../api_v1/api_v1';
import axios, { AxiosResponse } from 'axios';
import { useRoute } from 'vue-router';
import { chooseImage, formatNumber } from '../util';
import LazyImage from '../components/LazyImage.vue';
import ClickableDiv from '../components/ClickableDiv.vue';

export default {
    components: { ClickableDiv, LazyImage },
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

            chooseImage,
            formatNumber,
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

    .channel-result {
        display: flex;

        .avatar {
            margin-right: 1rem;
            width: 22.5rem;

            @include flexCenter();

            & > img {
                width: 8.5rem;
                height: 8.5rem;

                border-radius: 100%;
            }
        }

        .channel-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.5rem;

            & > .channel-name {
                margin: 0 0 0.25rem;

                font-size: 1.125rem;

                & > .verified {
                    margin-left: 0.25rem;

                    color: $gray-700;

                    font-size: 1rem;
                }
            }

            & > .subtitle {
                margin: 0;

                color: $gray-700;

                font-size: 0.75rem;
            }

            & > .description {
                margin: 0;

                color: $gray-700;

                font-size: 0.75rem;
            }
        }
    }

    .video-result {
        display: flex;

        .thumbnail {
            margin-right: 1rem;
            height: 12.5rem;
            width: 22.5rem;
        }

        .video-details {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            & > .title {
                margin: 0.25rem 0 0;

                font-size: 1.125rem;
            }

            & > .subtitle {
                margin: 0;

                color: $gray-700;

                font-size: 0.75rem;
            }

            & > .author {
                margin: 0.5rem 0;

                display: flex;
                align-items: center;
                gap: 0.5rem;

                & > .author-avatar {
                    width: 1.5rem;
                    height: 1.5rem;

                    border-radius: 100%;
                }

                & > .author-name {
                    margin: 0;

                    color: $gray-700;

                    font-size: 0.75rem;

                    & > a {
                        color: inherit;

                        text-decoration: none;

                        &:hover {
                            text-decoration: underline;
                        }
                    }

                    & > .verified {
                        margin-left: 0.25rem;

                        color: $gray-700;
                    }
                }
            }

            & > .description {
                margin: 0;

                color: $gray-700;

                font-size: 0.75rem;
            }
        }
    }
}
</style>
