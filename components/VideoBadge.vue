<template>
    <span
        :class="
            badge.type === 'live'
                ? 'inline-block text-red-700 border-2 px-1 border-red-700 mr-1 font-medium'
                : 'inline-block bg-gray-200 text-gray-700 px-1 mr-1'
        "
    >
        {{ badge.text }}
    </span>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { VideoBadge } from '~/assets/api_types';

export default Vue.extend({
    name: 'VideoBadge',
    props: {
        badge: {
            type: Object as PropType<VideoBadge>,
            required: true,
        },
    },
});
</script>
