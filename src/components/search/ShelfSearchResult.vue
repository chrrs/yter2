<template>
    <div class="shelf">
        <p class="name">{{ shelf.name }}</p>
        <div class="items">
            <template
                v-for="item in expanded ? shelf.items : shelf.items.slice(0, 2)"
                :key="item"
            >
                <ChannelSearchResult
                    v-if="item.type === 'channel'"
                    :channel="item.channel"
                />
                <VideoSearchResult
                    v-if="item.type === 'video'"
                    :video="item.video"
                />
            </template>
            <a
                class="expand-button"
                v-if="!expanded && shelf.items.length > 2"
                href="javascript:void(0)"
                @click="expanded = true"
            >
                + {{ shelf.items.length - 2 }} more
            </a>
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, toRefs, ref } from 'vue';
import { Shelf } from '../../api_v1/api_v1';
import VideoSearchResult from './VideoSearchResult.vue';
import ChannelSearchResult from './ChannelSearchResult.vue';

export default {
    name: 'ShelfSearchResult',
    components: { ChannelSearchResult, VideoSearchResult },
    props: {
        shelf: {
            type: Object as PropType<Shelf>,
            required: true,
        },
    },
    setup(props) {
        const { shelf } = toRefs(props);

        const expanded = ref(false);

        return {
            shelf,
            expanded,
        };
    },
};
</script>

<style scoped lang="scss">
.shelf {
    border-top: 1px solid $gray-300;
    border-bottom: 1px solid $gray-300;

    padding-bottom: 1rem;

    .name {
        margin: 1.5rem 0;

        font-size: 1rem;
        font-weight: 500;
    }

    .items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .expand-button {
        color: $gray-800;

        text-align: center;
        text-transform: uppercase;
        text-decoration: none;
        font-size: 0.8125rem;
        font-weight: 500;
    }
}
</style>
