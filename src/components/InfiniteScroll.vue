<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { ref, toRefs } from 'vue';

export default {
    name: 'InfiniteScroll',
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['loadMore'],
    setup(props, { emit }) {
        const { disabled } = toRefs(props);
        const wrapper = ref<HTMLElement>();

        document.body.onscroll = () => {
            if (!wrapper.value) return;

            const rect = wrapper.value?.getBoundingClientRect();
            const viewHeight = Math.max(
                document.documentElement.clientHeight,
                window.innerHeight
            );

            if (rect.bottom >= 0 && rect.top - viewHeight < 0) {
                if (!disabled.value) {
                    emit('loadMore');
                }
            }
        };

        return {
            wrapper,
        };
    },
};
</script>
