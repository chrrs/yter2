<template>
    <div class="flex w-96">
        <div
            class="relative flex-none h-24 bg-gray-300"
            :style="`width: ${6 * (16 / 9)}rem`"
        ></div>
        <div class="ml-2">
            <p class="font-medium text-sm">
                <SkeletonLine />
                <br />
                <SkeletonLine width="100" />
            </p>
            <a href="#" class="mt-2 text-sm text-gray-600">
                <SkeletonLine width="175" />
            </a>
            <p class="leading-tight text-sm text-gray-600">
                <SkeletonLine width="150" />
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import SkeletonLine from './SkeletonLine.vue';

export default {
    name: 'SkeletonRecommendedVideo',
    components: {
        SkeletonLine,
    },
};
</script>
