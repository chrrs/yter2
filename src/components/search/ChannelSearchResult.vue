<template>
    <ClickableDiv class="channel-result" to="">
        <div class="avatar">
            <LazyImage
                :src="chooseImage(channel.avatar, 272).url"
                :alt="`${channel.name}`"
            />
        </div>
        <div class="channel-details">
            <p class="channel-name">
                {{ channel.name
                }}<i
                    v-if="channel.verified"
                    class="verified mdi mdi-check-circle"
                ></i>
            </p>
            <p class="subtitle">
                {{ formatNumber(channel.subscribers) }}
                subscribers
                <template v-if="channel.videos">
                    •
                    {{ channel.videos.toLocaleString('en-US') }}
                    video{{ channel.videos === 1 ? '' : 's' }}
                </template>
            </p>
            <p class="description">
                {{ channel.description }}
            </p>
        </div>
    </ClickableDiv>
</template>

<script lang="ts">
import { PropType, toRefs } from 'vue';
import { Channel } from '../../api_v1/api_v1';
import { chooseImage, formatNumber } from '../../util';
import ClickableDiv from '../ClickableDiv.vue';
import LazyImage from '../LazyImage.vue';

export default {
    name: 'ChannelSearchResult',
    components: { LazyImage, ClickableDiv },
    props: {
        channel: {
            type: Object as PropType<Channel>,
            required: true,
        },
    },
    setup(props) {
        const { channel } = toRefs(props);

        return {
            channel,

            chooseImage,
            formatNumber,
        };
    },
};
</script>

<style scoped lang="scss">
.channel-result {
    display: flex;

    .avatar {
        margin-right: 1rem;
        width: 22.5rem;

        @include flexCenter();

        & > img {
            width: 8.5rem;
            height: 8.5rem;

            border-radius: 100%;
        }
    }

    .channel-details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.5rem;

        & > .channel-name {
            margin: 0 0 0.25rem;

            font-size: 1.125rem;

            & > .verified {
                margin-left: 0.25rem;

                color: $gray-700;

                font-size: 1rem;
            }
        }

        & > .subtitle {
            margin: 0;

            color: $gray-700;

            font-size: 0.75rem;
        }

        & > .description {
            margin: 0;

            color: $gray-700;

            font-size: 0.75rem;
        }
    }
}
</style>
