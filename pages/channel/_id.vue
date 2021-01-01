<template>
    <div>
        <div class="bg-gray-50 w-full">
            <div
                v-if="$fetchState.pending"
                class="w-full h-56 bg-gray-300"
            ></div>
            <img
                v-else
                class="w-full h-56 object-cover"
                :src="bestFittingImage(channel.banners, 99999).url"
                alt=""
            />
            <div class="container px-16 mx-auto">
                <div class="flex mt-4 mb-2 gap-6">
                    <div
                        v-if="$fetchState.pending"
                        class="rounded-full w-20 h-20 bg-gray-300"
                    ></div>
                    <img
                        v-else
                        class="rounded-full w-20 h-20"
                        :src="bestFittingImage(channel.avatars, 80 * 2).url"
                        alt=""
                    />
                    <div class="flex flex-col justify-center">
                        <p class="text-2xl">
                            <template v-if="$fetchState.pending">
                                <SkeletonLine width="150" />
                            </template>
                            <template v-else>
                                {{ channel.name }}
                                <span
                                    v-if="channel.verified"
                                    class="mdi mdi-check text-gray-600"
                                ></span>
                            </template>
                        </p>
                        <p class="text-sm text-gray-600">
                            <template v-if="$fetchState.pending">
                                <SkeletonLine width="100" />
                            </template>
                            <template v-else>
                                {{ formatNumber(channel.subscribers) }}
                                subscribers
                            </template>
                        </p>
                    </div>
                </div>
                <div>
                    <a
                        v-for="page in pages"
                        :key="page"
                        href="javascript:void(0)"
                        class="inline-block font-medium py-2 px-8 uppercase"
                        :class="
                            currentPage === page
                                ? 'border-gray-600 border-black'
                                : 'border-transparent text-gray-600 hover:text-black'
                        "
                        style="border-bottom-width: 3px"
                        @click="currentPage = page"
                    >
                        {{ page }}
                    </a>
                </div>
            </div>
        </div>
        <div class="min-h-screen bg-gray-100">
            <VideosPage
                v-show="currentPage === 'Videos'"
                :id="this.$route.params.id"
            />
            <AboutPage
                v-if="!$fetchState.pending && currentPage === 'About'"
                :channel="channel"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { bestFittingImage, Channel, formatNumber } from '~/assets/api_types';

export default Vue.extend({
    async fetch() {
        this.channel = (await this.$axios.$get(
            `/api/v1/channel/${this.$route.params.id}`
        )) as Channel;
    },
    data() {
        return {
            channel: null as Channel | null,
            pages: ['Videos', 'About'],
            currentPage: 'Videos',
        };
    },
    validate({ params }) {
        return /[a-zA-Z0-9-]+/.test(params.id);
    },
    methods: {
        formatNumber,
        bestFittingImage,
    },
    fetchOnServer: false,
});
</script>

<style lang="scss" scoped>
// FIXME: This doesn't work
#background {
    @apply bg-gray-100;
}
</style>
