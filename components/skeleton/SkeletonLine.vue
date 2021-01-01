<template>
    <span
        :style="{ width: `${width}px` }"
        class="leading-tight inline-block bg-gray-300 text-transparent"
    >
        .
    </span>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'SkeletonLine',
    props: {
        width: {
            type: String,
            default: '200',
        },
    },
});
</script>
