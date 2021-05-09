<template>
    <div class="flex w-full">
        <div
            class="relative flex-none w-80 object-cover bg-gray-300"
            :style="`height: ${20 * (9 / 16)}rem`"
        />
        <div class="ml-4">
            <p class="text-lg">
                <SkeletonLine width="300" />
            </p>
            <p class="text-sm text-gray-600">
                <SkeletonLine />
            </p>
            <p class="text-sm text-gray-600">
                <SkeletonLine width="250" />
                <br />
                <SkeletonLine width="150" />
            </p>
        </div>
    </div>
</template>

<script lang="ts">
import SkeletonLine from './SkeletonLine.vue';

export default {
    name: 'SkeletonSearchResult',
    components: {
        SkeletonLine,
    },
};
</script>
