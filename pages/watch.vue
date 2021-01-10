<template>
    <div class="container px-16 mx-auto mt-4 flex gap-4">
        <div class="flex-1 flex-grow">
            <div
                v-if="$fetchState.pending"
                class="bg-black w-full h-32"
                style="padding-top: 56.25%"
            />
            <Player
                v-else
                class="w-full"
                :sources="sources.filter((s) => s.hasAudio && s.hasVideo)"
                :storyboards="`/api/v1/storyboards/${video.id}?width=179&height=90`"
            />
            <div class="divide-y divide-gray-300">
                <div class="py-4">
                    <!--<div class="text-xs text-indigo-500">#MinecraftManhunt</div>-->
                    <p class="text-lg text-black">
                        <template v-if="$fetchState.pending">
                            <SkeletonLine width="300" />
                        </template>
                        <template v-else>{{ video.title }}</template>
                    </p>
                    <p class="text-sm text-gray-600 mt-2">
                        <template v-if="$fetchState.pending">
                            <SkeletonLine />
                        </template>
                        <template v-else>
                            {{ video.views.toLocaleString('en-US') }} views •
                            {{
                                format(
                                    new Date(video.publishDate),
                                    'MMM d, yyyy'
                                )
                            }}
                        </template>
                    </p>
                </div>
                <div class="flex py-4 gap-4">
                    <div
                        v-if="$fetchState.pending"
                        class="flex-initial w-12 h-12 rounded-full bg-gray-300"
                    ></div>
                    <img
                        v-else
                        ref="authorImage"
                        class="flex-initial w-12 h-12 rounded-full"
                        :src="
                            bestFittingImage(video.author.avatars, 48 * 2).url
                        "
                        alt=""
                    />
                    <div class="flex-1">
                        <div class="flex flex-col justify-center h-12">
                            <p class="text-sm font-medium">
                                <template v-if="$fetchState.pending">
                                    <SkeletonLine width="150" />
                                </template>
                                <NuxtLink
                                    v-else
                                    :to="`/channel/${video.author.id}`"
                                    class="hover:underline"
                                >
                                    {{ video.author.name }}
                                    <span
                                        v-if="video.author.verified"
                                        class="mdi mdi-check text-gray-600"
                                    ></span>
                                </NuxtLink>
                            </p>
                            <p class="text-sm text-gray-600 leading-tight">
                                <template v-if="$fetchState.pending">
                                    <SkeletonLine width="100" />
                                </template>
                                <template v-else>
                                    {{ formatNumber(video.author.subscribers) }}
                                    subscribers
                                </template>
                            </p>
                        </div>
                        <div class="mt-4">
                            <p v-if="$fetchState.pending" class="text-sm">
                                <SkeletonLine width="150" />
                                <br />
                                <SkeletonLine width="200" />
                                <br />
                                <SkeletonLine width="100" />
                            </p>
                            <p v-else class="description text-sm">
                                <span class="whitespace-pre-line">{{
                                    video.description
                                }}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-2 flex-initial w-96">
            <template v-if="$fetchState.pending">
                <SkeletonRecommendedVideo />
                <SkeletonRecommendedVideo class="opacity-80" />
                <SkeletonRecommendedVideo class="opacity-60" />
                <SkeletonRecommendedVideo class="opacity-40" />
                <SkeletonRecommendedVideo class="opacity-20" />
            </template>
            <template v-else>
                <RecommendedVideo
                    v-for="recommended in recommendedVideos"
                    :key="recommended.id"
                    :video="recommended"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { format } from 'date-fns';
import {
    ApiVideoResponse,
    bestFittingImage,
    formatNumber,
    Video,
    VideoSource,
} from '~/assets/api_types';

export default Vue.extend({
    async fetch() {
        const response = (await this.$axios.$get(
            `/api/v1/video/${this.$route.query.v}`
        )) as ApiVideoResponse;

        this.video = response.video;
        this.recommendedVideos = response.related;
        this.sources = response.sources;
    },
    data() {
        return {
            video: null as Video | null,
            recommendedVideos: [] as Video[],
            sources: [] as VideoSource[],
        };
    },
    validate({ query }) {
        return !!query.v && /^([A-Za-z0-9\-_]){11}$/.test(query.v as string);
    },
    watch: {
        '$route.query.v'() {
            this.$fetch();
        },
    },
    methods: {
        bestFittingImage,
        formatNumber,
        format,
    },
    head() {
        return {
            // @ts-ignore
            title: this.video ? `${this.video.title} - yter2` : 'yter2',
        };
    },
    fetchOnServer: false,
});
</script>

<style lang="scss">
.description {
    a {
        @apply text-indigo-500;
    }
}
</style>
