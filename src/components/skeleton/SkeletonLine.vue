<template>
    <span
        :style="{ width: `${width}px` }"
        class="leading-tight inline-block bg-gray-300 text-transparent"
    >
        .
    </span>
</template>

<script lang="ts">
export default {
    name: 'SkeletonLine',
    props: {
        width: {
            type: String,
            default: '200',
        },
    },
};
</script>
