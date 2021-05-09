<template>
    <div class="container px-4 lg:px-16 mx-auto mt-4 flex gap-4">
        <div class="flex-1 flex-grow">
            <div
                v-if="true || fetching"
                class="bg-black w-full h-32"
                style="padding-top: 56.25%"
            />
            <div class="divide-y divide-gray-300">
                <div class="py-4 relative">
                    <div class="text-xs text-indigo-500">#MinecraftManhunt</div>
                    <p class="text-lg text-black">
                        <template v-if="fetching">
                            <SkeletonLine width="300" />
                        </template>
                        <template v-else>This is the video title</template>
                    </p>
                    <p class="text-sm text-gray-600 mt-2">
                        <template v-if="fetching">
                            <SkeletonLine />
                        </template>
                        <template v-else>
                            5,123,523 views
                            <span class="hidden xl:inline">
                                • May 8, 2021
                            </span>
                        </template>
                    </p>
                    <div
                        v-if="!fetching"
                        class="absolute right-2 bottom-0 flex gap-6 uppercase font-medium text-gray-600"
                    >
                        <div class="h-full flex flex-col">
                            <p class="py-2 px-1 flex-grow place-self-center">
                                <span
                                    class="mdi mdi-thumb-up text-gray-500"
                                ></span>
                                0
                                <span
                                    class="mdi mdi-thumb-down ml-2 text-gray-500"
                                ></span>
                                0
                            </p>
                            <div class="relative h-1 w-full bg-gray-300">
                                <div
                                    class="bg-gray-600 h-full"
                                    :style="`width: ${0.5 * 100}%`"
                                ></div>
                            </div>
                        </div>
                        <a
                            class="py-2"
                            :href="`https://youtube.com/watch?v=id`"
                            target="_blank"
                        >
                            <span
                                class="mdi mdi-open-in-new mr-1 text-gray-500"
                            ></span>
                            Youtube
                        </a>
                    </div>
                </div>
                <div class="flex py-4 gap-4">
                    <div
                        v-if="true || fetching"
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
                                <template v-if="true || fetching">
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
                                <template v-if="true || fetching">
                                    <SkeletonLine width="100" />
                                </template>
                                <template v-else>
                                    {{ formatNumber(video.author.subscribers) }}
                                    subscribers
                                </template>
                            </p>
                        </div>
                        <div class="mt-4">
                            <p v-if="fetching" class="text-sm">
                                <SkeletonLine width="150" />
                                <br />
                                <SkeletonLine width="200" />
                                <br />
                                <SkeletonLine width="100" />
                            </p>
                            <p v-else class="description text-sm">
                                <span class="whitespace-pre-line">
                                    Description goes here
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="hidden lg:flex flex-col gap-2 flex-initial w-96">
            <template v-if="true || fetching">
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
import { ref } from 'vue';

import SkeletonLine from '../components/skeleton/SkeletonLine.vue';
import SkeletonRecommendedVideo from '../components/skeleton/SkeletonRecommendedVideo.vue';

export default {
    components: {
        SkeletonLine,
        SkeletonRecommendedVideo,
    },
    setup() {
        let fetching = ref(false);

        return {
            fetching,
        };
    },
};
</script>
