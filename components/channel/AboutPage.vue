<template>
    <div class="container px-4 lg:px-16 mx-auto pt-8">
        <p>Description</p>
        <p class="whitespace-pre-line text-sm border-b border-gray-300 pb-8">
            {{ channel.description }}
        </p>
    </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Channel } from '~/assets/api_types';

export default Vue.extend({
    name: 'AboutPage',
    props: {
        channel: {
            type: Object as PropType<Channel>,
            required: true,
        },
    },
});
</script>
